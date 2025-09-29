
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CreditCard, DollarSign, Calendar, Target, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const OnboardingSteps = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 - Basic Financial Info
  const [monthlyIncome, setMonthlyIncome] = useState(3000);
  
  // Step 2 - Expense Categories
  const [categories, setCategories] = useState([
    { id: 1, name: "Housing", budget: 1000, enabled: true },
    { id: 2, name: "Food", budget: 500, enabled: true },
    { id: 3, name: "Transportation", budget: 200, enabled: true },
    { id: 4, name: "Entertainment", budget: 150, enabled: true },
    { id: 5, name: "Utilities", budget: 200, enabled: true }
  ]);
  
  // Step 3 - Savings Goal
  const [savingsGoal, setSavingsGoal] = useState(5000);
  const [goalName, setGoalName] = useState("Emergency Fund");
  const [goalDeadline, setGoalDeadline] = useState("2023-12-31");
  
  // Step 4 - Finalize
  const [notifications, setNotifications] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  
  const updateCategoryBudget = (id: number, budget: number) => {
    setCategories(
      categories.map(category => 
        category.id === id ? { ...category, budget } : category
      )
    );
  };
  
  const updateCategoryEnabled = (id: number, enabled: boolean) => {
    setCategories(
      categories.map(category => 
        category.id === id ? { ...category, enabled } : category
      )
    );
  };
  
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // In the future, this would save data to Supabase
      toast({
        title: "Onboarding complete!",
        description: "Your financial adventure begins now!",
      });
      navigate("/dashboard");
    }
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  return (
    <div className="container mx-auto max-w-3xl py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === currentStep
                  ? "bg-finny-purple text-white"
                  : step < currentStep
                  ? "bg-finny-green text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            <span className="text-xs mt-2 text-gray-500">
              {step === 1 && "Income"}
              {step === 2 && "Budget"}
              {step === 3 && "Goals"}
              {step === 4 && "Finish"}
            </span>
          </div>
        ))}
      </div>
      
      <Card className="w-full">
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="text-finny-purple" />
                Set Your Monthly Income
              </CardTitle>
              <CardDescription>
                Let's start by understanding your financial situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthly-income">Monthly Income (after tax)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="monthly-income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  This helps us calculate your saving potential and budget allocations
                </p>
              </div>
              
              <div className="bg-finny-purple/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-finny-purple" size={20} />
                  <h3 className="font-medium">Your Adventure Begins!</h3>
                </div>
                <p className="text-sm mt-2">
                  Setting your income is the first step in your financial adventure. 
                  This information helps Finny guide you toward achieving your goals!
                </p>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-finny-purple" />
                Create Budget Categories
              </CardTitle>
              <CardDescription>
                Set up spending limits for different areas of your life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2 pb-4 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`category-${category.id}`} className="text-base">
                      {category.name}
                    </Label>
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={(checked) => updateCategoryEnabled(category.id, checked)}
                    />
                  </div>
                  
                  {category.enabled && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Budget</span>
                        <span className="text-sm font-medium">${category.budget}</span>
                      </div>
                      <Slider
                        id={`category-${category.id}`}
                        disabled={!category.enabled}
                        min={0}
                        max={monthlyIncome / 2}
                        step={10}
                        value={[category.budget]}
                        onValueChange={([value]) => updateCategoryBudget(category.id, value)}
                        className={category.enabled ? "" : "opacity-50"}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$0</span>
                        <span>${monthlyIncome / 2}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="bg-finny-purple/10 p-4 rounded-lg mt-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-finny-purple" size={20} />
                  <h3 className="font-medium">Budgeting Power-Up!</h3>
                </div>
                <p className="text-sm mt-2">
                  Creating a budget unlocks the Budgeting Badge and earns you 100 XP! 
                  Stay under budget to earn even more rewards!
                </p>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-finny-purple" />
                Set Your Savings Goal
              </CardTitle>
              <CardDescription>
                Define a financial goal to work towards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Emergency Fund, Vacation, New Car"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="goal-amount">Target Amount</Label>
                  <span className="text-sm font-medium">${savingsGoal}</span>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="goal-amount"
                    type="number"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="goal-deadline">Target Date</Label>
                  <Badge variant="outline" className="bg-finny-blue/10 text-finny-blue">
                    Optional
                  </Badge>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="bg-finny-purple/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-finny-purple" size={20} />
                  <h3 className="font-medium">Goal Achievement Quest!</h3>
                </div>
                <p className="text-sm mt-2">
                  Setting a savings goal starts your first quest! Reach milestones along the way to 
                  earn badges, XP and unlock special features!
                </p>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-finny-purple" />
                Ready to Begin Your Adventure!
              </CardTitle>
              <CardDescription>
                Just a few final preferences to get you started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get updates on your progress and achievements
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="streak-reminders" className="text-base">Streak Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded to maintain your activity streak
                    </p>
                  </div>
                  <Switch
                    id="streak-reminders"
                    checked={streakReminders}
                    onCheckedChange={setStreakReminders}
                  />
                </div>
              </div>
              
              <div className="bg-orange-50 border border-finny-orange/20 p-4 rounded-lg">
                <h3 className="font-medium text-finny-orange flex items-center gap-2">
                  <Target size={18} />
                  Progress Summary
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-finny-green">✓</span> 
                    Monthly income: ${monthlyIncome}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-finny-green">✓</span> 
                    Budget categories: {categories.filter(c => c.enabled).length} categories defined
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-finny-green">✓</span> 
                    Savings goal: ${savingsGoal} for "{goalName}"
                  </li>
                </ul>
              </div>
              
              <div className="bg-finny-purple/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-finny-purple" size={20} />
                  <h3 className="font-medium">Adventure Awaits!</h3>
                </div>
                <p className="text-sm mt-2">
                  You've earned the "Financial Adventurer" badge just for completing setup! 
                  Your journey to financial mastery begins now!
                </p>
              </div>
            </CardContent>
          </>
        )}
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext} className="bg-finny-purple hover:bg-finny-purple-dark">
            {currentStep < 4 ? "Continue" : "Start Adventure"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingSteps;
