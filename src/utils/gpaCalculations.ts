
import { Class } from "@/types/gpa";

export const isAdvancedClass = (className: string) => {
  const lowerName = className.toLowerCase();
  return lowerName.includes('advanced') || lowerName.includes('adv') || lowerName.includes('ap');
};

export const numericalGradeToPoints = (grade: string, isAdvanced: boolean, isCore: boolean) => {
  const numGrade = parseFloat(grade);
  
  if (isNaN(numGrade) || numGrade < 0 || numGrade > 100) {
    return null;
  }

  let basePoints = 0;

  if (numGrade >= 97) basePoints = 4.0;
  else if (numGrade >= 93) basePoints = 4.0;
  else if (numGrade >= 90) basePoints = 3.7;
  else if (numGrade >= 87) basePoints = 3.3;
  else if (numGrade >= 83) basePoints = 3.0;
  else if (numGrade >= 80) basePoints = 2.7;
  else if (numGrade >= 77) basePoints = 2.3;
  else if (numGrade >= 73) basePoints = 2.0;
  else if (numGrade >= 70) basePoints = 1.7;
  else if (numGrade >= 67) basePoints = 1.3;
  else if (numGrade >= 65) basePoints = 1.0;
  else basePoints = 0.0;

  if (isAdvanced) {
    return Math.min(basePoints + 2.0, 6.0); // Advanced classes get +2 points, max 6.0
  } else if (isCore) {
    return Math.min(basePoints + 1.0, 5.0); // Core classes get +1 point, max 5.0
  } else {
    return basePoints; // Non-core classes stay at base points
  }
};

export const calculateGPA = (classes: Class[]) => {
  const validClasses = classes.filter(cls => cls.name.trim() && cls.grade.trim());
  
  if (validClasses.length === 0) {
    return null;
  }

  let totalPoints = 0;
  let totalClasses = 0;

  validClasses.forEach(cls => {
    const isAdvanced = isAdvancedClass(cls.name);
    const points = numericalGradeToPoints(cls.grade, isAdvanced, cls.isCore);
    
    if (points !== null) {
      totalPoints += points;
      totalClasses += 1;
    }
  });

  if (totalClasses > 0) {
    return totalPoints / totalClasses;
  } else {
    return null;
  }
};
