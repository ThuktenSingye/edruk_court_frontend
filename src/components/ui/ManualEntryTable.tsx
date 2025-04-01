'use client';

import React, { useState, useEffect } from "react";

interface ManualEntryRow {
    month: string;
    benchClerk: string;
    openingBalance: number;
    newRegistration: number;
    decidedCases: number;
    pendingCases: number;
    appeal: number;
}

const ManualEntryTable = () => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const benchClerks = ['Sangay Dorji', 'Pema', 'Namgay', 'Ugyen'];

    // Default empty entry
    const defaultEntry: Omit<ManualEntryRow, 'month' | 'benchClerk'> = {
        openingBalance: 0,
        newRegistration: 0,
        decidedCases: 0,
        pendingCases: 0,
        appeal: 0
    };

    // State for filters and data
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedClerk, setSelectedClerk] = useState<string>('');
    const [data, setData] = useState<ManualEntryRow[]>(() => {
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem('manualEntryData');
            return savedData ? JSON.parse(savedData) : [];
        }
        return [];
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('manualEntryData', JSON.stringify(data));
    }, [data]);

    // Handle input changes
    const handleValueChange = (
        field: keyof Omit<ManualEntryRow, 'month' | 'benchClerk'>,
        value: string
    ) => {
        const numValue = Number(value) || 0;

        // Check if entry already exists
        const existingIndex = data.findIndex(
            item => item.month === selectedMonth && item.benchClerk === selectedClerk
        );

        if (existingIndex >= 0) {
            // Update existing entry
            setData(prev =>
                prev.map(item =>
                    item.month === selectedMonth && item.benchClerk === selectedClerk
                        ? { ...item, [field]: numValue }
                        : item
                )
            );
        } else {
            // Create new entry
            setData(prev => [
                ...prev,
                {
                    month: selectedMonth,
                    benchClerk: selectedClerk,
                    ...defaultEntry,
                    [field]: numValue
                }
            ]);
        }
    };

    // Get current entry - returns zeros if no entry exists
    const getCurrentEntry = () => {
        const existingEntry = data.find(d => d.month === selectedMonth && d.benchClerk === selectedClerk);
        return existingEntry || {
            month: selectedMonth,
            benchClerk: selectedClerk,
            ...defaultEntry
        };
    };

    // Calculate monthly totals across all clerks for selected month
    const calculateMonthlyTotals = () => {
        if (!selectedMonth) return defaultEntry;

        const monthData = data.filter(item => item.month === selectedMonth);
        return Object.keys(defaultEntry).reduce((acc, key) => {
            const field = key as keyof typeof defaultEntry;
            acc[field] = monthData.reduce((sum, item) => sum + item[field], 0);
            return acc;
        }, {} as typeof defaultEntry);
    };

    // Handle save action
    const handleSave = () => {
        console.log('Saving data:', data);
        alert(`Data saved successfully for ${selectedMonth} - ${selectedClerk}`);
    };

    // Check if both filters are selected
    const isFormReady = selectedMonth && selectedClerk;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-view {
            display: block !important;
          }
        }
        .print-view {
          display: none;
        }
      `}</style>

            <h1 className="text-2xl font-bold mb-6 text-gray-800">Case Report Manual Entry</h1>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 no-print">
                <div>
                    <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Month *
                    </label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-normal"
                        required
                    >
                        <option value="">Select a month</option>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="clerk-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Clerk *
                    </label>
                    <select
                        id="clerk-select"
                        value={selectedClerk}
                        onChange={(e) => setSelectedClerk(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-normal"
                        required
                    >
                        <option value="">Select a clerk</option>
                        {benchClerks.map(clerk => (
                            <option key={clerk} value={clerk}>{clerk}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Entry Section - Only shown when both filters are selected */}
            {isFormReady && (
                <>
                    <div className="border rounded-lg shadow-sm bg-white overflow-hidden mb-6">
                        <div className="bg-primary-normal p-4">
                            <h2 className="text-lg font-semibold text-white">
                                {selectedMonth} - {selectedClerk}
                            </h2>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(defaultEntry).map(([field, _]) => {
                                    const entry = getCurrentEntry();
                                    const label = field.split(/(?=[A-Z])/).join(' ');
                                    return (
                                        <div key={field} className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {label}
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={entry[field as keyof typeof defaultEntry] || 0}
                                                    onChange={(e) =>
                                                        handleValueChange(
                                                            field as keyof typeof defaultEntry,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-normal focus:border-primary-normal no-print"
                                                />
                                                {/* Display value for print view */}
                                                <div className="print-view bg-gray-100 p-2 rounded-md w-full">
                                                    {entry[field as keyof typeof defaultEntry] || 0}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Totals Section */}
                    <div className="border rounded-lg shadow-sm bg-white overflow-hidden mb-6">
                        <div className="bg-gray-100 p-4 border-b">
                            <h3 className="font-medium text-gray-800">Monthly Totals for {selectedMonth} (All Clerks)</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Object.entries(calculateMonthlyTotals()).map(([field, value]) => (
                                <div key={field} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">
                                        {field.split(/(?=[A-Z])/).join(' ')}
                                    </div>
                                    <div className="text-xl font-bold text-gray-800 mt-1">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button - hidden when printing */}
                    <div className="flex justify-end no-print mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-primary-normal hover:bg-primary-dark text-white font-medium rounded-md shadow-sm transition-colors"
                        >
                            Save Entry
                        </button>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!isFormReady && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 no-print">
                    <p className="text-gray-500">Please select both month and clerk to begin data entry</p>
                </div>
            )}
        </div>
    );
};

export default ManualEntryTable;