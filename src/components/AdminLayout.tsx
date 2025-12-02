import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { colors, typography } from '../theme'
import { supabase } from '../lib/supabase'
import { STORAGE_KEY } from '../constants/auth'
import { DEFAULT_AVATAR } from '../lib/constants'

interface UserProfile {
  id: string;
  email: string;
  nickname?: string;
  role?: string;
  avatar?: string; // Add avatar to UserProfile interface
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { user: supabaseUser } = session
          if (supabaseUser?.email) {
            const { data: profileData, error: profileError } = await supabase
              .from("users")
              .select("*")
              .eq("email", supabaseUser.email)
              .single();

            console.log("AdminLayout: Logged-in Supabase User ID:", supabaseUser.id);
            console.log("AdminLayout: Profile Data from 'users' table:", profileData);
            console.log("AdminLayout: Profile ID from 'users' table:", profileData?.id);

            if (profileError || !profileData || profileData.role !== 'admin') {
              console.error("AdminLayout: User not found in 'users' table or not an admin.");
              await supabase.auth.signOut(); // Force logout if not admin
              navigate('/login');
              return;
            }

            setUser({
              id: profileData.id,
              email: profileData.email,
              nickname: profileData.nickname || 'Admin',
              role: profileData.role,
              avatar: profileData.avatar || DEFAULT_AVATAR, // Fetch avatar
            });
            setLoading(false);
          } else {
            // Supabase user exists but no email? Should not happen often.
            console.error("AdminLayout: Supabase user found but no email.");
            await supabase.auth.signOut();
            navigate('/login');
          }
        } else {
          // User is logged out
          setUser(null)
          setLoading(false)
          navigate('/login')
        }
      }
    )

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { user: supabaseUser } = session
        if (supabaseUser?.email) {
          const { data: profileData, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("email", supabaseUser.email)
            .single();

          if (profileError || !profileData || profileData.role !== 'admin') {
            console.error("AdminLayout: Initial session user not found in 'users' table or not an admin.");
            await supabase.auth.signOut();
            navigate('/login');
            return;
          }

          setUser({
            id: profileData.id,
            email: profileData.email,
            nickname: profileData.nickname || 'Admin',
            role: profileData.role,
            avatar: profileData.avatar || DEFAULT_AVATAR, // Fetch avatar
          });
        } else {
          console.error("AdminLayout: Initial session Supabase user found but no email.");
          await supabase.auth.signOut();
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
    } else {
      localStorage.removeItem(STORAGE_KEY) // Clear local storage if any custom data was stored
      sessionStorage.removeItem(STORAGE_KEY)
      navigate('/login')
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', color: colors.text }}>Loading authentication...</div>
  }

  if (!user || user.role !== 'admin') {
    // This case should ideally be handled by the useEffect redirect, but as a fallback
    return <div style={{ padding: '2rem', color: colors.danger }}>Access Denied. Redirecting...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '240px',
        background: colors.primary,
        color: colors.white,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ marginBottom: '0.6rem', fontSize: typography.fontSizes.xLarge, fontWeight: typography.fontWeights.bold }}>Billing Docs Hub</h3>
          <p style={{ color: colors.white, fontSize: typography.fontSizes.medium, marginBottom: '1rem' }}>Admin Panel</p>

          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}
            onClick={() => navigate("/admin/profile")}
          >
            <img
              src={user.avatar || DEFAULT_AVATAR}
              alt="Profile"
              style={{ width: '5rem', height: '5rem', borderRadius: '50%', marginBottom: '0.5rem', objectFit: 'cover', border: `2px solid ${colors.secondary}` }}
            />
            <p style={{ fontWeight: typography.fontWeights.semibold, color: colors.white }}>{user.nickname || "Admin"}</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <NavLink
              to="dashboard"
              style={({ isActive }) => ({
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: colors.white,
                background: isActive ? colors.secondary : 'transparent',
                fontWeight: typography.fontWeights.medium
              })}
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="documents"
              style={({ isActive }) => ({
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: colors.white,
                background: isActive ? colors.secondary : 'transparent',
                fontWeight: typography.fontWeights.medium
              })}
            >
              📄 Documents
            </NavLink>

            <NavLink
              to="categories"
              style={({ isActive }) => ({
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: colors.white,
                background: isActive ? colors.secondary : 'transparent',
                fontWeight: typography.fontWeights.medium
              })}
            >
              🗂️ Categories
            </NavLink>
            <NavLink
              to="users"
              style={({ isActive }) => ({
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: colors.white,
                background: isActive ? colors.secondary : 'transparent',
                fontWeight: typography.fontWeights.medium
              })}
            >
              👥 Users Management
            </NavLink>
            <NavLink
              to="upload"
              style={({ isActive }) => ({
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: colors.white,
                background: isActive ? colors.secondary : 'transparent',
                fontWeight: typography.fontWeights.medium
              })}
            >
              ⬆️ Upload Document
            </NavLink>
            <NavLink
              to="profile"
              style={({ isActive }) => ({
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: colors.white,
                background: isActive ? colors.secondary : 'transparent',
                fontWeight: typography.fontWeights.medium
              })}
            >
              👤 Admin Profile
            </NavLink>

          </nav>

        </div>

        <button
          onClick={handleLogout}
          style={{
            background: colors.darkGray,
            color: colors.white,
            border: 'none',
            padding: '0.3rem 0.7rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: typography.fontSizes.small,
          }}
        >
          Logout
        </button>


      </aside>

      <main style={{ flex: 1, padding: '1rem', background: colors.background }}>
        <Outlet />
      </main>
    </div>
  )
}
