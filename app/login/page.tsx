'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-10 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Image
            src="/logo.svg"
            alt="App Logo"
            width={70}
            height={70}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">
            Welcome to <span className="text-blue-500 italic">Job Tracker</span>
          </h1>
          <p className="text-gray-400 mb-8 text-sm">
            Track and organize all your job applications in one place.
          </p>
        </motion.div>

        <motion.button
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-3 bg-white text-gray-900 w-full py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-all"
        >
          <Image
            src="/google-icon.svg"
            alt="Google Icon"
            width={22}
            height={22}
          />
          Continue with Google
        </motion.button>

        <p className="text-gray-500 text-xs mt-6">
          By continuing, you agree to our{' '}
          <span className="text-blue-400 cursor-pointer hover:underline">
            Terms
          </span>{' '}
          and{' '}
          <span className="text-blue-400 cursor-pointer hover:underline">
            Privacy Policy
          </span>.
        </p>
      </motion.div>
    </main>
  );
}
