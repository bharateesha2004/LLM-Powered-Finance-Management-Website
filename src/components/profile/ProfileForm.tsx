
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Briefcase, DollarSign, PiggyBank, Award, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProfileForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [income, setIncome] = useState(3000);
  const [occupation, setOccupation] = useState("Software Developer");
  const [savingsGoal, setSavingsGoal] = useState(5000);
  const [savingsGoalName, setSavingsGoalName] = useState("Emergency Fund");
  const [savingsDate, setSavingsDate] = useState("2023-12-31");
  const [notifications, setNotifications] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [dailyChallenges, setDailyChallenges] = useState(true);
  const [theme, setTheme] = useState("default");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
    
    if (profile) {
      setName(profile.username || "");
      if (profile.monthly_income) setIncome(Number(profile.monthly_income));
      if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
    }
  }, [user, profile]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      username: name,
      monthly_income: income,
    });
  };
  
  return (
    <Tabs defaultValue="personal" className="max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="financial">Financial Goals</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-20 h-20">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} />
                ) : (
                  <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${email}`} />
                )}
                <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <h3 className="font-medium">Profile Picture</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Upload New</Button>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or GIF files up to 2MB
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="income"
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-finny-purple hover:bg-finny-purple-dark">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="financial" className="mt-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>
              Update your savings goals and financial targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="savings-goal-name">Goal Name</Label>
                  <Input
                    id="savings-goal-name"
                    value={savingsGoalName}
                    onChange={(e) => setSavingsGoalName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="savings-amount">Target Amount</Label>
                    <span className="text-sm font-medium">${savingsGoal}</span>
                  </div>
                  <Slider
                    id="savings-amount"
                    min={500}
                    max={20000}
                    step={100}
                    value={[savingsGoal]}
                    onValueChange={([value]) => setSavingsGoal(value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$500</span>
                    <span>$20,000</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="savings-date">Target Date</Label>
                  <Input
                    id="savings-date"
                    type="date"
                    value={savingsDate}
                    onChange={(e) => setSavingsDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-finny-purple/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <PiggyBank className="text-finny-purple" size={20} />
                  <h3 className="font-medium">Savings Tracker</h3>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current progress</span>
                    <span className="font-medium">$1,240 / $5,000</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-finny-purple" style={{ width: "24%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're on track to reach your goal by December 31, 2023
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-finny-purple hover:bg-finny-purple-dark">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="preferences" className="mt-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
            <CardDescription>
              Customize your app experience and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Bell size={16} />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="text-base">App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your progress and achievements
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
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
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="daily-challenges" className="text-base">Daily Challenges</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive new challenges each day
                      </p>
                    </div>
                    <Switch
                      id="daily-challenges"
                      checked={dailyChallenges}
                      onCheckedChange={setDailyChallenges}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Award size={16} />
                    Appearance
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="theme">App Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Purple</SelectItem>
                        <SelectItem value="blue">Ocean Blue</SelectItem>
                        <SelectItem value="green">Forest Green</SelectItem>
                        <SelectItem value="orange">Sunset Orange</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Earn more themes by completing achievements and challenges
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-finny-purple hover:bg-finny-purple-dark">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileForm;
