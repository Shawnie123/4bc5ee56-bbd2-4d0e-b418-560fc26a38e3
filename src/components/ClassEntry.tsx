
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Class } from "@/types/gpa";
import { isAdvancedClass } from "@/utils/gpaCalculations";

interface ClassEntryProps {
  cls: Class;
  index: number;
  canDelete: boolean;
  onUpdate: (id: string, field: keyof Class, value: string | boolean) => void;
  onDelete: (id: string) => void;
}

const ClassEntry = ({ cls, index, canDelete, onUpdate, onDelete }: ClassEntryProps) => {
  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Class {index + 1}</span>
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(cls.id)}
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
          onChange={(e) => onUpdate(cls.id, 'name', e.target.value)}
          className="focus-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`grade-${cls.id}`}>Grade (0-100)</Label>
        <Input
          id={`grade-${cls.id}`}
          placeholder="e.g., 95, 87, 92"
          type="number"
          min="0"
          max="100"
          value={cls.grade}
          onChange={(e) => onUpdate(cls.id, 'grade', e.target.value)}
          className="focus-input"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`core-${cls.id}`}
          checked={cls.isCore}
          onChange={(e) => onUpdate(cls.id, 'isCore', e.target.checked)}
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
  );
};

export default ClassEntry;
