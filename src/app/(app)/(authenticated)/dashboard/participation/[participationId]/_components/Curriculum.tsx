'use client';

import { Course } from '@/payload-types';
import { useEffect, useRef } from 'react';
import { HiVideoCamera, HiPencilAlt } from 'react-icons/hi';

export default function Curriculum({
  course,
  currentProgress,
}: {
  course: Course;
  currentProgress: number;
}) {
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 max-h-[20rem] overflow-y-auto">
      {course.curriculum.map((block, idx) => {
        const isCurrent = idx === currentProgress;

        const baseClass =
          'p-4 border rounded bg-gray-900 transition-all duration-300 ease-in-out';
        const borderClass = isCurrent ? 'border-white' : 'border-gray-700';
        const highlightClass = isCurrent ? 'ring-2 ring-teal-500' : '';

        const commonProps = {
          className: `${baseClass} ${borderClass} ${highlightClass}`,
          ref: isCurrent ? currentRef : undefined,
        };

        if (block.blockType === 'video') {
          return (
            <div key={idx} {...commonProps}>
              <div className="text-teal-400 font-medium flex items-center gap-2">
                <HiVideoCamera className="text-xl" />
                Video: {block.title}
              </div>
              <div className="text-sm text-gray-400">Duration: {block.duration} min</div>
            </div>
          );
        }

        if (block.blockType === 'quiz') {
          return (
            <div key={idx}  {...commonProps}>
              <div className="text-yellow-400 font-medium flex items-center gap-2">
                <HiPencilAlt className="text-xl" />
                Quiz: {block.title}
              </div>
              <div className="text-sm text-gray-400">
                Questions: {block.questions?.length || 0}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}