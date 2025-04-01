import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EventDetailsDialog({ open, onOpenChange, selectedEvent, onDelete, onReschedule }: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-[#046200]">Event Details</DialogTitle>
                </DialogHeader>
                {selectedEvent && (
                    <>
                        <p><strong className="text-[#046200]">Description:</strong> {selectedEvent.extendedProps.description}</p>
                        <p><strong className="text-[#046200]">Case ID:</strong> {selectedEvent.extendedProps.caseId}</p>
                        <p><strong className="text-[#046200]">Hearing Type:</strong> {selectedEvent.extendedProps.hearingType}</p>
                        <p><strong className="text-[#046200]">Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
                        <p><strong className="text-[#046200]">Time:</strong> {new Date(selectedEvent.start).toLocaleTimeString()}</p>
                    </>
                )}
                <DialogFooter>
                    <Button variant="destructive" onClick={onDelete}>Delete</Button>
                    <Button onClick={onReschedule} className="bg-[#046200]">Reschedule</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
