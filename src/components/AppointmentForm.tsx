
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { validateAppointmentForm } from '@/utils/appointmentValidation';
import type { Appointment } from '@/hooks/useAppointments';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSubmit: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => void;
  onEdit?: (appointment: Appointment) => void;
  existingAppointments: Appointment[];
  onCancel: () => void;
}

export const AppointmentForm = ({
  appointment,
  onSubmit,
  onEdit,
  existingAppointments,
  onCancel
}: AppointmentFormProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateAppointmentForm(
      formData,
      existingAppointments,
      appointment?.id
    );
    
    if (!validation.isValid) {
      toast({
        title: "Eroare validare",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    // Generăm un UUID valid pentru trainer_id
    const trainerId = crypto.randomUUID();
    const dateString = format(formData.date, 'yyyy-MM-dd');

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
    } else {
      onSubmit(appointmentData);
    }
  };

  return (
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
      
      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Anulează
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {isEditing ? 'Salvează Modificările' : 'Adaugă Programarea'}
        </Button>
      </div>
    </form>
  );
};
