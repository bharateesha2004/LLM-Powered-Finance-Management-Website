
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import useRealTimeUpdates from './useRealTimeUpdates';

interface XpSystem {
  currentXp: number;
  currentLevel: number;
  xpForNextLevel: number;
  levelProgress: number;
  addXp: (amount: number, reason?: string) => Promise<void>;
}

// Function to calculate level based on XP
const calculateLevel = (xp: number): number => {
  // Simple level formula: level = 1 + sqrt(xp / 100)
  // This means:
  // Level 1: 0 XP
  // Level 2: 100 XP
  // Level 3: 400 XP
  // Level 4: 900 XP
  // Level 5: 1600 XP
  // and so on...
  return Math.floor(1 + Math.sqrt(xp / 100));
};

// Function to calculate XP needed for next level
const calculateXpForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

export const useXpSystem = (): XpSystem => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentXp, setCurrentXp] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [xpForNextLevel, setXpForNextLevel] = useState<number>(100);
  const [levelProgress, setLevelProgress] = useState<number>(0);

  // Fetch initial XP data
  useEffect(() => {
    const fetchUserXp = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // If xp field doesn't exist yet, it will be null
        const xp = data?.xp || 0;
        updateXpState(xp);
      } catch (error) {
        console.error('Error fetching user XP:', error);
      }
    };

    fetchUserXp();
  }, [user]);

  // Set up real-time updates for profile changes
  useRealTimeUpdates({
    tableName: 'profiles',
    events: ['UPDATE'],
    onDataChange: (payload) => {
      if (payload.new && payload.new.id === user?.id && payload.new.xp !== undefined) {
        updateXpState(payload.new.xp);
      }
    }
  });

  // Update all XP-related state values
  const updateXpState = (xp: number) => {
    setCurrentXp(xp);
    const level = calculateLevel(xp);
    setCurrentLevel(level);
    
    const nextLevelXp = calculateXpForNextLevel(level);
    setXpForNextLevel(nextLevelXp);
    
    const prevLevelXp = calculateXpForNextLevel(level - 1);
    const xpInCurrentLevel = xp - prevLevelXp;
    const xpNeededForNextLevel = nextLevelXp - prevLevelXp;
    const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
    setLevelProgress(progress);
  };

  // Function to add XP
  const addXp = async (amount: number, reason?: string) => {
    if (!user) return;

    try {
      const newXp = currentXp + amount;
      const oldLevel = currentLevel;
      const newLevel = calculateLevel(newXp);

      // Update XP in database
      const { error } = await supabase
        .from('profiles')
        .update({ xp: newXp })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      updateXpState(newXp);

      // Show toast for XP gained
      toast({
        title: `+${amount} XP Gained!`,
        description: reason || 'You earned experience points',
      });

      // Show level up notification if leveled up
      if (newLevel > oldLevel) {
        toast({
          title: '🎉 Level Up!',
          description: `Congratulations! You've reached level ${newLevel}!`,
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error adding XP:', error);
      toast({
        title: 'Failed to add XP',
        description: 'An error occurred while updating your experience',
        variant: 'destructive',
      });
    }
  };

  return { currentXp, currentLevel, xpForNextLevel, levelProgress, addXp };
};

export default useXpSystem;
