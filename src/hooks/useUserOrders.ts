import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchOrdersByEmail, Order } from '../services/airtable';

export function useUserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchOrdersByEmail(user.email);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.email]);

  return {
    orders,
    loading,
    error,
    refetch: loadOrders
  };
}