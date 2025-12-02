import { create } from 'zustand'

interface UserProfile {
  id: string;
  nickname?: string;
  avatar?: string;
  email: string;
  role?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Document {
  id: string;
  file_name: string;
  file_url: string;
  category_id: string | null;
  status: string;
  created_at: string;
  uploaded_by: string;
}

interface StoreState {
  user: UserProfile | null;
  categories: Category[];
  documents: Document[];
  setUser: (user: UserProfile | null) => void;
  setCategories: (cats: Category[]) => void;
  setDocuments: (docs: Document[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  categories: [],
  documents: [],
  setUser: (user) => set({ user }),
  setCategories: (cats) => set({ categories: cats }),
  setDocuments: (docs) => set({ documents: docs }),
}))
