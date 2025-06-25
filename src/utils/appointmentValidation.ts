
import { format } from 'date-fns';
import type { Appointment } from '@/hooks/useAppointments';

export interface ValidationResult {
  hasConflict: boolean;
  conflictingAppointment?: Appointment;
}

export interface BusinessHoursValidation {
  isValid: boolean;
  message?: string;
}

export const validateTimeOverlap = (
  trainerName: string, 
  date: string, 
  startTime: string, 
  endTime: string, 
  existingAppointments: Appointment[],
  excludeId?: string
): ValidationResult => {
  // Filtrăm doar programările pentru același trainer în aceeași zi
  const trainerAppointmentsOnSameDay = existingAppointments.filter(apt => 
    apt.trainer_name === trainerName && 
    apt.date === date &&
    apt.id !== excludeId // Excludem programarea curentă dacă este editare
  );

  // Verificăm suprapunerea doar cu programările aceluiași trainer
  for (const apt of trainerAppointmentsOnSameDay) {
    const aptStart = apt.start_time;
    const aptEnd = apt.end_time;
    
    // Verificăm dacă orele se suprapun
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

export const validateBusinessHours = (startTime: string, endTime: string): BusinessHoursValidation => {
  // Nu mai avem restricții de ore de lucru - orice oră este validă
  return { isValid: true };
};

export const validateAppointmentForm = (
  formData: {
    trainer_name: string;
    school_name: string;
    start_time: string;
    end_time: string;
    date: Date;
  },
  existingAppointments: Appointment[],
  excludeId?: string
) => {
  // Validare câmpuri obligatorii
  if (!formData.trainer_name || !formData.school_name || !formData.start_time || !formData.end_time) {
    return {
      isValid: false,
      error: "Te rog completează toate câmpurile obligatorii."
    };
  }

  // Validare ordine ore
  if (formData.start_time >= formData.end_time) {
    return {
      isValid: false,
      error: "Ora de începere trebuie să fie înainte de ora de sfârșit."
    };
  }

  // Validare ore de lucru (nu mai verificăm restricțiile)
  const businessHoursValidation = validateBusinessHours(formData.start_time, formData.end_time);
  if (!businessHoursValidation.isValid) {
    return {
      isValid: false,
      error: businessHoursValidation.message
    };
  }

  const dateString = format(formData.date, 'yyyy-MM-dd');
  
  // Validare suprapunere ore DOAR pentru același trainer
  const validation = validateTimeOverlap(
    formData.trainer_name, 
    dateString, 
    formData.start_time, 
    formData.end_time,
    existingAppointments,
    excludeId
  );
  
  if (validation.hasConflict) {
    return {
      isValid: false,
      error: `${formData.trainer_name} are deja o programare între ${validation.conflictingAppointment?.start_time} - ${validation.conflictingAppointment?.end_time} la ${validation.conflictingAppointment?.school_name}.`
    };
  }

  return { isValid: true };
};
