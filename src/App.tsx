import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import LayoutAdmin from './pages/LayoutAdmin'
import Dashboard from './pages/Dashboard'
import AdminDocuments from './pages/AdminDocuments'
import AdminCategories from './pages/AdminCategories'
import UploadDocument from './pages/UploadDocument'
import AdminUsers from './pages/AdminUsers'
import AdminProfile from './pages/AdminProfile' // Import AdminProfile

// User Pages
import LayoutUser from './pages/user/LayoutUser'
import LoginUser from './pages/user/LoginUser'
import RegisterUser from './pages/user/RegisterUser'
import MyDocuments from './pages/user/MyDocument'
import UploadUserDoc from './pages/user/UploadUserDoc'
import UserProfile from './pages/user/UserProfile'

export default function App() {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public login page */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Pages */}
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="upload" element={<UploadDocument />} /> 
        <Route path="profile" element={<AdminProfile />} /> {/* Add AdminProfile route */}
      </Route>

      {/* Public User Auth Pages */}
      <Route path="/login/user" element={<LoginUser />} />
      <Route path="/register/user" element={<RegisterUser />} />

      {/* Protected User Pages */}
      <Route path="/user" element={<LayoutUser />}>
        <Route index element={<Navigate to="documents" />} />
        <Route path="documents" element={<MyDocuments />} />
        <Route path="upload" element={<UploadUserDoc />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
