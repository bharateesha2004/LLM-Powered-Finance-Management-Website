
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "./use-toast";

export type Expense = {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
};

export type NewExpense = Omit<Expense, "id" | "user_id" | "created_at">;

export const useExpenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchExpenses = async (): Promise<Expense[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
    
    return data || [];
  };

  const addExpense = async (expense: NewExpense): Promise<Expense | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          user_id: user.id,
          ...expense,
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  };

  // Update function to edit an existing expense
  const updateExpense = async (id: string, updates: Partial<NewExpense>): Promise<Expense | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id) // Security check
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  };

  // Delete function to remove an expense
  const deleteExpense = async (id: string): Promise<void> => {
    if (!user) return;
    
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Security check
    
    if (error) {
      throw error;
    }
  };

  const expensesQuery = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: fetchExpenses,
    enabled: !!user,
  });

  const addExpenseMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
      toast({
        title: "Expense added",
        description: "Your expense has been successfully recorded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({id, updates}: {id: string, updates: Partial<NewExpense>}) => updateExpense(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
      toast({
        title: "Expense deleted",
        description: "Your expense has been successfully removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    expenses: expensesQuery.data || [],
    isLoading: expensesQuery.isLoading,
    isError: expensesQuery.isError,
    error: expensesQuery.error,
    addExpense: addExpenseMutation.mutate,
    isAdding: addExpenseMutation.isPending,
    updateExpense: updateExpenseMutation.mutate,
    isUpdating: updateExpenseMutation.isPending,
    deleteExpense: deleteExpenseMutation.mutate,
    isDeleting: deleteExpenseMutation.isPending,
    refetch: expensesQuery.refetch,
  };
};
