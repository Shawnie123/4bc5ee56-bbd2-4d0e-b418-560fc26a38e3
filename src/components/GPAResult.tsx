
import { Card, CardContent } from "@/components/ui/card";

interface GPAResultProps {
  gpa: number;
}

const GPAResult = ({ gpa }: GPAResultProps) => {
  return (
    <Card className="focus-card bg-gradient-to-r from-indigo-50 to-purple-50">
      <CardContent className="pt-6 text-center">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Your Weighted GPA</h3>
        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {gpa.toFixed(2)}
        </div>
        <p className="text-sm text-slate-600 mt-2">out of 6.0</p>
        <div className="mt-4 text-xs text-slate-500 space-y-1">
          <p>• Advanced/AP classes: weighted out of 6.0</p>
          <p>• Core classes: weighted out of 5.0</p>
          <p>• Non-core classes: standard 4.0 scale</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPAResult;
