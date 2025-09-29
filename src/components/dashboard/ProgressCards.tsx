import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, PiggyBank, Award, Flame } from "lucide-react";

const ProgressCards = () => {
  // Define initial values
  const budgetHealth = 0;
  const savings = 0;
  const xp = 0;
  const streak = 0;

  // Derived values
  const savingsGoal = 5000;
  const savingsProgress = 0; // Since savings is 0
  const level = 1; // Starting at Level 1 with 0 XP
  const xpToNextLevel = 400; // Assuming 400 XP to reach Level 2

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Budget Health Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CircleCheck className="text-finny-green" size={18} />
            Budget Health
          </CardTitle>
          <CardDescription>This month's progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-green">{budgetHealth}%</div>
          <p className="text-sm text-muted-foreground">Start tracking your budget!</p>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-finny-green" style={{ width: `${budgetHealth}%` }}></div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Progress Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PiggyBank className="text-finny-blue" size={18} />
            Savings Goal
          </CardTitle>
          <CardDescription>Emergency Fund</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-blue">
            ${savings.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">/${savingsGoal.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">You're {savingsProgress}% to your goal</p>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-finny-blue" style={{ width: `${savingsProgress}%` }}></div>
          </div>
        </CardContent>
      </Card>

      {/* XP & Level Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="text-finny-purple" size={18} />
            Level Progress
          </CardTitle>
          <CardDescription>Track your growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-purple">
            Level {level}{" "}
            <span className="text-sm font-normal text-muted-foreground">{xp.toLocaleString()} XP</span>
          </div>
          <p className="text-sm text-muted-foreground">{xpToNextLevel.toLocaleString()} XP to Level {level + 1}</p>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-finny-purple" style={{ width: "0%" }}></div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="text-finny-orange" size={18} />
            Activity Streak
          </CardTitle>
          <CardDescription>Days in a row</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-orange">{streak} days</div>
          <p className="text-sm text-muted-foreground">Start your streak today!</p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full bg-gray-200"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCards;