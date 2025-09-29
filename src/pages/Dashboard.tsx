
import AppLayout from "@/components/layout/AppLayout";
import ProgressCards from "@/components/dashboard/ProgressCards";
import ExpenseTracker from "@/components/dashboard/ExpenseTracker";
import AchievementsList from "@/components/dashboard/AchievementsList";
import ChallengeCard from "@/components/dashboard/ChallengeCard";
import FinnyTips from "@/components/dashboard/FinnyTips";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();
  
  return (
    <AppLayout>
      <ProgressCards />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <ExpenseTracker />
        </div>
        <div>
          <ChallengeCard />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AchievementsList />
        </div>
        <div>
          <FinnyTips />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
