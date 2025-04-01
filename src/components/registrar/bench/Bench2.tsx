"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scale, Users, Gavel, Briefcase, ShieldCheck, FileText } from "lucide-react";

type CaseStat = {
    label: string;
    icon: keyof typeof iconMap;
    count: number;
};

type Officials = {
    judge: string;
    clerks: string[];
};

const iconMap = { Scale, Users, Gavel, Briefcase, ShieldCheck, FileText };

export default function Bench() {
    const [caseStats, setCaseStats] = useState<CaseStat[]>([]);
    const [officials, setOfficials] = useState<Officials>({ judge: "", clerks: [] });

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("http://localhost:3002/bench2");
            const stats: CaseStat[] = await response.json();
            setCaseStats(stats);

            const officialsResponse = await fetch("http://localhost:3002/bench2officials");
            const officialsData: Officials = await officialsResponse.json();
            setOfficials(officialsData);
        }
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Bench II</h2>

            <Card className="w-[570px] h-[318px]">
                <CardContent className="flex flex-col md:flex-row mt-4">
                    {/* Case Statistics Section */}
                    <div className="flex-1 pr-4">
                        <h3 className="font-semibold mb-4">Case Statistic</h3>
                        <div className="space-y-3">
                            {caseStats.map((stat, index) => {
                                const Icon = iconMap[stat.icon];
                                return (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-green-600 text-lg">
                                                <Icon className="w-5 h-5" />
                                            </span>
                                            <span>{stat.label}</span>
                                        </div>
                                        <span>{stat.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:block w-[1px] bg-gray-300"></div>

                    {/* Officials Section */}
                    <div className="flex-1 pl-4">
                        <h3 className="font-semibold mb-4">Officials</h3>

                        {/* Dropdown List for Judge & Clerk */}
                        <Accordion type="single" collapsible className="w-full mt-1">
                            {/* Judge Section */}
                            <AccordionItem value="judge">
                                <AccordionTrigger className="font-medium">Judge</AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                    {officials.judge}
                                </AccordionContent>
                            </AccordionItem>

                            {/* Clerk Section */}
                            <AccordionItem value="clerk">
                                <AccordionTrigger className="font-medium">Clerk</AccordionTrigger>
                                <AccordionContent className="text-gray-600 space-y-1">
                                    {officials.clerks.map((name, index) => (
                                        <p key={index}>{name}</p>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
