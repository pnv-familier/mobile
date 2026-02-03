import { create } from 'zustand'
import { MyFamilyResponse } from '../types'
import { getMyFamily } from '../service/family.service'

interface FamilyState {
    familyData: MyFamilyResponse | null
    hasFamily: boolean
    fetchMyFamily: () => Promise<void>
    setFamily: (family: MyFamilyResponse) => void
}

export const useFamilyStore = create<FamilyState>((set) => ({
    familyData: null,
    hasFamily: false,
    fetchMyFamily: async () => {
        try {
            const family = await getMyFamily()
            set({ familyData: family, hasFamily: true })
        } catch (error) {
            set({ familyData: null, hasFamily: false })
        }
    },
    setFamily: (family) => set({ familyData: family, hasFamily: true }),
}))