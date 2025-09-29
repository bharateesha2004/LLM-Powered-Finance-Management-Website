import { useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Medal, Star, Crown, Target, Book, DollarSign, PiggyBank, Search, ArrowUpRight, Bell, Zap, Laptop, TrendingUp, BarChart, Compass, CheckCircle2, Wallet, Gift, ChartPie, BriefcaseBusiness, Rocket, LineChart, LightbulbIcon, Diamond, Clock, Heart, Hourglass, ThumbsUp } from "lucide-react";
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates";
import { useToast } from "@/hooks/use-toast";

const AchievementsPage = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  const achievementCategories = [
    { id: 1, name: "All", count: 24, icon: <Star size={16} /> },
    { id: 2, name: "Budgeting", count: 9, icon: <DollarSign size={16} /> },
    { id: 3, name: "Savings", count: 6, icon: <PiggyBank size={16} /> },
    { id: 4, name: "Learning", count: 9, icon: <Book size={16} /> }
  ];

  const allAchievements = [
    // Original 6 achievements
    {
      id: 1,
      name: "Budget Master",
      description: "Stay under budget for 3 consecutive months",
      category: "Budgeting",
      progress: 67,
      icon: <Target className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: false,
      xp: 250,
      image: "https://images.unsplash.com/photo-1565514020179-026b92b4a5d0?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Savings Starter",
      description: "Save your first $500",
      category: "Savings",
      progress: 100,
      icon: <PiggyBank className="text-finny-green" />,
      color: "bg-finny-green",
      unlocked: true,
      xp: 100,
      image: "https://images.unsplash.com/photo-1633158829799-56bdf8e53fc1?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "Finance Scholar",
      description: "Complete 5 financial learning quests",
      category: "Learning",
      progress: 40,
      icon: <Book className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 200,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 4,
      name: "Perfect Planner",
      description: "Create and maintain a budget for 6 months",
      category: "Budgeting",
      progress: 100,
      icon: <Crown className="text-finny-orange" />,
      color: "bg-finny-orange",
      unlocked: true,
      xp: 300,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 5,
      name: "Goal Getter",
      description: "Complete your first savings goal",
      category: "Savings",
      progress: 80,
      icon: <Target className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 150,
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 6,
      name: "Streak Keeper",
      description: "Log in for 14 consecutive days",
      category: "Learning",
      progress: 100,
      icon: <Medal className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: true,
      xp: 50,
      image: "https://images.unsplash.com/photo-1519834704043-6acbb5208e54?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    // Additional 18 achievements to reach a total of 24
    {
      id: 7,
      name: "Financial Forecaster",
      description: "Create your first 12-month budget plan",
      category: "Budgeting",
      progress: 35,
      icon: <ChartPie className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 200,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21ed6c?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 8,
      name: "Expense Eliminator",
      description: "Reduce monthly expenses by 10%",
      category: "Budgeting",
      progress: 90,
      icon: <BarChart className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: false,
      xp: 150,
      image: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 9,
      name: "Investing Initiate",
      description: "Make your first investment",
      category: "Savings",
      progress: 100,
      icon: <TrendingUp className="text-finny-green" />,
      color: "bg-finny-green",
      unlocked: true,
      xp: 200,
      image: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 10,
      name: "Budget Balancer",
      description: "Maintain balanced budget categories for 2 months",
      category: "Budgeting",
      progress: 50,
      icon: <Wallet className="text-finny-orange" />,
      color: "bg-finny-orange",
      unlocked: false,
      xp: 100,
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 11,
      name: "Savings Superstar",
      description: "Reach $2,000 in your savings account",
      category: "Savings",
      progress: 65,
      icon: <Diamond className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 250,
      image: "https://images.unsplash.com/photo-1622160984287-4cd95d26d7be?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 12,
      name: "Financial Quiz Ace",
      description: "Score 100% on 3 financial literacy quizzes",
      category: "Learning",
      progress: 66,
      icon: <CheckCircle2 className="text-finny-green" />,
      color: "bg-finny-green",
      unlocked: false,
      xp: 150,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 13,
      name: "Emergency Fund Builder",
      description: "Create a 3-month emergency fund",
      category: "Savings",
      progress: 45,
      icon: <Zap className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: false,
      xp: 300,
      image: "https://images.unsplash.com/photo-1585435557343-3b92a70fefa1?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 14,
      name: "Financial Article Reader",
      description: "Read 10 financial articles",
      category: "Learning",
      progress: 70,
      icon: <Book className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 100,
      image: "https://images.unsplash.com/photo-1456081445452-e28e85b3fd80?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 15,
      name: "Custom Budget Creator",
      description: "Create a personalized budget with custom categories",
      category: "Budgeting",
      progress: 100,
      icon: <Compass className="text-finny-green" />,
      color: "bg-finny-green",
      unlocked: true,
      xp: 200,
      image: "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 16,
      name: "Finance Course Completer",
      description: "Complete a full financial education course",
      category: "Learning",
      progress: 20,
      icon: <Laptop className="text-finny-orange" />,
      color: "bg-finny-orange",
      unlocked: false,
      xp: 300,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 17,
      name: "Debt Destroyer",
      description: "Pay off a debt completely",
      category: "Budgeting",
      progress: 75,
      icon: <ThumbsUp className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: false,
      xp: 250,
      image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 18,
      name: "Money Mentor",
      description: "Help 3 friends set up their financial plans",
      category: "Learning",
      progress: 33,
      icon: <Heart className="text-finny-green" />,
      color: "bg-finny-green",
      unlocked: false,
      xp: 150,
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 19,
      name: "Financial Video Viewer",
      description: "Watch 5 educational finance videos",
      category: "Learning",
      progress: 80,
      icon: <Laptop className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 100,
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 20,
      name: "No-Spend Challenge",
      description: "Complete a 7-day no unnecessary spending challenge",
      category: "Budgeting",
      progress: 100,
      icon: <Gift className="text-finny-orange" />,
      color: "bg-finny-orange",
      unlocked: true,
      xp: 150,
      image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 21,
      name: "Long-term Investor",
      description: "Keep an investment for over 1 year",
      category: "Savings",
      progress: 100,
      icon: <Hourglass className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: true,
      xp: 300,
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 22,
      name: "Financial Plan Creator",
      description: "Create a 5-year financial plan",
      category: "Learning",
      progress: 50,
      icon: <BriefcaseBusiness className="text-finny-green" />,
      color: "bg-finny-green",
      unlocked: false,
      xp: 250,
      image: "https://images.unsplash.com/photo-1633158829799-56bdf8e53fc1?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 23,
      name: "Budget Reviewer",
      description: "Review and adjust your budget 12 times",
      category: "Budgeting",
      progress: 92,
      icon: <LineChart className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 200,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 24,
      name: "Financial Innovator",
      description: "Create a unique way to save or budget",
      category: "Learning",
      progress: 25,
      icon: <Rocket className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: false,
      xp: 350,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
  ];

  // Filter achievements based on active category and search query
  const filteredAchievements = useMemo(() => {
    let filtered = [...allAchievements];
    
    // Filter by category
    if (activeCategory !== 1) { // Not "All"
      const categoryName = achievementCategories.find(c => c.id === activeCategory)?.name;
      filtered = filtered.filter(a => a.category === categoryName);
    }
    
    // Filter by search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [allAchievements, activeCategory, searchQuery]);

  useRealTimeUpdates({
    tableName: "user_achievements",
    onDataChange: (payload) => {
      console.log("Achievement update:", payload);
      // In a real implementation, we would refresh achievements here
    }
  });

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    
    const category = achievementCategories.find(c => c.id === categoryId);
    if (category) {
      toast({
        title: `${category.name} Achievements`,
        description: `Showing ${category.count} ${category.name.toLowerCase()} achievements.`
      });
    }
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      toast({
        title: "Search Achievements",
        description: "Enter keywords to find specific achievements."
      });
    }
  };

  const handleViewDetails = (achievementId) => {
    toast({
      title: "Achievement Details",
      description: `Viewing details for achievement #${achievementId}.`
    });
  };

  // Calculate unlocked achievements count
  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  
  // Calculate total XP
  const totalXP = allAchievements
    .filter(a => a.unlocked)
    .reduce((total, achievement) => total + achievement.xp, 0);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Award className="text-finny-purple" />
          Achievements
        </h1>
        <p className="text-muted-foreground">Track your progress and earn rewards</p>
      </div>

      {/* Achievement stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-finny-purple/10 rounded-full flex items-center justify-center">
              <Award size={28} className="text-finny-purple" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements Earned</p>
              <p className="text-2xl font-bold">{unlockedCount} of 24</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-finny-blue/10 rounded-full flex items-center justify-center">
              <Star size={28} className="text-finny-blue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total XP Earned</p>
              <p className="text-2xl font-bold">{totalXP.toLocaleString()} XP</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-finny-green/10 rounded-full flex items-center justify-center">
              <Crown size={28} className="text-finny-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Level</p>
              <p className="text-2xl font-bold">Level {Math.floor(totalXP / 200) + 1}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LLM Integration Placeholder */}


      {/* Achievement filters and search */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {achievementCategories.map(category => (
          <Badge 
            key={category.id} 
            className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer ${
              category.id === activeCategory ? 'bg-finny-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.icon}
            {category.name}
            <span className="text-xs ml-1">({category.count})</span>
          </Badge>
        ))}
        <div className="ml-auto flex gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-8"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleSearch}
              >
                Close
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleSearch}
            >
              <Search size={14} />
              Search
            </Button>
          )}
        </div>
      </div>

      {/* Filtered results message */}
      {searchQuery.trim() !== "" && (
        <div className="mb-4 text-sm text-muted-foreground">
          Found {filteredAchievements.length} achievements matching "{searchQuery}"
        </div>
      )}

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className={`overflow-hidden hover:shadow-md transition-all ${
            achievement.unlocked ? '' : 'opacity-75'
          }`}>
            <div className="h-36 overflow-hidden relative">
              <img 
                src={achievement.image} 
                alt={achievement.name} 
                className="w-full h-full object-cover"
              />
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-finny-green text-white">Unlocked</Badge>
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.color.replace('bg-', 'bg-')}/10`}>
                  {achievement.icon}
                </div>
                {achievement.name}
              </CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {achievement.progress}% Complete
                </span>
                <span className="text-sm font-medium">
                  {achievement.xp} XP
                </span>
              </div>
              <Progress 
                value={achievement.progress} 
                className={`h-2 ${achievement.color}`}
              />
              
              {achievement.unlocked ? (
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-finny-green">
                    <Award size={16} className="mr-1" />
                    <span className="text-sm font-medium">Earned</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 flex items-center gap-1"
                    onClick={() => handleViewDetails(achievement.id)}
                  >
                    Details <ArrowUpRight size={12} />
                  </Button>
                </div>
              ) : (
                <div className="mt-4 text-sm text-muted-foreground">
                  {100 - achievement.progress}% more to unlock
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty state for search with no results */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Search className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No achievements found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setActiveCategory(1);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </AppLayout>
  );
};

export default AchievementsPage;