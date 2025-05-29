
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PREDEFINED_TRAINERS } from '@/data/predefinedUsers';

interface TrainerSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const TrainerSelect = ({ value, onValueChange, placeholder = "Selectează trainer" }: TrainerSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {PREDEFINED_TRAINERS.map((trainer) => (
          <SelectItem key={trainer.id} value={trainer.full_name}>
            {trainer.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
