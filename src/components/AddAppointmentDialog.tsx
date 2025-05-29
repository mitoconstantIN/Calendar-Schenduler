
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
import type { Appointment } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (appointment: Omit<Appointment, 'id'>) => void;
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
    trainerName: '',
    schoolName: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    observations: ''
  });

  const isEditing = !!appointment;

  useEffect(() => {
    if (appointment) {
      setFormData({
        trainerName: appointment.trainerName,
        schoolName: appointment.schoolName,
        date: new Date(appointment.date),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        observations: appointment.observations || ''
      });
    } else {
      setFormData({
        trainerName: '',
        schoolName: '',
        date: new Date(),
        startTime: '',
        endTime: '',
        observations: ''
      });
    }
  }, [appointment]);

  const validateTimeOverlap = (trainerName: string, date: string, startTime: string, endTime: string, excludeId?: string) => {
    const conflictingAppointments = existingAppointments.filter(apt => 
      apt.trainerName === trainerName && 
      apt.date === date &&
      apt.id !== excludeId
    );

    for (const apt of conflictingAppointments) {
      const aptStart = apt.startTime;
      const aptEnd = apt.endTime;
      
      // Check if times overlap
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.trainerName || !formData.schoolName || !formData.startTime || !formData.endTime) {
      toast({
        title: "Eroare validare",
        description: "Te rog completează toate câmpurile obligatorii.",
        variant: "destructive",
      });
      return;
    }

    // Validate time order
    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Eroare validare",
        description: "Ora de începere trebuie să fie înainte de ora de sfârșit.",
        variant: "destructive",
      });
      return;
    }

    const dateString = format(formData.date, 'yyyy-MM-dd');
    
    // Validate time overlap
    const validation = validateTimeOverlap(
      formData.trainerName, 
      dateString, 
      formData.startTime, 
      formData.endTime,
      appointment?.id
    );
    
    if (validation.hasConflict) {
      toast({
        title: "Conflict de programare",
        description: `${formData.trainerName} are deja o programare între ${validation.conflictingAppointment?.startTime} - ${validation.conflictingAppointment?.endTime} la ${validation.conflictingAppointment?.schoolName}.`,
        variant: "destructive",
      });
      return;
    }

    const appointmentData = {
      trainerName: formData.trainerName,
      schoolName: formData.schoolName,
      date: dateString,
      startTime: formData.startTime,
      endTime: formData.endTime,
      observations: formData.observations
    };

    if (isEditing && appointment && onEdit) {
      onEdit({
        ...appointmentData,
        id: appointment.id
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
              <Label htmlFor="trainerName">Nume Trainer *</Label>
              <Input
                id="trainerName"
                value={formData.trainerName}
                onChange={(e) => setFormData(prev => ({...prev, trainerName: e.target.value}))}
                placeholder="Ex: Ana Popescu"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="schoolName">Nume Școală *</Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => setFormData(prev => ({...prev, schoolName: e.target.value}))}
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
                <Label htmlFor="startTime">Ora Început *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({...prev, startTime: e.target.value}))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Ora Sfârșit *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({...prev, endTime: e.target.value}))}
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
