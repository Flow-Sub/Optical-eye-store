import { useState, useEffect } from 'react';

export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  specialization?: string;
  experience?: string;
  about?: string;
  status: 'active' | 'inactive';
  image?: string;
  createdAt?: string;
}

export function useTeamMembers(activeOnly = false) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teamMemberRoutes/getTeamMembers`);
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      
      const filteredMembers = activeOnly 
        ? data.data.filter((m: TeamMember) => m.status === 'active')
        : data.data;
      
      setTeamMembers(filteredMembers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [activeOnly]);

  return { teamMembers, loading, error, refetch: fetchTeamMembers };
}