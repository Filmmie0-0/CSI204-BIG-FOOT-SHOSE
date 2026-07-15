import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'th', // Default language is Thai
      toggleLanguage: () => set((state) => ({ language: state.language === 'th' ? 'en' : 'th' })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
    }
  )
)
