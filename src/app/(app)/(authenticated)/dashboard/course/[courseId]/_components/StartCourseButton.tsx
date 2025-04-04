'use client';

import { participate } from '@/app/(app)/(authenticated)/_actions/participate';
import { useState } from 'react';
import { HiPlay, HiExclamationCircle } from 'react-icons/hi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Participation } from '@/payload-types';

interface StartCourseButtonProps {
  courseId: string;
}

export default function StartCourseButton({ courseId }: StartCourseButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleStartCourse = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    try {
      const participation: Participation = await participate(courseId);
      // redirect to the participation page

      if (!participation) {
        throw new Error('Failed to create participation');
      }
      
      router.push(`/dashboard/participation/${participation.id}`);

    } catch (error: any) {
      console.error('Failed to start course:', error);
      setErrorMessage('Oops! Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <div className="mt-6">
      <button
        onClick={handleStartCourse}
        disabled={isLoading}
        className={`relative inline-flex items-center gap-2 px-6 py-3 font-semibold rounded transition 
          ${isError ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-500 hover:bg-teal-600'} 
          text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-xl" />
          ) : isError ? (
            <HiExclamationCircle className="text-xl" />
          ) : (
            <HiPlay className="text-xl" />
          )}
        </div>
        <span className="pl-6">Start Course</span>
      </button>

      {isError && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
          <HiExclamationCircle />
          {errorMessage}
        </p>
      )}
    </div>
  );
}