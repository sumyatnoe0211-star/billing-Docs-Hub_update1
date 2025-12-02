import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCurrentUser } from '../services/auth'

interface User {
  email: string;
  nickname?: string;
  role: string;
}

interface Doc {
  status: string;
}

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [totalDocs, setTotalDocs] = useState(0)
  const [pendingDocs, setPendingDocs] = useState(0)
  const [approvedDocs, setApprovedDocs] = useState(0)
  const [rejectedDocs, setRejectedDocs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      fetchDocStats()
    } else {
      setError('User not logged in.')
    }
  }, [])

  const fetchDocStats = async () => {
    setLoading(true)
    const { data: docs, error } = await supabase.from('documents').select('status')

    if (error) {
      setError('Error fetching document stats: ' + error.message)
    } else if (docs) {
      setTotalDocs(docs.length)
      setPendingDocs(docs.filter((doc: Doc) => doc.status === 'pending').length)
      setApprovedDocs(docs.filter((doc: Doc) => doc.status === 'approved').length)
      setRejectedDocs(docs.filter((doc: Doc) => doc.status === 'rejected').length)
    }
    setLoading(false)
  }

  return { user, totalDocs, pendingDocs, approvedDocs, rejectedDocs, loading, error }
}
