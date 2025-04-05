"use client"

import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function NextButton({
  loading,
  text,
  onClick,
}: {
  loading: boolean
  text: string
  onClick: () => void
}) {
  return <button
    onClick={onClick}
    className="bg-teal-500 relative text-black rounded-md p-2 w-full"
    disabled={loading}
  >
    {text}{' '}
    <div className="h-full absolute top-0 left-2 flex items-center justify-center ">
      <AiOutlineLoading3Quarters className={`animate-spin ${loading ? 'block' : 'hidden'}`} />
    </div>
  </button>
}
