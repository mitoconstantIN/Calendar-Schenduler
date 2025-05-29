
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays } from 'lucide-react';
import type { ViewMode } from '@/pages/Index';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex rounded-lg border bg-background p-1">
      <Button
        variant={viewMode === 'day' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('day')}
        className="flex items-center gap-2"
      >
        <CalendarDays className="w-4 h-4" />
        <span className="hidden sm:inline">Zi</span>
      </Button>
      <Button
        variant={viewMode === 'month' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('month')}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden sm:inline">Lună</span>
      </Button>
    </div>
  );
};
