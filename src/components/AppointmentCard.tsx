
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/hooks/useAppointments';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export const AppointmentCard = ({ 
  appointment, 
  onEdit, 
  onDelete, 
  compact = false 
}: AppointmentCardProps) => {
  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove seconds if present
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border-l-4 border-l-blue-500",
      compact ? "p-2" : "p-3"
    )}>
      <CardContent className={cn("space-y-2", compact ? "p-2" : "p-3")}>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-semibold text-gray-900 truncate",
              compact ? "text-sm" : "text-base"
            )}>
              {appointment.trainer_name}
            </h4>
            <p className={cn(
              "text-gray-600 truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              {appointment.school_name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(appointment)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ești sigur că vrei să ștergi programarea pentru <strong>{appointment.trainer_name}</strong> 
                    la <strong>{appointment.school_name}</strong>?
                    <br />
                    Această acțiune nu poate fi anulată.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anulează</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(appointment.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Șterge programarea
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
          </Badge>
          {!compact && (
            <Badge variant="secondary" className="text-xs">
              {format(parseISO(appointment.date), 'dd MMM', { locale: ro })}
            </Badge>
          )}
        </div>
        
        {appointment.observations && !compact && (
          <p className="text-xs text-gray-500 italic">
            {appointment.observations}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
