import { useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/firebase';
import { getUserRole } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        const userRole = await getUserRole(user.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, role, loading };
}; 