"use client"

import { useState } from 'react'

export default function RecalculateRanksPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRecalculateRanks = async () => {
    setIsLoading(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/product/recalculate-ranks', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to recalculate ranks')
      }

      setMessage(data.message || 'Ranks recalculated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Recalculate Product Ranks</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          This will recalculate the ranks for all products, ensuring that each subcategory has its own independent ranking starting from #1.
        </p>
        
        <button
          onClick={handleRecalculateRanks}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          } text-white font-medium`}
        >
          {isLoading ? 'Recalculating...' : 'Recalculate Ranks'}
        </button>

        {message && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 