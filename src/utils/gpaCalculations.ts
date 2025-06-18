
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

  // Direct conversion: grade/100 * scale
  if (isAdvanced) {
    return (numGrade / 100) * 6.0; // AP/Advanced classes: scale to 6.0
  } else if (isCore) {
    return (numGrade / 100) * 5.0; // Core classes: scale to 5.0
  } else {
    return (numGrade / 100) * 4.0; // Non-core classes: scale to 4.0
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
