import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Target, TrendingUp, Plus, ArrowRight, X, Calendar, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  viewDetailedReport, 
  createNewSavingsGoal, 
  updateSavingsGoal 
} from "@/utils/buttonActions";
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Updated viewAllHistory function that opens a modal instead of redirecting
export const viewAllHistory = () => {
  // This is a placeholder - the actual implementation will be in the component
  return true;
};

const SavingsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: "",
    description: "",
    color: "bg-finny-purple" // Default color
  });

  const [savingsGoals, setSavingsGoals] = useState([
    {
      id: "1",
      title: "Emergency Fund",
      current: 1240,
      target: 5000,
      deadline: "December 2023",
      progress: 24,
      description: "3-6 months of essential expenses",
      color: "bg-finny-blue"
    },
    {
      id: "2", 
      title: "New Laptop",
      current: 540,
      target: 1200,
      deadline: "August 2023",
      progress: 45,
      description: "For work and personal projects",
      color: "bg-finny-purple"
    },
    {
      id: "3",
      title: "Vacation",
      current: 250,
      target: 2000,
      deadline: "June 2024",
      progress: 12,
      description: "Summer getaway",
      color: "bg-finny-green"
    }
  ]);

  // Set up real-time updates for savings_goals
  useRealTimeUpdates({
    tableName: "savings_goals",
    onDataChange: (payload) => {
      // If we had actual database data, we would refresh or update the goals here
      console.log("Savings goal updated:", payload);
    }
  });

  // Fetch transaction history when modal opens
  const fetchTransactionHistory = async () => {
    try {
      setIsHistoryLoading(true);
      setHistoryError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Query both the savings_goals and transactions for this user
      const { data, error } = await supabase
        .from('savings_goals')
        .select(`
          id,
          name,
          target_amount,
          current_amount,
          deadline,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setHistoryData(data || []);
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      setHistoryError("Failed to load savings history. Please try again.");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleViewAllHistory = () => {
    setShowHistoryModal(true);
    fetchTransactionHistory();
  };

  const handleDetailedReport = () => {
    viewDetailedReport();
  };

  const handleNewGoal = () => {
    setShowForm(true);
  };

  const handleUpdateGoal = (goalId) => {
    updateSavingsGoal(goalId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new goal with the form data
    const goal = {
      id: (savingsGoals.length + 1).toString(),
      title: newGoal.title,
      current: 0, // Start with zero progress
      target: parseFloat(newGoal.target),
      deadline: formatDate(newGoal.deadline), // Format the date from the calendar
      progress: 0, // Start with zero progress percentage
      description: newGoal.description,
      color: newGoal.color // Using default color
    };
    
    // Add the new goal to the list
    setSavingsGoals([...savingsGoals, goal]);
    
    // Reset form and hide it
    setNewGoal({
      title: "",
      target: "",
      deadline: "",
      description: "",
      color: "bg-finny-purple"
    });
    setShowForm(false);
  };

  // Helper function to format date from calendar input (YYYY-MM-DD) to month name format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculate total current and target savings
  const totalCurrent = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const totalProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Savings Goals</h1>
        <p className="text-muted-foreground">Track and manage your savings goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="text-finny-purple" />
              Total Savings Progress
            </CardTitle>
            <CardDescription>Combined progress across all your saving goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold">${totalCurrent.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">/ ${totalTarget.toLocaleString()} total goal</span>
              </div>
              <Badge className="bg-finny-purple text-white">{totalProgress}% Complete</Badge>
            </div>
            <Progress value={totalProgress} className="h-3 bg-gray-200" />
            
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-muted-foreground">Started: January 2023</span>
              <Button 
                variant="link" 
                className="flex items-center text-finny-purple p-0"
                onClick={handleDetailedReport}
              >
                View Detailed Report <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="text-finny-green h-5 w-5" />
              Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="w-16 h-16 rounded-full bg-finny-green/10 flex items-center justify-center mb-3">
                <TrendingUp className="text-finny-green h-8 w-8" />
              </div>
              <h3 className="font-semibold text-center mb-1">Consistent Saver</h3>
              <p className="text-xs text-muted-foreground text-center">
                Contributed to goals for 5 weeks straight!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Savings Goals</h2>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleNewGoal}
          >
            <Plus className="h-4 w-4" /> New Goal
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6 border-2 border-finny-purple animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="text-finny-purple h-5 w-5" />
                  Add New Savings Goal
                </CardTitle>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Fill in the details to create your new savings goal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input
                      id="goal-title"
                      name="title"
                      placeholder="e.g., New Car"
                      value={newGoal.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal-target">Target Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                      <Input
                        id="goal-target"
                        name="target"
                        type="number"
                        placeholder="0.00"
                        value={newGoal.target}
                        onChange={handleInputChange}
                        className="pl-8"
                        required
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline">Target Date</Label>
                  <Input
                    id="goal-deadline"
                    name="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-description">Description (optional)</Label>
                  <Input
                    id="goal-description"
                    name="description"
                    placeholder="What are you saving for?"
                    value={newGoal.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-finny-purple hover:bg-finny-purple-dark"
                  >
                    Create Goal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">${goal.current.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">of ${goal.target.toLocaleString()} goal</p>
                  </div>
                  <div className="bg-finny-purple/10 py-1 px-3 rounded-full">
                    <span className="text-sm font-medium text-finny-purple">{goal.progress}%</span>
                  </div>
                </div>
                
                <Progress value={goal.progress} className={`h-2 ${goal.color}`} />
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">Target: {goal.deadline}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => handleUpdateGoal(goal.id)}
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card 
            className="border-dashed border-2 flex flex-col items-center justify-center p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleNewGoal}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="font-medium">Add New Goal</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Create a new savings target to track
            </p>
          </Card>
        </div>
      </div>

      {/* LLM Integration Placeholder */}
      <Card className="mb-8 border-2 border-dashed border-finny-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="text-finny-purple" />
            Finny's Savings Advice
          </CardTitle>
          <CardDescription>
            This section will contain AI-powered financial advice for your savings goals
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-32 bg-gray-50">
          <p className="text-muted-foreground text-center">
            LLM integration placeholder - personalized savings advice will appear here
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Savings History</CardTitle>
            <CardDescription>Your recent contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Emergency Fund</p>
                  <p className="text-xs text-muted-foreground">April 10, 2023</p>
                </div>
                <span className="font-medium text-finny-green">+$150.00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New Laptop</p>
                  <p className="text-xs text-muted-foreground">April 5, 2023</p>
                </div>
                <span className="font-medium text-finny-green">+$75.00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Vacation</p>
                  <p className="text-xs text-muted-foreground">April 1, 2023</p>
                </div>
                <span className="font-medium text-finny-green">+$50.00</span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllHistory}
              >
                View All History
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Savings Tips</CardTitle>
            <CardDescription>Strategies to reach your goals faster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-finny-blue/5 border border-finny-blue/20 rounded-lg">
                <h4 className="font-medium text-finny-blue mb-1">Automate Your Savings</h4>
                <p className="text-sm">Set up automatic transfers to your savings accounts on payday.</p>
              </div>
              <div className="p-3 bg-finny-purple/5 border border-finny-purple/20 rounded-lg">
                <h4 className="font-medium text-finny-purple mb-1">Use the 50/30/20 Rule</h4>
                <p className="text-sm">Allocate 50% to needs, 30% to wants, and 20% to savings.</p>
              </div>
              <div className="p-3 bg-finny-green/5 border border-finny-green/20 rounded-lg">
                <h4 className="font-medium text-finny-green mb-1">Save Unexpected Income</h4>
                <p className="text-sm">Put bonuses, tax refunds, and gifts directly into savings.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Calendar className="text-finny-purple h-5 w-5" />
              Savings History
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Complete record of your savings contributions and goal changes
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={fetchTransactionHistory}
              disabled={isHistoryLoading}
            >
              <RefreshCw size={14} className={isHistoryLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

          {isHistoryLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-finny-purple"></div>
            </div>
          )}

          {historyError && (
            <div className="text-center py-6 text-red-500">
              <p>{historyError}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={fetchTransactionHistory}
              >
                Try Again
              </Button>
            </div>
          )}

          {!isHistoryLoading && !historyError && historyData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No savings history found.
            </div>
          )}

          {!isHistoryLoading && !historyError && historyData.length > 0 && (
            <div className="space-y-4">
              {historyData.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-finny-purple/20 flex items-center justify-center text-finny-purple">
                      {item.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.updated_at), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-finny-green">
                      ${parseFloat(item.current_amount).toFixed(2)} / ${parseFloat(item.target_amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Target: {format(new Date(item.deadline), "MMM yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default SavingsPage;