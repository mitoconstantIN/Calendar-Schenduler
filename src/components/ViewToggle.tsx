
import { Button } from '@/components/ui/button';
import { CalendarIcon, Calendar as CalendarDaysIcon } from 'lucide-react';
import type { ViewMode } from '@/pages/Index';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex border rounded-lg overflow-hidden bg-white">
      <Button
        variant={viewMode === 'day' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('day')}
        className="rounded-none border-0"
      >
        Zi
      </Button>
      <Button
        variant={viewMode === 'week' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('week')}
        className="rounded-none border-0 border-l"
      >
        Săptămână
      </Button>
      <Button
        variant={viewMode === 'month' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('month')}
        className="rounded-none border-0 border-l"
      >
        <CalendarDaysIcon className="w-4 h-4 mr-1" />
        Lună
      </Button>
    </div>
  );
};
