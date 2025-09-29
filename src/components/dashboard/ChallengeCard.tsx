import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Award } from "lucide-react";
import { useState } from "react";
import { completeChallenge, skipChallenge } from "@/utils/buttonActions";
import { useAuth } from "@/contexts/AuthContext";
import useXpSystem from "@/hooks/useXpSystem";

const ChallengeCard = () => {
  const { user } = useAuth();
  const { addXp } = useXpSystem();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    const success = await completeChallenge('daily-challenge', user.id);
    setLoading(false);
    
    if (success) {
      setIsCompleted(true);
      // Award XP for completing the challenge
      addXp(50, "Completing daily challenge");
    }
  };

  const handleSkip = () => {
    skipChallenge();
    setIsSkipped(true);
    setIsCompleted(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="text-finny-purple h-5 w-5" />
          Daily Challenge
        </CardTitle>
        <CardDescription>Complete to earn XP and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        {isSkipped ? (
          <div className="space-y-4">
            <div className="bg-finny-purple/10 p-4 rounded-lg">
              <h3 className="font-medium mb-1">Your daily task is completed</h3>
              <p className="text-sm text-muted-foreground">
                Come back tomorrow for a new challenge.
              </p>
            </div>
            
            <Button 
              className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setIsSkipped(false)}
            >
              View Challenges
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-finny-purple/10 p-4 rounded-lg">
              <h3 className="font-medium mb-1">Track 3 expenses today</h3>
              <p className="text-sm text-muted-foreground">
                Log at least three expenses to keep your budget on track and earn rewards.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{isCompleted ? "Challenge complete!" : "Challenge progress"}</span>
                <span>{isCompleted ? "3/3" : "0/3"}</span>
              </div>
              <Progress value={isCompleted ? 100 : 0} className="h-2 bg-gray-200" />
            </div>
            
            <div className="flex items-center justify-between bg-finny-green/10 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="text-finny-green h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Reward</p>
                  <p className="text-xs text-muted-foreground">50 XP + Badge progress</p>
                </div>
              </div>
              {isCompleted && (
                <CheckCircle className="text-finny-green h-5 w-5" />
              )}
            </div>
            
            <div className="flex justify-center">
              {isCompleted ? (
                <Button 
                  className="w-1/2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={handleSkip}
                >
                  Done for Today
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-1/2"
                  onClick={handleSkip}
                  disabled={loading}
                >
                  Skip
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;