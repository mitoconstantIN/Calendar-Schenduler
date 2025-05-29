
export interface Appointment {
  id: string;
  trainerName: string;
  schoolName: string;
  date: string; // ISO format
  startTime: string;
  endTime: string;
  observations?: string;
}

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    trainerName: 'Ana Popescu',
    schoolName: 'Școala Gimnazială Nr. 1',
    date: '2024-05-29',
    startTime: '09:00',
    endTime: '11:00',
    observations: 'Pregătire pentru concurs național'
  },
  {
    id: '2',
    trainerName: 'Mihai Ionescu',
    schoolName: 'Liceul Teoretic "Mihai Eminescu"',
    date: '2024-05-29',
    startTime: '14:00',
    endTime: '16:00',
    observations: 'Sesiune de training pentru profesori'
  },
  {
    id: '3',
    trainerName: 'Elena Constantinescu',
    schoolName: 'Școala Primară "Ion Creangă"',
    date: '2024-05-30',
    startTime: '10:00',
    endTime: '12:00',
    observations: ''
  },
  {
    id: '4',
    trainerName: 'Alex Dumitrescu',
    schoolName: 'Colegiul Național "Tudor Vladimirescu"',
    date: '2024-05-31',
    startTime: '08:30',
    endTime: '10:30',
    observations: 'Workshop despre metodele moderne de predare'
  }
];
