// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// export default function Login() {
//   console.log('Login loaded')

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const navigate = useNavigate()

//   const handleLogin = (e) => {
//   e.preventDefault()
  

//   if (email === 'admin@demo.com' && password === 'password123') {
//     const user = {
//       email,
//       nickname: 'Admin Master', // Change this to any nickname you want
//       role: 'admin',
//       loggedInAt: Date.now()
//     }

//     localStorage.setItem('billingdocs_user', JSON.stringify(user))
//     navigate('/login/admin/dashboard')
//   } else {
//     setError('Invalid email or password')
//   }
// }


//   return (
//     <div style={{
//       display: 'grid',
//       placeItems: 'center',
//       minHeight: '100vh',
//       background: '#f1f5f9',
//       padding: '2rem',
//     }}>
//       <div style={{
//         width: '100%',
//         maxWidth: '400px',
//         background: '#fff',
//         padding: '2rem',
//         borderRadius: '16px',
//         boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//         border: '1px solid #e5e7eb'
//       }}>
//         <h1 style={{ marginBottom: '1rem', color: '#1E3A8A' }}>Billing Docs Hub</h1>
//         <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Admin Login</h2>

//         <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
//           <label>
//             <span style={{ display: 'block', marginBottom: '.4rem' }}>Email</span>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={{
//                 width: '100%',
//                 padding: '.75rem',
//                 borderRadius: '8px',
//                 border: '1px solid #ccc',
//               }}
//             />
//           </label>

//           <label>
//             <span style={{ display: 'block', marginBottom: '.4rem' }}>Password</span>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={{
//                 width: '100%',
//                 padding: '.75rem',
//                 borderRadius: '8px',
//                 border: '1px solid #ccc',
//               }}
//             />
//           </label>

//           {error && <div style={{ color: 'red' }}>{error}</div>}

//           <button
//             type="submit"
//             style={{
//               background: '#1E3A8A',
//               color: '#fff',
//               padding: '0.8rem',
//               border: 'none',
//               borderRadius: '10px',
//               cursor: 'pointer',
//               fontWeight: 'bold'
//             }}
//           >
//             Log In
//           </button>
//         </form>

//         <footer style={{ marginTop: '1.5rem', fontSize: '.85rem', textAlign: 'center', color: '#64748B' }}>
//           © 2025 Billing Docs Hub • <a href="#" style={{ color: '#3B82F6' }}>Privacy</a> • <a href="#" style={{ color: '#3B82F6' }}>Terms</a>
//         </footer>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { colors, typography } from '../theme'
import { STORAGE_KEY } from '../constants/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError('❌ ' + error.message)
    } else {
      // Optional: save user email/nickname locally
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        email: data.user?.email,
        nickname: 'Admin Master', // or fetch from user_metadata later
        role: 'admin', // This role assignment needs to be handled by your backend/database
        loggedInAt: Date.now()
      }))
      navigate('/admin/dashboard')
    }
  }

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      background: colors.background,
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: colors.white,
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: `1px solid ${colors.lightGray}`
      }}>
        <h1 style={{ marginBottom: '1rem', color: colors.primary, fontSize: typography.fontSizes.xLarge }}>Billing Docs Hub</h1>
        <h2 style={{ fontSize: typography.fontSizes.large, marginBottom: '1rem', color: colors.text }}>Admin Login</h2>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ color: colors.text }}>
            <span style={{ display: 'block', marginBottom: '.4rem' }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '.75rem',
                borderRadius: '8px',
                border: `1px solid ${colors.mediumGray}`,
                fontSize: typography.fontSizes.medium
              }}
            />
          </label>

          <label style={{ color: colors.text }}>
            <span style={{ display: 'block', marginBottom: '.4rem' }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '.75rem',
                borderRadius: '8px',
                border: `1px solid ${colors.mediumGray}`,
                fontSize: typography.fontSizes.medium
              }}
            />
          </label>

          {error && <div style={{ color: colors.danger, fontSize: typography.fontSizes.small }}>{error}</div>}

          <button
            type="submit"
            style={{
              background: colors.primary,
              color: colors.white,
              padding: '0.8rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: typography.fontWeights.bold,
              fontSize: typography.fontSizes.medium
            }}
          >
            Log In
          </button>
        </form>

        <footer style={{ marginTop: '1.5rem', fontSize: typography.fontSizes.small, textAlign: 'center', color: colors.textLight }}>
          © 2025 Billing Docs Hub • <a href="#" style={{ color: colors.secondary }}>Privacy</a> • <a href="#" style={{ color: colors.secondary }}>Terms</a>
        </footer>
      </div>
    </div>
  )
}
