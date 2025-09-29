// hooks/useSavings.js
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSavings = () => {
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSavings = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        setSavingsGoals([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setSavingsGoals(data || []);
    } catch (err) {
      console.error("Error fetching savings goals:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, [user]);

  return {
    savingsGoals,
    isLoading,
    error,
    refetch: fetchSavings
  };
};