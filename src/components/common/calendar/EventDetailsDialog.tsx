import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EventDetailsDialog({ open, onOpenChange, selectedEvent, onReschedule }: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-[#046200]">Event Details</DialogTitle>
                </DialogHeader>
                {selectedEvent && (
                    <>
                        <p><strong className="text-[#046200]">Case Number:</strong> {selectedEvent.extendedProps.caseNumber}</p>
                        <p><strong className="text-[#046200]">Case Title:</strong> {selectedEvent.title}</p>
                        <p><strong className="text-[#046200]">Hearing Type:</strong> {selectedEvent.extendedProps.hearingType}</p>
                        <p><strong className="text-[#046200]">Scheduled By:</strong> {selectedEvent.extendedProps.scheduledBy}</p>
                        <p><strong className="text-[#046200]">Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
                        <p><strong className="text-[#046200]">Time:</strong> {new Date(selectedEvent.start).toLocaleTimeString()}</p>
                        <p><strong className="text-[#046200]">Status:</strong> {selectedEvent.extendedProps.status}</p>
                    </>
                )}
                <DialogFooter>
                    <Button onClick={onReschedule} className="bg-[#046200]">Reschedule</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}