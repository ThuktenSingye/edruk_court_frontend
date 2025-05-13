/** @format */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/common/calendar/date-time-picker";

export default function EventDialog({
  open,
  onOpenChange,
  isRescheduling,
  caseId,
  setCaseId,
  hearingType,
  setHearingType,
  eventDescription,
  setEventDescription,
  eventStart,
  setEventStart,
  onSubmit,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      {" "}
      {/* ✅ Important */}
      <DialogContent className="z-[9998]">
        {" "}
        {/* ✅ Make sure it's not blocking picker */}
        <DialogHeader>
          <DialogTitle className="text-[#046200]">
            {isRescheduling ? "Reschedule Event" : "Add Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Case ID"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            required
          />
          <select
            className="w-full border p-2 rounded"
            value={hearingType}
            onChange={(e) => setHearingType(e.target.value)}>
            <option value="Miscellaneous Hearing">Miscellaneous Hearing</option>
            <option value="Preliminary Hearing">Preliminary Hearing</option>
          </select>
          <Input
            placeholder="Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Event Time</label>
            <DateTimePicker date={eventStart} onDateChange={setEventStart} />
          </div>
          <Button type="submit" className="bg-primary-normal text-white">
            {isRescheduling ? "Update Event" : "Add Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
