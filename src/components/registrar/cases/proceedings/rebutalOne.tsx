"use client";
import { Button } from "@/components/ui/button";
import { Notes } from "@/components/registrar/cases/notes";
import { Defendent } from "@/components/registrar/cases/DefendentDocument";
import { Plantiff } from "@/components/registrar/cases/PlantiffDocument";
import { Messages } from "@/components/registrar/cases/messages";
import { Schedule } from "@/components/registrar/cases/schedule";

interface Note {
    id: number;
    text: string;
    timestamp: string;
}

interface Schedule {
    id: number;
    text: string;
    timestamp: string;
}

export default function RebuttalSection() {

    return (
        <div className="p-3">
            <h2 className="text-green-700 font-semibold text-lg">REBUTTAL ONE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Defendent />
                <Plantiff />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Notes />
                <Messages />
                <div className="col-span-2">
                    <Schedule />
                </div>
            </div>
        </div>
    );
}
