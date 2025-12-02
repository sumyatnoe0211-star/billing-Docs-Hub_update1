import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  id: number;
  email: string;
  role: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
      setError('❌ Error fetching users: ' + error.message)
    } else {
      setUsers(data as User[])
    }
    setLoading(false)
  }

  const addUser = async (newUserEmail: string, newUserRole: string) => {
    if (!newUserEmail.trim()) return
    const newUser = { email: newUserEmail, role: newUserRole }

    const { data, error } = await supabase.from('users').insert(newUser).select()

    if (error) {
      setError('❌ Error adding user: ' + error.message)
    } else {
      setUsers(prevUsers => [...prevUsers, data[0] as User])
    }
  }

  const updateUser = async (id: number, newRole: string) => {
    const originalUsers = [...users]
    const updatedUsers = users.map(user => (user.id === id ? { ...user, role: newRole } : user))
    setUsers(updatedUsers)

    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', id)

    if (error) {
      setError('❌ Error updating user: ' + error.message)
      setUsers(originalUsers) // Revert
    }
  }

  const deleteUser = async (id: number) => {
    const originalUsers = [...users]
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id))

    const { error } = await supabase.from('users').delete().eq('id', id)

    if (error) {
      setError('❌ Error deleting user: ' + error.message)
      setUsers(originalUsers) // Revert
    }
  }

  return { users, loading, error, addUser, updateUser, deleteUser }
}
