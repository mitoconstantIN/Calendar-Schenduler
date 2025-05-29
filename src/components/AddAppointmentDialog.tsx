
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppointmentForm } from '@/components/AppointmentForm';
import type { Appointment } from '@/hooks/useAppointments';

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => void;
  appointment?: Appointment | null;
  onEdit?: (appointment: Appointment) => void;
  existingAppointments: Appointment[];
}

export const AddAppointmentDialog = ({
  open,
  onOpenChange,
  onAdd,
  appointment,
  onEdit,
  existingAppointments
}: AddAppointmentDialogProps) => {
  const isEditing = !!appointment;

  const handleFormSubmit = (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    onAdd(appointmentData);
    onOpenChange(false);
  };

  const handleFormEdit = (appointmentData: Appointment) => {
    if (onEdit) {
      onEdit(appointmentData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifică Programarea' : 'Adaugă Programare Nouă'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifică detaliile programării existente.' 
              : 'Completează informațiile pentru o programare nouă. Poți adăuga mai multe programări pe aceeași zi, dar nu se pot suprapune orele pentru același trainer.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <AppointmentForm
          appointment={appointment}
          onSubmit={handleFormSubmit}
          onEdit={handleFormEdit}
          existingAppointments={existingAppointments}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
