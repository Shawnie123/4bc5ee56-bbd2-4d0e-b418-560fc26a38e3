
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface Class {
  id: string;
  name: string;
  grade: string;
  isCore: boolean;
}

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

  const isAdvancedClass = (className: string) => {
    const lowerName = className.toLowerCase();
    return lowerName.includes('advanced') || lowerName.includes('adv') || lowerName.includes('ap');
  };

  const gradeToPoints = (grade: string, isAdvanced: boolean, isCore: boolean) => {
    const gradeUpper = grade.toUpperCase();
    let basePoints = 0;

    switch (gradeUpper) {
      case 'A+': case 'A': basePoints = 4.0; break;
      case 'A-': basePoints = 3.7; break;
      case 'B+': basePoints = 3.3; break;
      case 'B': basePoints = 3.0; break;
      case 'B-': basePoints = 2.7; break;
      case 'C+': basePoints = 2.3; break;
      case 'C': basePoints = 2.0; break;
      case 'C-': basePoints = 1.7; break;
      case 'D+': basePoints = 1.3; break;
      case 'D': basePoints = 1.0; break;
      case 'F': basePoints = 0.0; break;
      default: return null;
    }

    if (isAdvanced) {
      return Math.min(basePoints + 2.0, 6.0); // Advanced classes get +2 points, max 6.0
    } else if (isCore) {
      return Math.min(basePoints + 1.0, 5.0); // Core classes get +1 point, max 5.0
    } else {
      return basePoints; // Non-core classes stay at base points
    }
  };

  const calculateGPA = () => {
    const validClasses = classes.filter(cls => cls.name.trim() && cls.grade.trim());
    
    if (validClasses.length === 0) {
      setCalculatedGPA(null);
      return;
    }

    let totalPoints = 0;
    let totalClasses = 0;

    validClasses.forEach(cls => {
      const isAdvanced = isAdvancedClass(cls.name);
      const points = gradeToPoints(cls.grade, isAdvanced, cls.isCore);
      
      if (points !== null) {
        totalPoints += points;
        totalClasses += 1;
      }
    });

    if (totalClasses > 0) {
      setCalculatedGPA(totalPoints / totalClasses);
    } else {
      setCalculatedGPA(null);
    }
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
              <div key={cls.id} className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Class {index + 1}</span>
                  {classes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeClass(cls.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`name-${cls.id}`}>Class Name</Label>
                  <Input
                    id={`name-${cls.id}`}
                    placeholder="e.g., AP Chemistry, Advanced Math"
                    value={cls.name}
                    onChange={(e) => updateClass(cls.id, 'name', e.target.value)}
                    className="focus-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`grade-${cls.id}`}>Grade (A, B+, C-, etc.)</Label>
                  <Input
                    id={`grade-${cls.id}`}
                    placeholder="e.g., A, B+, C-"
                    value={cls.grade}
                    onChange={(e) => updateClass(cls.id, 'grade', e.target.value)}
                    className="focus-input"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`core-${cls.id}`}
                    checked={cls.isCore}
                    onChange={(e) => updateClass(cls.id, 'isCore', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor={`core-${cls.id}`} className="text-sm">
                    Core class (counts toward GPA)
                  </Label>
                </div>

                {cls.name && isAdvancedClass(cls.name) && (
                  <div className="text-xs text-indigo-600 bg-indigo-50 p-2 rounded">
                    ✨ This is an advanced class (weighted out of 6.0)
                  </div>
                )}
              </div>
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
            onClick={calculateGPA}
            className="focus-button w-full"
          >
            Calculate My GPA
          </Button>

          {calculatedGPA !== null && (
            <Card className="focus-card bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="pt-6 text-center">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Your Weighted GPA</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {calculatedGPA.toFixed(2)}
                </div>
                <p className="text-sm text-slate-600 mt-2">out of 6.0</p>
                <div className="mt-4 text-xs text-slate-500 space-y-1">
                  <p>• Advanced/AP classes: weighted out of 6.0</p>
                  <p>• Core classes: weighted out of 5.0</p>
                  <p>• Non-core classes: standard 4.0 scale</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;
