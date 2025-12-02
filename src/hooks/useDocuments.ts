import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Document {
  id: number;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  category_id: number;
  status: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export function useDocuments() {
  const [docs, setDocs] = useState<Document[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*')
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id, name')

      if (docError || catError) {
        setError('❌ Error fetching data: ' + (docError?.message || catError?.message))
      } else {
        setDocs(docData as Document[])
        setCats(catData as Category[])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const updateStatus = async (id: number, newStatus: string) => {
    const originalDocs = [...docs];
    const updatedDocs = docs.map(doc =>
      doc.id === id ? { ...doc, status: newStatus } : doc
    );
    setDocs(updatedDocs);

    const { error } = await supabase
      .from('documents')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      setError('❌ Error updating status: ' + error.message);
      setDocs(originalDocs); // Revert on error
    }
  };

  return { docs, cats, loading, error, updateStatus }
}
