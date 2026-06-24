import { create } from 'zustand'

const useReportStore = create((set) => ({
  reports: [],
  currentReport: null,
  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
}))

export default useReportStore
