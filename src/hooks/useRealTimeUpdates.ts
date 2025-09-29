
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type TableName = "expenses" | "savings_goals" | "profiles" | "user_achievements" | "expense_categories";
type EventType = "INSERT" | "UPDATE" | "DELETE";

interface UseRealTimeUpdatesProps {
  tableName: TableName;
  events?: EventType[];
  onDataChange?: (payload: any) => void;
  showToast?: boolean;
  toastMessages?: {
    insert?: string;
    update?: string;
    delete?: string;
  };
}

export const useRealTimeUpdates = ({
  tableName,
  events = ["INSERT", "UPDATE", "DELETE"],
  onDataChange,
  showToast = false,
  toastMessages = {
    insert: "New data added",
    update: "Data updated",
    delete: "Data removed"
  },
}: UseRealTimeUpdatesProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Enable realtime for this table if not already enabled
    const enableRealtimeQuery = async () => {
      try {
        await supabase.rpc('enable_realtime', { table_name: tableName });
      } catch (error) {
        console.error(`Error enabling realtime for ${tableName}:`, error);
      }
    };

    enableRealtimeQuery();

    // Set up the subscription
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        { 
          event: events, 
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          // Call the callback with the payload
          if (onDataChange) {
            onDataChange(payload);
          }

          // Show toast notifications if enabled
          if (showToast) {
            const eventType = payload.eventType;
            let toastMessage = "";
            
            switch (eventType) {
              case "INSERT":
                toastMessage = toastMessages.insert || "New data added";
                break;
              case "UPDATE":
                toastMessage = toastMessages.update || "Data updated";
                break;
              case "DELETE":
                toastMessage = toastMessages.delete || "Data removed";
                break;
            }
            
            toast({
              title: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Updated`,
              description: toastMessage,
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, events, onDataChange, showToast, toastMessages, toast, user]);
};

export default useRealTimeUpdates;
