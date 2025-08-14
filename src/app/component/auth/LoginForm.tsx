'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/app/lib/api/springboot-api/auth'
import TokenService from '@/app/lib/api/springboot-api/token'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await AuthService.login(email, password)
      
      // 1. Lưu token
      TokenService.setToken(response.accessToken, response.refreshToken)
      
      // 2. Kích hoạt sự kiện để Header biết cần reload
      window.dispatchEvent(new Event('authChange'))
      
      // 3. Chuyển hướng
      router.push('/')
      router.refresh() // Đảm bảo refresh client-side
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
       <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  )
}