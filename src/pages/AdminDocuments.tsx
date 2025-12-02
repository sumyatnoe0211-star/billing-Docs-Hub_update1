import { useState } from 'react'
import { useDocuments } from '../hooks/useDocuments'
import { useNavigate } from 'react-router-dom'
import { colors, typography } from '../theme'
import { STATUS_COLORS } from '../constants/colors'
import { supabase } from '../lib/supabase' // Import supabase

export default function AdminDocuments() {
  const { docs, cats, loading, error, updateStatus, refreshDocuments } = useDocuments() // Get refreshDocuments
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const getCatName = (cat_id: string) => {
    if (!cats.length) return '...';
    const category = cats.find(cat => cat.id === cat_id);
    return category ? category.name : 'Uncategorized';
  };

  const getStatusStyle = (status: string) => {
    return {
      padding: '4px 10px',
      borderRadius: '12px',
      fontWeight: typography.fontWeights.semibold,
      background: STATUS_COLORS[status?.toLowerCase()] || colors.lightGray,
      color: colors.text
    };
  };

  const filteredDocs = docs.filter(doc =>
    doc.file_name?.toLowerCase().includes(search.toLowerCase())
  );

  const actionBtnStyle = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: typography.fontSizes.large,
    margin: '0 5px'
  };

  const handleDelete = async (docId: string, fileUrl: string) => {
    if (!window.confirm(`Are you sure you want to delete this document? This action cannot be undone.`)) {
      return;
    }

    try {
      // 1. Delete file from Supabase Storage
      const urlParts = fileUrl.split('/');
      const bucketName = urlParts[urlParts.indexOf('public') + 1]; // 'documents'
      const storagePath = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');

      const { error: storageError } = await supabase.storage
        .from('documents') // Assuming 'documents' is your bucket name
        .remove([storagePath]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        throw new Error('Failed to delete file from storage: ' + storageError.message);
      }

      // 2. Delete record from Supabase Database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (dbError) {
        console.error('Error deleting document record:', dbError);
        throw new Error('Failed to delete document record: ' + dbError.message);
      }

      alert(`Document deleted successfully!`);
      refreshDocuments(); // Refresh the list
    } catch (err: any) {
      console.error('Error during document deletion:', err);
      alert(`Failed to delete document: ${err.message}`);
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: colors.text }}>Loading documents...</div>
  if (error) return <div style={{ padding: '2rem', color: colors.danger }}>{error}</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: typography.fontSizes.xxLarge, fontWeight: typography.fontWeights.bold, color: colors.primary, marginBottom: '1.5rem' }}>
        Manage Documents
      </h1>

      <input
        type="text"
        placeholder="Search by filename..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          border: `1px solid ${colors.mediumGray}`,
          marginBottom: '2rem',
          fontSize: typography.fontSizes.medium
        }}
      />

      <div style={{ background: colors.white, borderRadius: '12px', overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: colors.lightGray, borderBottom: `2px solid ${colors.mediumGray}` }}>
            <tr>
              <th style={{ padding: '12px', color: colors.text, fontSize: typography.fontSizes.medium }}>File Name</th>
              <th style={{ padding: '12px', color: colors.text, fontSize: typography.fontSizes.medium }}>Uploaded By</th>
              <th style={{ padding: '12px', color: colors.text, fontSize: typography.fontSizes.medium }}>Category</th>
              <th style={{ padding: '12px', color: colors.text, fontSize: typography.fontSizes.medium }}>Status</th>
              <th style={{ padding: '12px', color: colors.text, fontSize: typography.fontSizes.medium }}>Date</th>
              <th style={{ padding: '12px', color: colors.text, fontSize: typography.fontSizes.medium }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: `1px solid ${colors.lightGray}` }}>
                <td style={{ padding: '12px', fontWeight: typography.fontWeights.medium }}>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ color: colors.primary }}>
                    {doc.file_name}
                  </a>
                </td>
                <td style={{ padding: '12px', color: colors.text }}>{doc.uploaded_by}</td>
                <td style={{ padding: '12px', color: colors.text }}>{ getCatName(doc.category_id) || 'Uncategorized'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={getStatusStyle(doc.status)}>{doc.status}</span>
                </td>
                <td style={{ padding: '12px', color: colors.text }}>
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                <button onClick={() => updateStatus(doc.id, 'approved')} style={actionBtnStyle} title="Approve">✅</button>
                <button onClick={() => updateStatus(doc.id, 'rejected')} style={actionBtnStyle} title="Reject">❌</button>
                <button onClick={() => handleDelete(doc.id, doc.file_url)} style={actionBtnStyle} title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}