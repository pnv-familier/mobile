import { create } from 'zustand'
import { FamilyStatusResult } from '../types'

type FamilyStatusState = {
    status: FamilyStatusResult | null
    setStatus: (status: FamilyStatusResult) => void
}

export const useFamilyStatusStore = create<FamilyStatusState>(set => ({
    status: null,
    setStatus: status => set({ status }),
}))
