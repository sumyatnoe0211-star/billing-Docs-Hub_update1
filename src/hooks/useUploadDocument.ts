import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface Category {
  id: number;
  name: string;
}

interface User {
  email: string;
}

export function useUploadDocument() {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const { data: catData, error: catErr } = await supabase.from('categories').select('id, name')
        if (catErr) throw catErr
        setCategories(catData as Category[])
        if (catData.length > 0) {
          setCategory(String(catData[0].id))
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not logged in");
        
      } catch (err: any) {
        setMessage('❌ Error fetching data: ' + err.message)
      }
    }
    fetchInitialData()
  }, [])

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    console.log('handleUpload function called.');
    if (!file) {
      setMessage('Please select a file to upload.')
      console.log('No file selected.');
      return
    }
    if (!category) {
      setMessage('Please select a category.')
      console.log('No category selected.');
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");
      const userId = user.email; // Assuming email is a unique identifier

      const fileName = `${userId}/${Date.now()}_${file.name.replace(/\s/g, '_')}`
      console.log('Attempting to upload file to Supabase Storage:', fileName);
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError);
        throw uploadError;
      }
      console.log('File uploaded to Supabase Storage successfully.');

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
      
      const newDocument = {
        file_name: file.name,
        file_url: urlData.publicUrl,
        category_id: category, // Assuming category ID is string/UUID
        uploaded_by: user.email,
        user_id: user.id, // Add user_id
        status: 'pending',
      }

      console.log('Attempting to insert document record into Supabase Database:', newDocument);
      const { error: dbError } = await supabase.from('documents').insert(newDocument)
      if (dbError) {
        console.error('Supabase Database Insert Error:', dbError);
        throw dbError;
      }
      console.log('Document record inserted into Supabase Database successfully.');

      setMessage('✅ File uploaded successfully! Redirecting...')
      setTimeout(() => navigate('/admin/documents'), 2000)

    } catch (err: any) {
      console.error('Caught error during upload process:', err);
      setMessage('❌ Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return { file, setFile, category, setCategory, categories, uploading, message, handleUpload }
}
