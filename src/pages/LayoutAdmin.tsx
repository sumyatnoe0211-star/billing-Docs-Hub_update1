// import { Link, Outlet, useLocation } from 'react-router-dom'

// const navItems = [
//   { label: 'Dashboard', path: 'dashboard' },
//   { label: 'Documents', path: 'documents' },
//   { label: 'Categories', path: 'categories' },
// ]

// export default function LayoutAdmin() {
//   const location = useLocation()

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <aside style={{
//         width: '240px',
//         background: '#1E3A8A',
//         color: '#fff',
//         padding: '2rem 1rem',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '1.5rem'
//       }}>
//         <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Admin Panel</h2>
//         {navItems.map(item => (
//           <Link
//             key={item.path}
//             to={item.path}
//             style={{
//               padding: '0.5rem 1rem',
//               borderRadius: '8px',
//               background: location.pathname.endsWith(item.path) ? '#3B82F6' : 'transparent',
//               color: '#fff',
//               textDecoration: 'none'
//             }}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </aside>

//       {/* Main Content */}
//       <main style={{ flex: 1, background: '#f9fafb', padding: '2rem' }}>
//         <Outlet />
//       </main>
//     </div>
//   )
// }

import AdminLayout from '../components/AdminLayout';

export default function LayoutAdmin() {
  return <AdminLayout />;
}
