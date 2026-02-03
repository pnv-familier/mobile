import { useEffect, useState } from 'react'
import { useFamilyStatusStore } from '../store/familyStatus.store'
import { checkFamilyStatus, createFamilyRequest } from '../service/family.service'

export function useFamilyStatus() {
    const setStatus = useFamilyStatusStore(s => s.setStatus)
    const status = useFamilyStatusStore(s => s.status)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const init = async () => {
            try {
                const result = await checkFamilyStatus()
                setStatus(result)
            } catch (e) {
                setError('Failed to check family status')
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    return { status, loading, error }
}

export function useFamilyAction() {
    const [loading, setLoading] = useState(false);

    const createFamily = async (name: string) => {
        setLoading(true);
        try {
            const response = await createFamilyRequest(name);
            // Giả sử API trả về cấu trúc: { data: { inviteCode: "..." }, message: "..." }
            return response.data; 
        } catch (err: any) {
            console.error("Hook Error:", err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createFamily, loading };
}