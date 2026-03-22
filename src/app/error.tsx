'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)

    // Handle session timeout specifically
    if (error.message.includes('Unauthorized') || error.message.includes('logged in')) {
      router.push('/login?message=Session expired. Please login again.')
    }
  }, [error, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5EC] px-4 text-center">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-md w-full border border-gray-100 italic">
        <h2 className="text-3xl font-medium text-[#005954] mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-8">
          {error.message.includes('Unauthorized') || error.message.includes('logged in')
            ? "Your session has expired. You will be redirected to the login page shortly."
            : "An unexpected error occurred. Please try again later."}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="bg-[#94B546] text-white py-3 rounded-full font-medium hover:bg-[#83a13d] transition-all"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-[#005954] text-white py-3 rounded-full font-medium hover:bg-[#004743] transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}
