import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
    if (error) {
      setError('❌ Error fetching categories: ' + error.message)
    } else {
      setCategories(data as Category[])
    }
    setLoading(false)
  }

  const addCategory = async (newCategoryName: string) => {
    if (!newCategoryName.trim()) return
    const newCategoryObj = { name: newCategoryName }

    const { data, error } = await supabase
      .from('categories')
      .insert(newCategoryObj)
      .select()

    if (error) {
      setError('❌ Error adding category: ' + error.message)
    } else {
      setCategories(prevCategories => [...prevCategories, data[0] as Category])
    }
  }

  const deleteCategory = async (id: number) => {
    const originalCategories = [...categories]
    setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id))

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      setError('❌ Error deleting category: ' + error.message)
      setCategories(originalCategories)
    }
  }

  return { categories, loading, error, addCategory, deleteCategory }
}
