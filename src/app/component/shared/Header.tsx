'use client'

import { useEffect, useState } from 'react'
import userService from '@/app/lib/api/springboot-api/user'

export default function Header() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const userData = await userService.getUser()
      setName(userData.username)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setName('')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 1. Load ngay khi component mount
    fetchUserData()

    // 2. Lắng nghe sự kiện từ LoginForm
    const handleAuthChange = () => {
      fetchUserData()
    }

    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  return (
    <div className="p-4 bg-gray-100">
      {isLoading ? (
        <div>Loading...</div>
      ) : name ? (
        <div>Xin chào, {name}</div>
      ) : (
        <div>Vui lòng đăng nhập</div>
      )}
    </div>
  )
}