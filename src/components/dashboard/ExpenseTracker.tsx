import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PiggyBank, Plus, PlusCircle, Sparkles, Check } from "lucide-react";
import { useExpenses, NewExpense } from "@/hooks/useExpenses";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates";
import useXpSystem from "@/hooks/useXpSystem";

const ExpenseTracker = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { expenses, addExpense, isAdding, refetch } = useExpenses();
  const { toast } = useToast();
  const { addXp } = useXpSystem();
  
  // Use the first 3 most recent expenses
  const recentTransactions = expenses?.slice(0, 3) || [];

  // Set up real-time updates for expenses
  useRealTimeUpdates({
    tableName: "expenses",
    events: ["INSERT"],
    onDataChange: () => {
      refetch();
    }
  });

  // Ensure expense data is up-to-date
  useEffect(() => {
    // Initial fetch
    refetch();
  }, [refetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: "Missing information",
        description: "Please provide both amount and category.",
        variant: "destructive"
      });
      return;
    }
    
    const newExpense: NewExpense = {
      amount: parseFloat(amount),
      category_id: null, // Keep using category_id as defined in your type
      description: category, // Use only the category as the description
      date: new Date().toISOString().split("T")[0]
    };
    
    try {
      await addExpense(newExpense);
      
      // Clear form
      setAmount("");
      setCategory("");
      setDescription("");
      
      // Show confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Add XP for logging an expense
      addXp(10, "Logging an expense");
      
      // Force refresh data
      refetch();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="text-finny-purple" />
          Track Your Expenses
        </CardTitle>
        <CardDescription>
          Log your spending to earn points and stay on track
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  required
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expense-description">Description (optional)</Label>
            <Input
              id="expense-description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-finny-purple hover:bg-finny-purple-dark"
            disabled={isAdding}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isAdding ? "Logging..." : "Log Expense"}
          </Button>
        </form>
        
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
            <div className="confetti-container">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    backgroundColor: ["#9b87f5", "#1EAEDB", "#F97316", "#D946EF"][
                      Math.floor(Math.random() * 4)
                    ],
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `confetti ${Math.random() * 1 + 2}s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Transactions</h3>
          <div className="space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-finny-purple/20 text-finny-purple`}>
                      {transaction.description ? transaction.description.charAt(0).toUpperCase() : "$"}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description || "Expense"}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No recent transactions yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-finny-purple/10 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="text-finny-purple" size={20} />
            <h3 className="font-medium">Expense Tracking Quest</h3>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-finny-purple/20 flex items-center justify-center text-xs">
                <Check size={14} className="text-finny-purple" />
              </div>
              <p className="text-sm">Log 5 expenses this week ({Math.min(recentTransactions.length, 5)}/5)</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-finny-purple rounded-full" style={{ width: `${Math.min(recentTransactions.length / 5 * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground">Reward: 100 XP + "Expense Tracker" badge</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseTracker;