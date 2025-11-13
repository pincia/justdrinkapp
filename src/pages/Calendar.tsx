import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";

import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";

import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../services/calendarEventsApi";

import {
  CalendarEventUpsertDto,
  CalendarEventCategory,
} from "../types/Calendar";

// fullcalendar event
interface CalendarEventFC {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  extendedProps: {
    calendar: CalendarEventCategory;
    eventType: string;
  };
}

// 🔧 mappa tipo evento → categoria (colore)
const EVENT_TYPE_CONFIG: Record<
  string,
  { label: string; category: CalendarEventCategory }
> = {
  Appuntamento: { label: "Appuntamento", category: "Primary" },
  Evento: { label: "Evento", category: "Success" },
  Promemoria: { label: "Promemoria", category: "Warning" },
  Blocco: { label: "Blocco calendario", category: "Danger" },
};

const DEFAULT_EVENT_TYPE = "Appuntamento";

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventFC | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventType, setEventType] = useState<string>(DEFAULT_EVENT_TYPE);

  const [events, setEvents] = useState<CalendarEventFC[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // ====================== LOAD EVENTS ======================
  const loadEvents = async () => {
    const data = await getCalendarEvents();

 const mapped: CalendarEventFC[] = data.map(ev => ({
  id: String(ev.id),
  title: ev.title,
  start: ev.start,
  end: ev.end ?? undefined,
  allDay: true,
  extendedProps: {
    calendar: ev.category,
    eventType: ev.eventType,
    eventId: ev.eventId,
    isSystemGenerated: ev.isSystemGenerated,
  },
}));


    setEvents(mapped);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ====================== SELECT RANGE ======================
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModal();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  // ====================== CLICK EVENT ======================
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr ?? event.startStr,
      allDay: event.allDay,
      extendedProps: {
        calendar: (event.extendedProps.calendar ??
          "Primary") as CalendarEventCategory,
        eventType:
          (event.extendedProps.eventType as string) ?? DEFAULT_EVENT_TYPE,
      },
    });

    setEventTitle(event.title);
    setEventStartDate(event.startStr);
    setEventEndDate(event.endStr ?? event.startStr);
    setEventType(
      (event.extendedProps.eventType as string) ?? DEFAULT_EVENT_TYPE
    );

    openModal();
  };

  // ====================== SAVE (CREATE/UPDATE) ======================
  const handleSave = async () => {
    const config = EVENT_TYPE_CONFIG[eventType] ?? EVENT_TYPE_CONFIG[DEFAULT_EVENT_TYPE];
    const category: CalendarEventCategory = config.category;

    const dto: CalendarEventUpsertDto = {
      title: eventTitle,
      start: eventStartDate,
      end: eventEndDate || undefined,
      category,
      eventType,
    };

    if (selectedEvent) {
      await updateCalendarEvent(Number(selectedEvent.id), dto);
    } else {
      await createCalendarEvent(dto);
    }

    closeModal();
    resetModal();
    await loadEvents();
  };

  // ====================== DELETE ======================
  const handleDelete = async () => {
    if (!selectedEvent) return;

    await deleteCalendarEvent(Number(selectedEvent.id));
    closeModal();
    resetModal();
    await loadEvents();
  };

  // ====================== RESET MODAL ======================
  const resetModal = () => {
    setSelectedEvent(null);
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventType(DEFAULT_EVENT_TYPE);
  };

  return (
    <>
      <PageMeta title="Calendario Eventi" description="Gestione eventi" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
          initialView="multiMonthYear"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          events={events}
          customButtons={{
            addEventButton: {
              text: "Nuovo Evento +",
              click: openModal,
            },
          }}
          eventContent={renderEventContent}
        />
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2">
          <h5 className="mb-4 font-semibold text-xl dark:text-white">
            {selectedEvent ? "Modifica Evento" : "Nuovo Evento"}
          </h5>

          {/* Titolo */}
          <label className="mt-2 text-sm font-medium">Titolo</label>
          <input
            className="h-11 w-full rounded-lg border px-4 dark:bg-gray-900"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />

          {/* Tipo evento */}
          <label className="mt-4 text-sm font-medium">Tipo evento</label>
          <select
            className="h-11 w-full rounded-lg border px-4 dark:bg-gray-900"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            {Object.entries(EVENT_TYPE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>

          {/* Data inizio */}
          <label className="mt-4 text-sm font-medium">Data inizio</label>
          <input
            type="date"
            className="h-11 w-full rounded-lg border px-4 dark:bg-gray-900"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
          />

          {/* Data fine */}
          <label className="mt-4 text-sm font-medium">Data fine</label>
          <input
            type="date"
            className="h-11 w-full rounded-lg border px-4 dark:bg-gray-900"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-6">
            {selectedEvent && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Elimina
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg"
            >
              Salva
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
   const isLocked = eventInfo.event.extendedProps.isSystemGenerated;
  const category: string =
    (eventInfo.event.extendedProps.calendar as string) ?? "Primary";

  // Mappa categorie → colori
  const colors: Record<string, string> = {
    Danger: "#dc2626",
    Success: "#16a34a",
    Primary: "#3b82f6",
    Warning: "#f59e0b",
  };

  const bg = colors[category] ?? "#3b82f6";

  return (
    <div
      style={{
        backgroundColor: bg,
        color: "white",
        padding: "2px 4px",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={eventInfo.event.title}
    >
      {isLocked && "🔒 "}
      {eventInfo.event.title}
    </div>
  );
};


export default Calendar;
