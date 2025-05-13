/** @format */

const EventList = ({ events, formatDate, formatTime, onReschedule }: any) => {
  return (
    <div className="space-y-4">
      {events.map((event: any) => (
        <div
          key={event.id}
          className="bg-white border border-[#046200] rounded-lg shadow-md p-4 flex flex-col justify-between relative transition-transform duration-200 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-[#12B76A]">
          <div>
            <div className="text-[#0E1632] font-semibold text-sm mb-1">
              {event.extendedProps?.description || event.title}
            </div>
            <div className="text-[#0E1632] text-sm">
              {formatDate(new Date(event.start))}
            </div>
            <div className="text-[#0E1632] text-sm">
              {formatTime(new Date(event.start))}
            </div>
          </div>

          {/* ✅ Bottom-right reschedule button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => onReschedule?.(event)}
              className="text-[#046200] text-xs px-3 py-1 border border-[#046200] rounded hover:bg-[#046200] hover:text-white transition">
              Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
