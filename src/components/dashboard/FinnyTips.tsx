import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";

const FinnyTips = () => {
  const randomTip = {
    id: "tip-1",
    title: "The 50/30/20 Rule",
    content: "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.",
    category: "Budgeting"
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Book className="text-finny-blue h-5 w-5" />
          Tip of the Day
        </CardTitle>
        <CardDescription>Financial wisdom for your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-finny-blue/10 p-4 rounded-lg">
            <h3 className="font-medium mb-1">{randomTip.title}</h3>
            <p className="text-sm text-muted-foreground">
              {randomTip.content}
            </p>
            <div className="mt-2">
              <span className="inline-block bg-finny-blue/20 text-finny-blue text-xs px-2 py-1 rounded">
                {randomTip.category}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinnyTips;