import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'

export default function AdminUsers() {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUsers()
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('user')

  const handleAddUser = async () => {
    await addUser(newUserEmail, newUserRole)
    setNewUserEmail('')
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading users...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1.5rem' }}>
        Manage Users
      </h1>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="new.user@example.com"
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', flexGrow: 1 }}
        />
        <select
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleAddUser}
          style={{
            background: '#1E3A8A',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add User
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F3F4F6', borderBottom: '2px solid #E5E7EB'}}>
            <tr>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Role</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{user.email}</td>
                 <td style={{ padding: '12px' }}>{user.role}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={user.role}
                    onChange={(e) => updateUser(user.id, e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      background: '#EF4444',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginLeft: '1rem'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
