import {create} from "zustand"

type AuthState = {
    data: any;
    isLoading: boolean;
    error: string | null;

    fetchData: () => Promise<void>
    reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    data: null,
    isLoading: false,
    error: null,
     
    fetchData: async () => {
        
    },

    reset: async () => {

    }
}))