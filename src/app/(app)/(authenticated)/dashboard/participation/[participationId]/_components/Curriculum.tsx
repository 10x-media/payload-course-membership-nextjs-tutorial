'use client';

import { Course } from '@/payload-types';
import { useEffect, useRef } from 'react';
import { HiVideoCamera, HiPencilAlt, HiFlag } from 'react-icons/hi';

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
          'p-4 border bg-gray-900 transition-all duration-300 ease-in-out';
        const borderClass = isCurrent ? 'border-2 border-teal-500' : 'border-gray-700';

        const commonProps = {
          className: `${baseClass} ${borderClass}`,
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

        if (block.blockType === "finish") {
          return (
            <div key={idx} {...commonProps}>
              <div className="text-green-400 font-medium flex items-center gap-2">
                <HiFlag className="text-xl" />
                Certificate
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}