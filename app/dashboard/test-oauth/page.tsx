'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestOAuthPage() {
  const router = useRouter()
  const [params, setParams] = useState<any>({})

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userParam = urlParams.get('user')
    const success = urlParams.get('success')

    setParams({
      token: token ? 'Present' : 'Missing',
      userParam: userParam ? 'Present' : 'Missing',
      success,
      fullUrl: window.location.href
    })

    console.log('Test OAuth Page - URL Parameters:', {
      token: !!token,
      userParam: !!userParam,
      success,
      fullUrl: window.location.href
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth Test Page</h1>
      <div className="space-y-2">
        <p><strong>Token:</strong> {params.token}</p>
        <p><strong>User Param:</strong> {params.userParam}</p>
        <p><strong>Success:</strong> {params.success}</p>
        <p><strong>Full URL:</strong> {params.fullUrl}</p>
      </div>
      <button 
        onClick={() => router.push('/dashboard')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to Dashboard
      </button>
    </div>
  )
}
