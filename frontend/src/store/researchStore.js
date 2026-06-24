import { create } from 'zustand'

const useResearchStore = create((set) => ({
  sessions: [],
  currentSession: null,
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (session) => set({ currentSession: session }),
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
}))

export default useResearchStore
