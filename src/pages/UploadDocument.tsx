import { useUploadDocument } from '../hooks/useUploadDocument'
import { colors, typography } from '../theme'

export default function UploadDocument() {
  const { file, setFile, category, setCategory, categories, uploading, message, handleUpload } = useUploadDocument()

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ fontSize: typography.fontSizes.xxLarge, fontWeight: typography.fontWeights.bold, color: colors.primary, marginBottom: '1.5rem' }}>
        Upload New Document
      </h1>
      <form onSubmit={handleUpload} style={{ background: colors.white, padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: typography.fontWeights.semibold, color: colors.text }}>File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: `1px solid ${colors.mediumGray}`,
              background: colors.background,
              fontSize: typography.fontSizes.medium
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: typography.fontWeights.semibold, color: colors.text }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: `1px solid ${colors.mediumGray}`,
              fontSize: typography.fontSizes.medium
            }}
          >
            <option value="" disabled>Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            width: '100%',
            background: colors.primary,
            color: colors.white,
            padding: '1rem',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: typography.fontWeights.bold,
            fontSize: typography.fontSizes.large,
            opacity: uploading ? 0.6 : 1
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>

        {message && <p style={{ marginTop: '1.5rem', textAlign: 'center', color: message.startsWith('❌') ? colors.danger : colors.success, fontSize: typography.fontSizes.medium }}>{message}</p>}
      </form>
    </div>
  )
}
