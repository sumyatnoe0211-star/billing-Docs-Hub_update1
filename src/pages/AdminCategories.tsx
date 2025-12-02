import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { colors, typography } from '../theme'

export default function AdminCategories() {
  const { categories, loading, error, addCategory, deleteCategory, renameCategory, refreshCategories } = useCategories()
  const [newCategory, setNewCategory] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const handleAddCategory = async () => {
    await addCategory(newCategory)
    setNewCategory('')
  }

  const handleEditClick = (category: { id: string; name: string }) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleSaveClick = async (id: string) => {
    if (editingCategoryName.trim() === '') {
      alert('Category name cannot be empty.');
      return;
    }
    await renameCategory(id, editingCategoryName);
    setEditingCategoryId(null);
    setEditingCategoryName('');
    refreshCategories(); // Refresh to ensure UI is consistent
  };

  const handleCancelClick = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      await deleteCategory(id);
      refreshCategories(); // Refresh to ensure UI is consistent
    }
  };

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
            {editingCategoryId === category.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: `1px solid ${colors.mediumGray}`,
                    fontSize: typography.fontSizes.medium
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleSaveClick(category.id)}
                    style={{
                      background: colors.success,
                      color: colors.white,
                      padding: '0.4rem 0.8rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: typography.fontSizes.small
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    style={{
                      background: colors.danger,
                      color: colors.white,
                      padding: '0.4rem 0.8rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: typography.fontSizes.small
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: typography.fontSizes.large, color: colors.text, marginBottom: '0.5rem' }}>{category.name}</h3>
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => handleEditClick(category)}
                    style={{
                      background: colors.secondary,
                      color: colors.white,
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: typography.fontSizes.small,
                      marginRight: '0.5rem'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}