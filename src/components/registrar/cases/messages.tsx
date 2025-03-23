import { Card } from "@/components/ui/card";
import { Documents } from "./documents";
export const Messages = () => {
    return (
        <Card className="p-4 border border-gray-300">
            <div className="flex justify-between items-center">
                <h3 className="text-primary-normal text-lg font-semibold">Messages</h3>
                <button className="text-primary-normal">View More</button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Description of the message ......</p>
            <Documents />
        </Card>
    );
};

