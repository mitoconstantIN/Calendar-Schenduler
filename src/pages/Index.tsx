
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, CalendarIcon, Calendar as CalendarViewIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import { AddAppointmentDialog } from '@/components/AddAppointmentDialog';
import { AppointmentCard } from '@/components/AppointmentCard';
import { ViewToggle } from '@/components/ViewToggle';
import { DayDetailsDialog } from '@/components/DayDetailsDialog';
import { 
  useAppointments, 
  useCreateAppointment, 
  useUpdateAppointment, 
  useDeleteAppointment,
  type Appointment 
} from '@/hooks/useAppointments';
import { toast } from '@/hooks/use-toast';

export type ViewMode = 'day' | 'week' | 'month';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const { data: appointments = [], isLoading } = useAppointments();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date)
    );
  };

  const hasAppointmentsOnDate = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const handleAddAppointment = async (newAppointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createAppointment.mutateAsync(newAppointment);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga programarea. Te rog încearcă din nou.",
        variant: "destructive",
      });
    }
  };

  const handleEditAppointment = async (updatedAppointment: Appointment) => {
    try {
      await updateAppointment.mutateAsync(updatedAppointment);
      setSelectedAppointment(null);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu am putut modifica programarea. Te rog încearcă din nou.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment.mutateAsync(id);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu am putut șterge programarea. Te rog încearcă din nou.",
        variant: "destructive",
      });
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    if (hasAppointmentsOnDate(date)) {
      setIsDayDetailsOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă programările...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Programări Traineri
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gestionare programări pentru școli
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Adaugă Programare
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar Panel */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarViewIcon className="w-5 h-5" />
                Calendar - {format(selectedDate, 'MMMM yyyy', { locale: ro })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {viewMode === 'month' && (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && handleDayClick(date)}
                  className="rounded-md border shadow-sm w-full"
                  modifiers={{
                    hasAppointments: (date) => hasAppointmentsOnDate(date)
                  }}
                  modifiersStyles={{
                    hasAppointments: { 
                      backgroundColor: '#3b82f6', 
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn("h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1",
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                      "[&:has([aria-selected])]:bg-accent"
                    ),
                    day: cn(
                      "h-8 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                    ),
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              )}
              
              {(viewMode === 'day' || viewMode === 'week') && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: ro })}
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getAppointmentsForDate(selectedDate).map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onEdit={setSelectedAppointment}
                        onDelete={handleDeleteAppointment}
                        compact={false}
                      />
                    ))}
                    {getAppointmentsForDate(selectedDate).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nu există programări pentru această zi</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Programări Astăzi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {getAppointmentsForDate(new Date()).map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={setSelectedAppointment}
                    onDelete={handleDeleteAppointment}
                    compact={true}
                  />
                ))}
                {getAppointmentsForDate(new Date()).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nu există programări astăzi
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Statistici</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total programări</span>
                  <Badge variant="secondary">{appointments.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Astăzi</span>
                  <Badge variant="default">
                    {getAppointmentsForDate(new Date()).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddAppointmentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddAppointment}
        appointment={selectedAppointment}
        onEdit={handleEditAppointment}
        existingAppointments={appointments}
      />

      <DayDetailsDialog
        open={isDayDetailsOpen}
        onOpenChange={setIsDayDetailsOpen}
        date={selectedDate}
        appointments={getAppointmentsForDate(selectedDate)}
      />
    </div>
  );
};

export default Index;
