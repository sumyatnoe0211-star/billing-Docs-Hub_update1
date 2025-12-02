import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { colors, typography } from '../theme'

export default function AdminCategories() {
  const { categories, loading, error, addCategory, deleteCategory } = useCategories()
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = async () => {
    await addCategory(newCategory)
    setNewCategory('')
  }

  if (loading) return <div style={{ padding: '2rem', color: colors.text }}>Loading categories...</div>
  if (error) return <div style={{ padding: '2rem', color: colors.danger }}>{error}</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: typography.fontSizes.xxLarge, fontWeight: typography.fontWeights.bold, color: colors.primary, marginBottom: '1.5rem' }}>
        Manage Categories
      </h1>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name..."
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: `1px solid ${colors.mediumGray}`,
            flexGrow: 1,
            fontSize: typography.fontSizes.medium
          }}
        />
        <button
          onClick={handleAddCategory}
          style={{
            background: colors.primary,
            color: colors.white,
            padding: '0.5rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: typography.fontWeights.bold,
            fontSize: typography.fontSizes.medium
          }}
        >
          Add Category
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {categories.map((category) => (
          <div key={category.id} style={{ background: colors.white, padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3 style={{ fontSize: typography.fontSizes.large, color: colors.text, marginBottom: '0.5rem' }}>{category.name}</h3>
            {/* <p style={{ fontSize: typography.fontSizes.medium, color: colors.textLight }}>{category.documents_count || 0} Documents</p> */}
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => deleteCategory(category.id)}
                style={{
                  background: colors.danger,
                  color: colors.white,
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: typography.fontSizes.small
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}