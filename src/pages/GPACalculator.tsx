
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Class } from "@/types/gpa";
import { calculateGPA } from "@/utils/gpaCalculations";
import ClassEntry from "@/components/ClassEntry";
import GPAResult from "@/components/GPAResult";

const GPACalculator = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [calculatedGPA, setCalculatedGPA] = useState<number | null>(null);

  useEffect(() => {
    const savedClasses = localStorage.getItem('gpa-classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      // Initialize with 8 empty classes
      const initialClasses = Array.from({ length: 8 }, (_, i) => ({
        id: `class-${i + 1}`,
        name: '',
        grade: '',
        isCore: true
      }));
      setClasses(initialClasses);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gpa-classes', JSON.stringify(classes));
  }, [classes]);

  const updateClass = (id: string, field: keyof Class, value: string | boolean) => {
    setClasses(prev => prev.map(cls => 
      cls.id === id ? { ...cls, [field]: value } : cls
    ));
  };

  const addNewClass = () => {
    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: '',
      grade: '',
      isCore: true
    };
    setClasses(prev => [...prev, newClass]);
  };

  const removeClass = (id: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
  };

  const handleCalculateGPA = () => {
    const gpa = calculateGPA(classes);
    setCalculatedGPA(gpa);
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            GPA Calculator
          </h1>
          <p className="text-slate-600 mt-2">Track your grades and calculate weighted GPA</p>
        </div>

        <Card className="focus-card">
          <CardHeader>
            <CardTitle className="text-lg">Your Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classes.map((cls, index) => (
              <ClassEntry
                key={cls.id}
                cls={cls}
                index={index}
                canDelete={classes.length > 1}
                onUpdate={updateClass}
                onDelete={removeClass}
              />
            ))}

            <Button
              onClick={addNewClass}
              variant="outline"
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Another Class
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={handleCalculateGPA}
            className="focus-button w-full"
          >
            Calculate My GPA
          </Button>

          {calculatedGPA !== null && (
            <GPAResult gpa={calculatedGPA} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;
