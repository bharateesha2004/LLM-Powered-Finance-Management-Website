
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Shield, BarChart3, PiggyBank, Flame, ChevronRight, LightbulbIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-finny-purple to-finny-blue py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Financial Adventure Begins Here
              </h1>
              <p className="text-xl mb-8 text-white/80">
                Make budgeting fun with challenges, rewards, and personalized financial guidance.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button 
                  className="bg-white text-finny-purple hover:bg-white/90 text-lg px-8 py-6"
                  onClick={() => navigate("/auth")}
                >
                  Start Your Adventure
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-72 h-72 bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-xl">
                <img 
                  src="https://cdn.gpteng.co/backpack/images/d2f7cefa-d3d3-4582-bb70-9703b01442a1/9fd6c28e-5eca-40ae-b564-35173bb201c3-owl_cartoon.webp" 
                  alt="Finny the Financial Owl" 
                  className="w-full h-full object-contain animate-bounce"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Turn Finance Into Fun</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our gamified approach makes managing your money an exciting adventure rather than a chore.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-finny-purple/10 flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-finny-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quests & Challenges</h3>
              <p className="text-gray-600">
                Complete daily financial challenges to earn points, level up, and unlock rewards.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3" 
                alt="Challenges visualization" 
                className="mt-4 rounded-md w-full h-32 object-cover"
              />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-finny-blue/10 flex items-center justify-center mb-4">
                <PiggyBank size={24} className="text-finny-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Goal Tracking</h3>
              <p className="text-gray-600">
                Set savings goals and watch your progress with beautiful visual indicators.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3" 
                alt="Savings goals chart" 
                className="mt-4 rounded-md w-full h-32 object-cover"
              />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-finny-orange/10 flex items-center justify-center mb-4">
                <Flame size={24} className="text-finny-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Streaks & Habits</h3>
              <p className="text-gray-600">
                Build positive financial habits with streak tracking and daily reminders.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3" 
                alt="Habit tracking calendar" 
                className="mt-4 rounded-md w-full h-32 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">More Ways to Grow</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore additional features designed to make financial growth engaging
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex gap-4">
              <div className="w-16 h-16 rounded-full bg-finny-purple flex items-center justify-center shrink-0">
                <BarChart3 size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Data-Driven Insights</h3>
                <p className="text-gray-600 mb-4">
                  Get personalized insights about your spending habits and see visual breakdowns of your financial health.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3" 
                  alt="Financial analytics dashboard" 
                  className="rounded-md w-full h-40 object-cover"
                />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex gap-4">
              <div className="w-16 h-16 rounded-full bg-finny-blue flex items-center justify-center shrink-0">
                <Shield size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Learning Adventures</h3>
                <p className="text-gray-600 mb-4">
                  Enhance your financial literacy through interactive lessons and challenges guided by Finny.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3" 
                  alt="Financial education" 
                  className="rounded-md w-full h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Teaser Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-finny-purple/10 to-finny-blue/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <img 
                src="https://cdn.gpteng.co/backpack/images/d2f7cefa-d3d3-4582-bb70-9703b01442a1/9fd6c28e-5eca-40ae-b564-35173bb201c3-owl_cartoon.webp" 
                alt="Finny the Financial Owl" 
                className="w-60 h-60 mx-auto object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Meet Finny, Your Financial Guide</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Finny is your personal AI financial assistant who provides tips, challenges, and insights tailored to your financial journey.
              </p>
              <div className="p-4 bg-white rounded-lg shadow-md border border-finny-purple/20">
                <p className="italic text-finny-purple">
                  "Looking to save more? Try the 30-day coffee challenge to see how much you can set aside!"
                </p>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <LightbulbIcon size={16} className="mr-2" />
                  <span>Finny's Tip of the Day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-finny-purple/5 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Financial Adventure?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join thousands of users who are turning financial management into an exciting journey.
          </p>
          <Button 
            className="bg-finny-purple hover:bg-finny-purple-dark text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-finny-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="ml-2 font-bold text-finny-purple">Finny's Financial Adventure</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Finny's Financial Adventure. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
