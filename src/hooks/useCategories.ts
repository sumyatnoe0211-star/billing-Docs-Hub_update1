import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface Category {
  id: string; // Changed to string
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
      if (error) throw error
      setCategories(data as Category[])
    } catch (err: any) {
      setError('❌ Error fetching categories: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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

  const deleteCategory = async (id: string) => { // Changed id to string
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

  const renameCategory = async (id: string, newName: string) => {
    if (!newName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    const originalCategories = [...categories];
    setCategories(prevCategories =>
      prevCategories.map(cat => (cat.id === id ? { ...cat, name: newName } : cat))
    );

    const { error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      setError('❌ Error renaming category: ' + error.message);
      setCategories(originalCategories); // Revert on error
    }
  };

  return { categories, loading, error, addCategory, deleteCategory, renameCategory, refreshCategories: fetchCategories }
}
