import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../services/auth'
import { useDashboard } from '../hooks/useDashboard'
import { colors, typography } from '../theme'

export default function Dashboard() {
  const { user, totalDocs, pendingDocs, approvedDocs, rejectedDocs, loading, error } = useDashboard()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <div style={{ padding: '2rem', color: colors.text }}>{error ? `Error: ${error}` : 'Loading dashboard...'}</div>
  }

  if (error) {
    return <div style={{ padding: '2rem', color: colors.danger }}>{error}</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: typography.fontSizes.xxLarge, fontWeight: typography.fontWeights.bold, color: colors.primary }}>Admin Dashboard</h1>
          <p style={{ color: colors.textLight, fontSize: typography.fontSizes.medium }}>Welcome back, {user?.nickname || 'Admin'}!</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: colors.darkGray,
            color: colors.white,
            padding: '0.7rem 1.5rem',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: typography.fontWeights.bold,
            fontSize: typography.fontSizes.medium
          }}
        >
          Log Out
        </button>
      </header>

      <main>
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard title="Total Documents" value={totalDocs} color={colors.info} />
          <StatCard title="Pending Review" value={pendingDocs} color={colors.warning} />
          <StatCard title="Approved" value={approvedDocs} color={colors.success} />
          <StatCard title="Rejected" value={rejectedDocs} color={colors.danger} />
        </section>

        <section style={{ background: colors.white, padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: typography.fontSizes.xLarge, fontWeight: typography.fontWeights.bold, color: colors.primary, marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <QuickLink to="/admin/upload" text="Upload New Document" />
            <QuickLink to="/admin/documents" text="Manage Documents" />
            <QuickLink to="/admin/users" text="Manage Users" />
            <QuickLink to="/admin/categories" text="Manage Categories" />
          </div>
        </section>
      </main>
    </div>
  )
}

const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
  <div style={{
    background: color,
    color: colors.white,
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: `0 10px 20px -5px ${color}50`
  }}>
    <h3 style={{ fontSize: typography.fontSizes.large, fontWeight: typography.fontWeights.semibold, opacity: 0.9 }}>{title}</h3>
    <p style={{ fontSize: typography.fontSizes.xxLarge, fontWeight: typography.fontWeights.bold }}>{value}</p>
  </div>
)

const QuickLink = ({ to, text }: { to: string, text: string }) => (
  <Link to={to} style={{
    background: colors.lightGray,
    color: colors.primary,
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    transition: 'background 0.2s'
  }}>
    {text}
  </Link>
)
