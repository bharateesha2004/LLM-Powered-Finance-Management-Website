
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, PiggyBank, Award, BarChart3, User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In the future, this would call Supabase auth.signOut()
    toast({
      title: "Logged out",
      description: "Come back soon to continue your adventure!",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-md md:min-h-screen p-4">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-finny-purple flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-finny-purple">Finny</span>
        </div>
        
        <nav className="space-y-2">
          <NavLink to="/dashboard" className={({ isActive }) => 
            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-finny-purple text-white" 
                : "hover:bg-finny-purple/10 text-gray-700"
            }`
          }>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/savings" className={({ isActive }) => 
            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-finny-purple text-white" 
                : "hover:bg-finny-purple/10 text-gray-700"
            }`
          }>
            <PiggyBank size={20} />
            <span>Savings</span>
            {/* Example of badge notification */}
            <Badge variant="outline" className="ml-auto bg-finny-green/20 text-finny-green">New</Badge>
          </NavLink>
          
          <NavLink to="/achievements" className={({ isActive }) => 
            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-finny-purple text-white" 
                : "hover:bg-finny-purple/10 text-gray-700"
            }`
          }>
            <Award size={20} />
            <span>Achievements</span>
          </NavLink>
          
          <NavLink to="/stats" className={({ isActive }) => 
            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-finny-purple text-white" 
                : "hover:bg-finny-purple/10 text-gray-700"
            }`
          }>
            <BarChart3 size={20} />
            <span>Statistics</span>
          </NavLink>
          
          <NavLink to="/profile" className={({ isActive }) => 
            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-finny-purple text-white" 
                : "hover:bg-finny-purple/10 text-gray-700"
            }`
          }>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4 md:static md:mt-auto md:pt-8">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mt-8"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Welcome, Adventurer!</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="font-medium">Level 5</p>
                <p className="text-sm text-muted-foreground">1200 XP</p>
              </div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>FN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
