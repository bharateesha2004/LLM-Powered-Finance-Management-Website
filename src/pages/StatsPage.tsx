// stats.tsx (Re-integrated Chatbot Logic into Original Structure)

import { useState, useEffect, useRef } from "react"; // Added useRef
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, LineChart, Calendar, Download, RefreshCw, Filter, ArrowUpDown, Bot } from "lucide-react"; // Added Bot
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts";
import { useExpenses } from "@/hooks/useExpenses";
import { exportData, setCustomDateRange, viewAllRecommendations } from "@/utils/buttonActions"; // Assuming these exist
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates"; // Assuming this exists

// Type definitions
type ExportFormat = "csv" | "pdf" | "json";

// --- Helper Functions (Original) ---
const groupExpensesByMonth = (expenses: any[]): { name: string; amount: number }[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const grouped: { [key: string]: number } = {};
    months.forEach(month => { grouped[month] = 0; });
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      // Added check for valid date
      if (!isNaN(date.getTime())) {
          const month = months[date.getMonth()];
          if (month) { // Check if month is valid
             grouped[month] += Number(expense.amount) || 0;
          }
      }
    });
    return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
};

const groupExpensesByCategory = (expenses: any[]): { name: string; value: number }[] => {
    const grouped: { [key: string]: number } = {};
    expenses.forEach(expense => {
      // Using description as category if no category relationship exists in fetched data
      const category = expense.categories?.name || expense.description || "Other";
      if (!grouped[category]) { grouped[category] = 0; }
      grouped[category] += Number(expense.amount) || 0;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

const processSavingsData = (savingsGoals: any[], expenses: any[], timeRange: string) => {
    // Using previous logic, acknowledge potential inaccuracies in 'savings' calculation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const savingsData: { name: string; savings: number; goal: number }[] = [];
    const today = new Date();
    let startDate = new Date();

    if (timeRange === "1year") { startDate.setFullYear(today.getFullYear() - 1); }
    else if (timeRange === "6months") { startDate.setMonth(today.getMonth() - 6); }
    else {
         const earliestExpenseDate = expenses.reduce((earliest, exp) => { const d = new Date(exp.date); return !isNaN(d.getTime()) && d < earliest ? d : earliest; }, new Date());
         const earliestGoalDate = savingsGoals.reduce((earliest, goal) => { const d = new Date(goal.created_at); return !isNaN(d.getTime()) && d < earliest ? d : earliest; }, new Date());
         startDate = earliestExpenseDate < earliestGoalDate ? earliestExpenseDate : earliestGoalDate;
         startDate = startDate < today ? startDate : new Date(today.getFullYear(), 0, 1);
    }

    const monthlySavings: { [key: string]: number } = {}; const monthlyGoals: { [key: string]: number } = {};
    let currentDate = new Date(startDate); currentDate.setDate(1);
    while (currentDate <= today) { const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`; monthlySavings[monthKey] = 0; monthlyGoals[monthKey] = 0; currentDate.setMonth(currentDate.getMonth() + 1); }

    savingsGoals.forEach(goal => {
        const goalDate = goal.deadline ? new Date(goal.deadline) : new Date(goal.created_at);
        if (!isNaN(goalDate.getTime())) {
            const monthKey = `${goalDate.getFullYear()}-${goalDate.getMonth()}`;
            if (monthlyGoals[monthKey] !== undefined) { monthlyGoals[monthKey] += Number(goal.target_amount) || 0; monthlySavings[monthKey] = Math.max(monthlySavings[monthKey], Number(goal.current_amount) || 0); }
        }
    });

    Object.keys(monthlySavings).forEach((monthKey) => {
        const [year, month] = monthKey.split('-'); const date = new Date(Number(year), Number(month));
        if (date >= startDate && date <= today) { savingsData.push({ name: months[date.getMonth()], savings: monthlySavings[monthKey], goal: monthlyGoals[monthKey] }); }
    });
     savingsData.sort((a,b) => months.indexOf(a.name) - months.indexOf(b.name));
    return savingsData;
};


// --- StatsPage Component ---
const StatsPage = () => {
  // --- Original State ---
  const { user } = useAuth();
  const { expenses, isLoading: isExpensesLoading, refetch } = useExpenses(); // Renamed isLoading
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<string>("6months");
  const [monthlyData, setMonthlyData] = useState<{ name: string; amount: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [averageMonthly, setAverageMonthly] = useState<number>(0);
  const [savingsData, setSavingsData] = useState<{ name: string; savings: number; goal: number }[]>([]);
  const [averageSavings, setAverageSavings] = useState<number>(0);

  // --- ADDED: Chatbot State ---
  const [prompt, setPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- ADDED: Chatbot useEffect for Scrolling ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // --- REPLACED: Chatbot Handler (for Hardcoded Backend) ---
  const handlePromptSubmit = async () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt || isChatLoading) return;

    setIsChatLoading(true);
    const newUserMessage = { role: "user" as const, content: currentPrompt };
    const thinkingMessage = { role: "assistant" as const, content: "Thinking..." };
    setChatHistory((prev) => [...prev, newUserMessage, thinkingMessage]);
    setPrompt("");

    // Call the Backend API (No Auth Token Needed)
    const apiUrl = 'http://localhost:8000/chat';
    let assistantResponse = "";

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No Authorization header needed for this version
        },
        body: JSON.stringify({ query: currentPrompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from backend:', response.status, errorData);
        assistantResponse = `Error: ${errorData.detail || 'Failed to get response from assistant.'}`;
      } else {
        const responseData = await response.json();
        assistantResponse = responseData.response;
      }

    } catch (error) {
      console.error('Network error:', error);
      assistantResponse = 'Network error: Could not reach the chatbot service.';
    } finally {
      // Update chat history with the final response
      setChatHistory((prev) => {
        const updatedHistory = prev.slice(0, -1); // Remove "Thinking..."
        updatedHistory.push({ role: "assistant", content: assistantResponse });
        return updatedHistory;
      });
      setIsChatLoading(false);
    }
  }; // End of handlePromptSubmit

  // --- Original Hooks & Handlers ---
  useRealTimeUpdates({ tableName: "expenses", onDataChange: () => { refetch(); } });

  const { data: savingsGoals, isLoading: isSavingsLoading, error: savingsError } = useQuery({
    queryKey: ['savings_goals', user?.id],
    queryFn: async () => {
        if (!user?.id) return [];
        const { data, error } = await supabase.from('savings_goals').select('*').eq('user_id', user.id);
        if (error) throw error; return data || [];
    }, enabled: !!user?.id, });

  useEffect(() => {
      if (savingsError) {
          toast({ title: "Error loading savings data", description: `Unable to fetch savings goals: ${savingsError.message}`, variant: "destructive" });
      }
  }, [savingsError, toast]);

  useEffect(() => {
      // Logic to process expenses and savings data based on timeRange
      if (expenses && !isExpensesLoading) {
          let filteredExpenses = [...expenses];
          // Filtering logic based on timeRange...
          if (timeRange === "6months") { const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); filteredExpenses = expenses.filter(exp => { const d = new Date(exp.date); return !isNaN(d.getTime()) && d >= sixMonthsAgo; }); }
          else if (timeRange === "1year") { const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); filteredExpenses = expenses.filter(exp => { const d = new Date(exp.date); return !isNaN(d.getTime()) && d >= oneYearAgo; }); }

          const monthlyGrouped = groupExpensesByMonth(filteredExpenses);
          const categoryGrouped = groupExpensesByCategory(filteredExpenses);
          setMonthlyData(monthlyGrouped);
          setCategoryData(categoryGrouped);
          const total = filteredExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
          setTotalSpent(total);
          const uniqueMonths = new Set(filteredExpenses.map(exp => { const date = new Date(exp.date); return !isNaN(date.getTime()) ? `${date.getFullYear()}-${date.getMonth()}` : null; }).filter(Boolean));
          const monthCount = uniqueMonths.size || 1;
          setAverageMonthly(total / monthCount);
      } else if (!isExpensesLoading) {
          setMonthlyData([]); setCategoryData([]); setTotalSpent(0); setAverageMonthly(0);
      }

      if (savingsGoals && !isSavingsLoading && expenses && !isExpensesLoading) {
          const processedSavings = processSavingsData(savingsGoals, expenses, timeRange);
          setSavingsData(processedSavings);
          const totalSavingsShown = processedSavings.reduce((sum, item) => sum + (item.savings || 0), 0);
          const savingsCount = processedSavings.length || 1;
          setAverageSavings(totalSavingsShown / savingsCount);
      } else if (!isSavingsLoading && !isExpensesLoading) {
          setSavingsData([]); setAverageSavings(0);
      }
  }, [expenses, timeRange, savingsGoals, isExpensesLoading, isSavingsLoading]); // Added loading states


  // Removing the auto-refresh interval as realtime updates should handle it
  // useEffect(() => {
  //   refetch();
  //   const interval = setInterval(() => { refetch(); }, 15000);
  //   return () => clearInterval(interval);
  // }, [refetch]);

  const handleRefresh = () => { refetch(); toast({ title: "Data refreshed..."}); };
  const handleTimeRangeChange = (range: string) => { setTimeRange(range); toast({ title: "Time range changed..." }); };
  const handleExport = (format: ExportFormat = "csv") => { exportData(format); };
  const handleCustomRange = () => { const result = setCustomDateRange(); console.log("Custom date range set:", result); };
  const handleViewAllRecommendations = () => { viewAllRecommendations(); };

  const COLORS = ['#9b87f5', '#1EAEDB', '#F97316', '#D946EF', '#10B981', '#8B5CF6'];

  // --- JSX Return ---
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8"> <h1 className="text-3xl font-bold flex items-center gap-2 mb-2"> <BarChart3 className="text-finny-purple" /> Financial Statistics </h1> <p className="text-muted-foreground">Analyze your financial data and track your progress</p> </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6"> {/* Time Range Badges */} <div className="flex flex-wrap gap-2 mb-4 md:mb-0"> {/* Badges */} <Badge className={`px-4 py-1 cursor-pointer ${timeRange === "6months" ? "bg-finny-purple text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => handleTimeRangeChange("6months")}>Last 6 Months</Badge> <Badge className={`px-4 py-1 cursor-pointer ${timeRange === "1year" ? "bg-finny-purple text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => handleTimeRangeChange("1year")}>Last Year</Badge> <Badge className={`px-4 py-1 cursor-pointer ${timeRange === "all" ? "bg-finny-purple text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => handleTimeRangeChange("all")}>All Time</Badge> </div> {/* Action Buttons */} <div className="flex gap-2"> {/* Buttons */} <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleCustomRange}><Calendar size={14} /> Custom Range</Button> <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleExport("csv")}><Download size={14} /> Export</Button> <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleRefresh}><RefreshCw size={14} /> Refresh</Button> </div> </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Monthly Spending Card */} <Card> <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="text-finny-purple h-5 w-5" /> Monthly Spending</CardTitle><CardDescription>Track your expenses over time</CardDescription></CardHeader><CardContent className="pt-0"><div className="h-64">{/* Chart Render */} {isExpensesLoading ? <p>Loading...</p> : monthlyData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#9b87f5" /></BarChart></ResponsiveContainer> : <p>No data</p> }</div><div className="mt-4">{/* Totals */} <p>Avg: ${averageMonthly.toFixed(2)}</p><p>Total: ${totalSpent.toFixed(2)}</p> </div></CardContent> </Card> {/* Category Card */} <Card> <CardHeader><CardTitle className="text-lg flex items-center gap-2"><PieChart className="text-finny-blue h-5 w-5" /> Spending by Category</CardTitle><CardDescription>Where your money is going</CardDescription></CardHeader><CardContent className="pt-0"><div className="h-64 flex justify-center">{/* Chart Render */} {isExpensesLoading ? <p>Loading...</p> : categoryData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><RechartsPieChart><Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">{categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></RechartsPieChart></ResponsiveContainer> : <p>No data</p> }</div></CardContent> </Card> {/* Savings Card */} <Card> <CardHeader><CardTitle className="text-lg flex items-center gap-2"><LineChart className="text-finny-green h-5 w-5" /> Savings Trend</CardTitle><CardDescription>Monthly savings vs. goal</CardDescription></CardHeader><CardContent className="pt-0"><div className="h-64">{/* Chart Render */} {isExpensesLoading || isSavingsLoading ? <p>Loading...</p> : savingsData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><RechartsLineChart data={savingsData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line name="Savings Progress" type="monotone" dataKey="savings" stroke="#10B981" /><Line name="Goal Target" type="monotone" dataKey="goal" stroke="#9b87f5" strokeDasharray="5 5" /><Legend /></RechartsLineChart></ResponsiveContainer> : <p>No data</p> }</div><div className="mt-4">{/* Totals */} <p>Avg Saved: ${averageSavings.toFixed(2)}</p> </div></CardContent> </Card> </div>

      {/* --- Chatbot Card --- */}
      {/* This section includes the chat display and input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Bot className="text-finny-purple" />
            Finny Assistant
          </CardTitle>
          <CardDescription>
            Chat with your personal financial assistant for insights and advice. <br/>
            <span className="text-xs italic"> Use 'DB:' prefix for questions about your data (e.g., 'DB: show my income'). Ask general questions normally.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Chat Container */}
            <div
              ref={chatContainerRef}
              className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 flex flex-col gap-3 border border-gray-200"
            >
              {chatHistory.length === 0 ? (
                <p className="text-muted-foreground text-center text-sm">
                  Ask a question like "What is a good savings rate?" or "DB: show my expenses this month"
                </p>
              ) : (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg text-sm shadow-sm ${
                        message.role === "user"
                          ? "bg-finny-purple text-white"
                          : message.content.startsWith("Error:") || message.content.startsWith("Network error:")
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : message.content === "Thinking..."
                          ? "bg-gray-200 text-gray-600 animate-pulse"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Prompt Input */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ask about your finances..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => {if (e.key === "Enter" && !isChatLoading) {handlePromptSubmit();}}}
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-finny-purple text-sm"
                disabled={isChatLoading}
              />
              <Button
                onClick={handlePromptSubmit}
                className="bg-finny-purple hover:bg-finny-purple/90 text-white px-5 py-3"
                disabled={isChatLoading || !prompt.trim()}
              >
                {isChatLoading ? "Asking..." : "Ask"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* --- End of Chatbot Card --- */}


      {/* Recent Transactions Analysis Card (Original Structure) */}
       <div className="mb-8"> <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">Recent Transactions Analysis (Placeholder)</h2></div> <Card><CardContent className="p-0"><div className="overflow-x-auto">{/* Original Table Structure */} <table className="w-full"><thead><tr className="border-b"><th className="text-left p-4">Category</th><th className="text-left p-4">This Month</th><th className="text-left p-4">Last Month</th><th className="text-left p-4">Change</th><th className="text-left p-4">Budget</th><th className="text-left p-4">Status</th></tr></thead><tbody>{/* Placeholder Rows */} <tr className="border-b hover:bg-gray-50"><td className="p-4 font-medium">Housing</td><td className="p-4">$1,200</td><td className="p-4">$1,200</td><td className="p-4">0%</td><td className="p-4">$1,200</td><td className="p-4"><Badge className="bg-finny-green/10 text-finny-green">On Track</Badge></td></tr> <tr className="border-b hover:bg-gray-50"><td className="p-4 font-medium">Food</td><td className="p-4">$580</td><td className="p-4">$450</td><td className="p-4 text-red-500">+28.9%</td><td className="p-4">$500</td><td className="p-4"><Badge className="bg-red-100 text-red-600">Over Budget</Badge></td></tr> <tr className="border-b hover:bg-gray-50"><td className="p-4 font-medium">Transportation</td><td className="p-4">$250</td><td className="p-4">$300</td><td className="p-4 text-green-500">-16.7%</td><td className="p-4">$300</td><td className="p-4"><Badge className="bg-finny-green/10 text-finny-green">Under Budget</Badge></td></tr> <tr className="border-b hover:bg-gray-50"><td className="p-4 font-medium">Entertainment</td><td className="p-4">$150</td><td className="p-4">$200</td><td className="p-4 text-green-500">-25%</td><td className="p-4">$200</td><td className="p-4"><Badge className="bg-finny-green/10 text-finny-green">Under Budget</Badge></td></tr> <tr className="hover:bg-gray-50"><td className="p-4 font-medium">Utilities</td><td className="p-4">$220</td><td className="p-4">$210</td><td className="p-4 text-red-500">+4.8%</td><td className="p-4">$250</td><td className="p-4"><Badge className="bg-finny-green/10 text-finny-green">Under Budget</Badge></td></tr></tbody></table> </div></CardContent></Card> </div>

      {/* Financial Health & Recommendations Grid (Original Structure) */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Financial Health Score Card */} <Card> {/* ... content kept as original ... */}<CardHeader><CardTitle className="text-lg">Financial Health Score (Placeholder)</CardTitle><CardDescription>Based on your spending, savings, and budgeting habits</CardDescription></CardHeader><CardContent><div className="flex flex-col items-center justify-center"><div className="w-36 h-36 rounded-full border-8 border-finny-purple flex items-center justify-center mb-4"><span className="text-4xl font-bold text-finny-purple">78</span></div><p className="font-medium text-lg">Good</p><p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">You've made great progress! Keep building your emergency fund to improve your score.</p></div><div className="grid grid-cols-3 gap-2 mt-6"><div className="p-2 bg-gray-50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Budgeting</p><p className="font-medium text-finny-purple">85</p></div><div className="p-2 bg-gray-50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Saving</p><p className="font-medium text-finny-blue">70</p></div><div className="p-2 bg-gray-50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Planning</p><p className="font-medium text-finny-green">75</p></div></div></CardContent> </Card> {/* Recommendations Card */} <Card> {/* ... content kept as original ... */}<CardHeader><CardTitle className="text-lg">Recommendations (Placeholder)</CardTitle><CardDescription>Custom financial advice based on your data</CardDescription></CardHeader><CardContent><div className="space-y-4">{/* Placeholder recommendations */}</div></CardContent> </Card> </div>
    </AppLayout>
  );
};

export default StatsPage;