import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import Input from '@/components/Input';
import useProfileImageStore from '@/hooks/useProfileImageStore';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth = () => {
  const router = useRouter();
  const { selectedImage } = useProfileImageStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [variant, setVariant] = useState('login');
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (formError || formMessage) {
      const t = setTimeout(() => {
        setFormError(null);
        setFormMessage(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [formError, formMessage]);

  useEffect(() => {
    if (router.query?.signedOut) {
      setFormMessage('You have been signed out. See you soon!');
    }
  }, [router.query]);

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []);

  const login = useCallback(async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        setFormError('Invalid email or password.');
      } else {
        setFormMessage('Login successful! Redirecting...');
        router.push('/profiles');
      }
    } catch (error) {
      setFormError('Unable to login. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      });
      setFormMessage('Registration successful! Please wait...');
      login();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Registration failed. Please try again.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [email, name, password, login]);

  return (
    <div className="relative h-full w-full  bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-4 font-semibold">
              {variant === 'login' ? 'Sign in' : 'Register'}
            </h2>
            {router.query?.signedOut && (
              <div className="mb-4 flex items-center gap-4 bg-white/10 rounded-md px-4 py-3 ring-1 ring-white/20">
                <img
                  src={selectedImage || ["/images/profile1.jpg","/images/profile2.jpg","/images/profile3.jpg","/images/profile4.jpg"][Math.floor(Math.random() * 4)]}
                  alt="Signed out mascot"
                  className="w-14 h-14 rounded-md ring-1 ring-white/20 object-cover"
                />
                <div>
                  <p className="text-white font-medium">Signed out</p>
                  <p className="text-neutral-300 text-sm">Take a break and come back anytime.</p>
                </div>
              </div>
            )}
            {formError && (
              <div className="mb-4 bg-red-600 bg-opacity-20 border border-red-600 text-red-500 rounded-md px-4 py-2">
                {formError}
              </div>
            )}
            {formMessage && (
              <div className="mb-4 bg-green-600 bg-opacity-20 border border-green-600 text-green-400 rounded-md px-4 py-2">
                {formMessage}
              </div>
            )}
            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)} 
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address or phone number"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)} 
              />
              <Input
                type="password" 
                id="password" 
                label="Password" 
                value={password}
                onChange={(e: any) => setPassword(e.target.value)} 
              />
            </div>
            <button onClick={variant === 'login' ? login : register} disabled={submitting} className="bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <div onClick={() => signIn('google', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FcGoogle size={32} />
              </div>
              <div onClick={() => signIn('github', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FaGithub size={32} />
              </div>
            </div>
            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'New to Netflix?' : 'Already have an account?'}
              <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                {variant === 'login' ? 'Sign up now' : 'Login'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
