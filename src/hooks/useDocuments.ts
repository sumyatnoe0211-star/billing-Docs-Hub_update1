import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface Document {
  id: string; // Changed to string
  file_name: string;
  file_url: string;
  uploaded_by: string;
  category_id: string; // Changed to string
  status: string;
  created_at: string;
}

interface Category {
  id: string; // Changed to string
  name: string;
}

export function useDocuments() {
  const [docs, setDocs] = useState<Document[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*')
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id, name')

      if (docError) throw docError;
      if (catError) throw catError;
      
      setDocs(docData as Document[])
      setCats(catData as Category[])
    } catch (err: any) {
      setError('❌ Error fetching data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateStatus = async (id: string, newStatus: string) => { // Changed id to string
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

  return { docs, cats, loading, error, updateStatus, refreshDocuments: fetchData }
}
