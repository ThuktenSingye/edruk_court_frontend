import { Card } from "@/components/ui/card";

const messages = [
    { id: 1, text: "New update available", sender: "Admin" },
    { id: 2, text: "Your request has been approved", sender: "Support" },
    { id: 3, text: "Meeting scheduled for tomorrow", sender: "Manager" },
];

interface MessagesProps {
    caseId: string;
}

export function Messages({ caseId }: MessagesProps) {
    return (
        <Card className="p-4 shadow-md rounded-xl">
            <h3 className="text-green-700 text-lg font-bold mb-3">MESSAGES</h3>
            <div className="space-y-2">
                {messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm font-semibold">{msg.sender}</p>
                        <p className="text-sm text-gray-700">{msg.text}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
