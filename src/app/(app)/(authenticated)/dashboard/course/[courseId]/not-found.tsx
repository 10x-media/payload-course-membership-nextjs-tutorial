import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Uh-oh! Page not found 🕵️‍♂️</h1>
      <p className="text-gray-400 mb-6">
        Looks like you took a wrong turn. But no worries — you can head back to safer ground!
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2 bg-teal-500 text-white font-semibold rounded hover:bg-teal-600 transition"
      >
        <HiArrowLeft className="text-lg" />
        Back to Dashboard
      </Link>
    </div>
  );
}