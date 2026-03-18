import { useState, useEffect } from 'react';
import { getFamilyMembers } from '../service/family.service';
import { FamilyMember } from '../types';
import { useAuthStore } from '../../auth/store/auth.store';

export const useFamilyMembers = () => {
  const currentUser = useAuthStore((state) => state.data);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [familyCreatedAt, setFamilyCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await getFamilyMembers();
      setMembers(response.members || []);
      setFamilyCreatedAt(response.familyCreatedAt || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    familyCreatedAt,
    loading,
    error,
    refetch: fetchMembers,
  };
};