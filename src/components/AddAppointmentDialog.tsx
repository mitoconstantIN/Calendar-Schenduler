
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { TrainerSelect } from '@/components/TrainerSelect';
import { PREDEFINED_TRAINERS } from '@/data/predefinedUsers';
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
  const [formData, setFormData] = useState({
    trainer_name: '',
    school_name: '',
    date: new Date(),
    start_time: '',
    end_time: '',
    observations: ''
  });

  const isEditing = !!appointment;

  useEffect(() => {
    if (appointment) {
      setFormData({
        trainer_name: appointment.trainer_name,
        school_name: appointment.school_name,
        date: new Date(appointment.date),
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        observations: appointment.observations || ''
      });
    } else {
      setFormData({
        trainer_name: '',
        school_name: '',
        date: new Date(),
        start_time: '',
        end_time: '',
        observations: ''
      });
    }
  }, [appointment]);

  const validateTimeOverlap = (trainerName: string, date: string, startTime: string, endTime: string, excludeId?: string) => {
    const conflictingAppointments = existingAppointments.filter(apt => 
      apt.trainer_name === trainerName && 
      apt.date === date &&
      apt.id !== excludeId
    );

    for (const apt of conflictingAppointments) {
      const aptStart = apt.start_time;
      const aptEnd = apt.end_time;
      
      // Check if times overlap - improved logic
      if (
        (startTime >= aptStart && startTime < aptEnd) ||
        (endTime > aptStart && endTime <= aptEnd) ||
        (startTime <= aptStart && endTime >= aptEnd)
      ) {
        return {
          hasConflict: true,
          conflictingAppointment: apt
        };
      }
    }
    
    return { hasConflict: false };
  };

  const validateBusinessHours = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.replace(':', ''));
    const end = parseInt(endTime.replace(':', ''));
    
    // Business hours: 8:00 - 18:00
    if (start < 800 || end > 1800) {
      return {
        isValid: false,
        message: "Programările trebuie să fie între 08:00 și 18:00"
      };
    }
    
    return { isValid: true };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.trainer_name || !formData.school_name || !formData.start_time || !formData.end_time) {
      toast({
        title: "Eroare validare",
        description: "Te rog completează toate câmpurile obligatorii.",
        variant: "destructive",
      });
      return;
    }

    // Validate time order
    if (formData.start_time >= formData.end_time) {
      toast({
        title: "Eroare validare",
        description: "Ora de începere trebuie să fie înainte de ora de sfârșit.",
        variant: "destructive",
      });
      return;
    }

    // Validate business hours
    const businessHoursValidation = validateBusinessHours(formData.start_time, formData.end_time);
    if (!businessHoursValidation.isValid) {
      toast({
        title: "Eroare validare",
        description: businessHoursValidation.message,
        variant: "destructive",
      });
      return;
    }

    const dateString = format(formData.date, 'yyyy-MM-dd');
    
    // Validate time overlap
    const validation = validateTimeOverlap(
      formData.trainer_name, 
      dateString, 
      formData.start_time, 
      formData.end_time,
      appointment?.id
    );
    
    if (validation.hasConflict) {
      toast({
        title: "Conflict de programare",
        description: `${formData.trainer_name} are deja o programare între ${validation.conflictingAppointment?.start_time} - ${validation.conflictingAppointment?.end_time} la ${validation.conflictingAppointment?.school_name}.`,
        variant: "destructive",
      });
      return;
    }

    // Get trainer ID from predefined trainers
    const selectedTrainer = PREDEFINED_TRAINERS.find(t => t.full_name === formData.trainer_name);
    const trainerId = selectedTrainer?.id || '00000000-0000-0000-0000-000000000000';

    const appointmentData = {
      trainer_id: trainerId,
      trainer_name: formData.trainer_name,
      school_name: formData.school_name,
      date: dateString,
      start_time: formData.start_time,
      end_time: formData.end_time,
      observations: formData.observations
    };

    if (isEditing && appointment && onEdit) {
      onEdit({
        ...appointmentData,
        id: appointment.id,
        created_at: appointment.created_at,
        updated_at: new Date().toISOString()
      });
      toast({
        title: "Programare modificată",
        description: "Programarea a fost modificată cu succes.",
      });
    } else {
      onAdd(appointmentData);
      toast({
        title: "Programare adăugată",
        description: "Programarea a fost adăugată cu succes.",
      });
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
              : 'Completează informațiile pentru o programare nouă.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="trainer_name">Nume Trainer *</Label>
              <TrainerSelect
                value={formData.trainer_name}
                onValueChange={(value) => setFormData(prev => ({...prev, trainer_name: value}))}
                placeholder="Selectează trainer"
              />
            </div>
            
            <div>
              <Label htmlFor="school_name">Nume Școală *</Label>
              <Input
                id="school_name"
                value={formData.school_name}
                onChange={(e) => setFormData(prev => ({...prev, school_name: e.target.value}))}
                placeholder="Ex: Școala Gimnazială Nr. 1"
                required
              />
            </div>
            
            <div>
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP", { locale: ro }) : "Selectează data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({...prev, date}))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start_time">Ora Început *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({...prev, start_time: e.target.value}))}
                  min="08:00"
                  max="18:00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_time">Ora Sfârșit *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({...prev, end_time: e.target.value}))}
                  min="08:00"
                  max="18:00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="observations">Observații</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({...prev, observations: e.target.value}))}
                placeholder="Observații opționale..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anulează
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isEditing ? 'Salvează Modificările' : 'Adaugă Programarea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
