
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { Appointment } from '@/hooks/useAppointments';

interface DayDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  appointments: Appointment[];
}

export const DayDetailsDialog = ({ open, onOpenChange, date, appointments }: DayDetailsDialogProps) => {
  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove seconds if present
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {format(date, 'EEEE, dd MMMM yyyy', { locale: ro })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nu există programări pentru această zi</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Programări</h3>
                <Badge variant="secondary">
                  {appointments.length} {appointments.length === 1 ? 'programare' : 'programări'}
                </Badge>
              </div>
              
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.trainer_name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.school_name}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                    </Badge>
                  </div>
                  
                  {appointment.observations && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{appointment.observations}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
