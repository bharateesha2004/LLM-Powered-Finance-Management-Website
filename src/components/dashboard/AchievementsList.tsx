
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight } from "lucide-react";
import { viewAllAchievements } from "@/utils/buttonActions";

const AchievementsList = () => {
  // Sample achievements data
  const recentAchievements = [
    {
      id: 1,
      name: "Budget Creator",
      description: "Created your first budget",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=budget",
      date: "2 days ago",
      xp: 50
    },
    {
      id: 2,
      name: "Expense Tracker",
      description: "Tracked expenses for 5 days",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=expense",
      date: "5 days ago",
      xp: 75
    },
    {
      id: 3,
      name: "First Step",
      description: "Completed account setup",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=step",
      date: "1 week ago",
      xp: 25
    }
  ];

  const handleViewAll = () => {
    viewAllAchievements();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="text-finny-purple" />
          Recent Achievements
        </CardTitle>
        <CardDescription>Your financial milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-finny-purple/20 rounded-full flex items-center justify-center">
                <img src={achievement.image} alt={achievement.name} className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-finny-purple">+{achievement.xp} XP</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-1"
          onClick={handleViewAll}
        >
          View All Achievements <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AchievementsList;
