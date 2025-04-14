'use client';
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CaseReport, useFetchCaseReports } from "@/app/hooks/usefetchCaseReports";
import { Edit, Save, Menu, ChevronDown } from "lucide-react";
import ManualEntryTable from "@/components/ui/ManualEntryTable";
import CombinedDataTable from "@/components/ui/CombinedTotals";

const CaseReportComponent = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isYearlyReport, setIsYearlyReport] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<CaseReport[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);
  const [manualEntries, setManualEntries] = useState<CaseReport[]>([]);
  const [showDownloadOptions, setShowDownloadOptions] = useState<boolean>(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const manualEntryRef = useRef<HTMLDivElement>(null);
  const combinedTableRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useFetchCaseReports();

  // Constants
  const years = Array.from({ length: 11 }, (_, i) => i + 2015);
  const benchClerks = ['Sangay Dorji', 'Pema', 'Namgay', 'Ugyen'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Data processing
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      (row.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.year.toString().includes(searchTerm)) &&
      (selectedYear === row.year || !selectedYear) &&
      (selectedMonth === row.month || !selectedMonth)
    );
  }, [data, searchTerm, selectedYear, selectedMonth]);

  const processedData = useMemo(() => {
    const groupedByMonth = new Map<string, {
      month: string;
      openingBalance: number;
      newRegistration: number;
      totalRegistered: number;
      decidedCases: number;
      pendingCases: number;
      appeal: number;
      remarks: number;
    }>();

    filteredData.forEach((row) => {
      if (!groupedByMonth.has(row.month)) {
        groupedByMonth.set(row.month, {
          month: row.month,
          openingBalance: 0,
          newRegistration: 0,
          totalRegistered: 0,
          decidedCases: Math.floor(row.decidedCases),
          pendingCases: row.pendingCases,
          appeal: row.appeal,
          remarks: row.remarks,
        });
      }

      const monthData = groupedByMonth.get(row.month)!;
      monthData.openingBalance += row.openingBalance;
      monthData.newRegistration += row.newRegistration;
      monthData.totalRegistered += row.totalRegistered;
      monthData.decidedCases += Math.floor(row.decidedCases);
      monthData.pendingCases += row.pendingCases;
      monthData.appeal += row.appeal;
      monthData.remarks += row.remarks;
    });

    return Array.from(groupedByMonth.entries()).flatMap(([month, data]) => {
      const appealsDistribution = distributeRandomly(data.appeal, benchClerks.length);
      return benchClerks.map((benchClerk, index) => ({
        month,
        benchClerk,
        openingBalance: data.openingBalance / benchClerks.length,
        newRegistration: data.newRegistration / benchClerks.length,
        totalRegistered: data.totalRegistered / benchClerks.length,
        decidedCases: Math.floor(data.decidedCases / benchClerks.length),
        pendingCases: data.pendingCases / benchClerks.length,
        appeal: appealsDistribution[index],
        remarks: data.remarks / benchClerks.length,
        year: filteredData.find((row) => row.month === month)?.year || selectedYear,
        isManual: false,
      }));
    });
  }, [benchClerks, filteredData, selectedYear]);

  // Calculate yearly totals
  const yearlyTotals = useMemo(() => {
    const allData = [...editableData, ...manualEntries];
    return allData.reduce((acc, row) => {
      return {
        openingBalance: acc.openingBalance + row.openingBalance,
        newRegistration: acc.newRegistration + row.newRegistration,
        totalRegistered: acc.totalRegistered + row.totalRegistered,
        decidedCases: acc.decidedCases + row.decidedCases,
        pendingCases: acc.pendingCases + row.pendingCases,
        appeal: acc.appeal + row.appeal,
        remarks: acc.remarks + (row.remarks || 0),
      };
    }, {
      openingBalance: 0,
      newRegistration: 0,
      totalRegistered: 0,
      decidedCases: 0,
      pendingCases: 0,
      appeal: 0,
      remarks: 0,
    });
  }, [editableData, manualEntries]);

  useEffect(() => {
    if (editableData.length === 0 && processedData.length > 0) {
      setEditableData([...processedData]);
    }
  }, [editableData.length, processedData]);

  // PDF Generation
  const handleDownloadPDF = async (type: 'system' | 'manual' | 'combined') => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const margin = 20;
    let yPosition = margin;

    const addTableToPDF = async (element: HTMLElement | null, title: string) => {
      if (!element) return;

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.text(title, margin, yPosition);
      yPosition += 20;

      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 20;
    };

    switch (type) {
      case 'system':
        await addTableToPDF(tableRef.current, "System Data Report");
        break;
      case 'manual':
        if (showManualEntry && manualEntryRef.current) {
          await addTableToPDF(manualEntryRef.current, "Manual Entries Report");
        }
        break;
      case 'combined':
        await addTableToPDF(combinedTableRef.current, "Combined Report");
        break;
    }

    pdf.save(`${type.replace(/^\w/, c => c.toUpperCase())}_Report.pdf`);
    setShowDownloadOptions(false);
  };

  // Other handlers
  const toggleReport = (reportType: "month" | "year") => {
    setIsYearlyReport(reportType === "year");
    setSelectedMonth('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMobileMenuOpen(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved data:", editableData);
    setMobileMenuOpen(false);
  };

  const handleManualSave = (newManualData: CaseReport[]) => {
    const dataWithManualFlag = newManualData.map(item => ({ ...item, isManual: true }));
    setManualEntries(prev => [...prev, ...dataWithManualFlag]);
    setShowManualEntry(false);
  };

  const handleValueChange = (
    month: string,
    benchClerk: string,
    field: keyof CaseReport,
    value: number
  ) => {
    setEditableData(prevData =>
      prevData.map(row =>
        row.month === month && row.benchClerk === benchClerk
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  // Mobile Menu
  const MobileMenu = () => (
    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 absolute right-4 top-16 rounded-md shadow-lg w-64">
        <div className="space-y-4">
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className={`w-full p-2 rounded-md flex items-center justify-center ${
              isEditing ? 'bg-green-600' : 'bg-primary-normal'
            } text-white`}
          >
            {isEditing ? <><Save className="mr-2 h-4 w-4" /> Save</> : <><Edit className="mr-2 h-4 w-4" /> Edit</>}
          </button>
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full p-2 rounded-md bg-primary-normal text-white"
          >
            {showManualEntry ? 'Hide Manual' : 'Add Manual Data'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Case Report</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-primary-normal text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileMenuOpen && <MobileMenu />}

      {/* Desktop Title */}
      <h1 className="text-xl font-semibold mb-4 hidden md:block">Case Report</h1>

      {/* Search and Filters */}
      <div className="hidden md:flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by month or year"
          className="p-2 border rounded-md w-full md:w-auto flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={!isYearlyReport}
              onChange={() => toggleReport("month")}
            />
            <span>Month</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={isYearlyReport}
              onChange={() => toggleReport("year")}
            />
            <span>Year</span>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="p-2 border rounded-md"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {!isYearlyReport && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Loading and Error */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* System Data Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">System Data</h2>
        <div ref={tableRef} className="overflow-x-auto">
          <Table className="bg-white shadow-md text-center min-w-full">
            <TableHeader className="text-white">
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Bench Clerk</TableCell>
                <TableCell>Opening Balance</TableCell>
                <TableCell>New Registration</TableCell>
                <TableCell>Total Registered</TableCell>
                <TableCell>Decided Cases</TableCell>
                <TableCell>Pending Cases</TableCell>
                <TableCell>Appeal</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(new Set(editableData.map(row => row.month))).map(month => (
                <React.Fragment key={month}>
                  {editableData.filter(row => row.month === month).map((row, index) => (
                    <TableRow key={`${month}-${index}`}>
                      {index === 0 && (
                        <TableCell rowSpan={benchClerks.length} className="text-center">{month}</TableCell>
                      )}
                      <TableCell className="text-center">{row.benchClerk}</TableCell>
                      {isEditing ? (
                        <>
                          <TableCell className="text-center">
                            <input
                              type="number"
                              value={row.openingBalance}
                              onChange={(e) => handleValueChange(row.month, row.benchClerk, 'openingBalance', Number(e.target.value))}
                              className="w-20 p-1 border rounded"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <input
                              type="number"
                              value={row.newRegistration}
                              onChange={(e) => handleValueChange(row.month, row.benchClerk, 'newRegistration', Number(e.target.value))}
                              className="w-20 p-1 border rounded"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <input
                              type="number"
                              value={row.totalRegistered}
                              onChange={(e) => handleValueChange(row.month, row.benchClerk, 'totalRegistered', Number(e.target.value))}
                              className="w-20 p-1 border rounded"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <input
                              type="number"
                              value={row.decidedCases}
                              onChange={(e) => handleValueChange(row.month, row.benchClerk, 'decidedCases', Number(e.target.value))}
                              className="w-20 p-1 border rounded"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <input
                              type="number"
                              value={row.pendingCases}
                              onChange={(e) => handleValueChange(row.month, row.benchClerk, 'pendingCases', Number(e.target.value))}
                              className="w-20 p-1 border rounded"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <input
                              type="number"
                              value={row.appeal}
                              onChange={(e) => handleValueChange(row.month, row.benchClerk, 'appeal', Number(e.target.value))}
                              className="w-20 p-1 border rounded"
                            />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-center">{row.openingBalance}</TableCell>
                          <TableCell className="text-center">{row.newRegistration}</TableCell>
                          <TableCell className="text-center">{row.totalRegistered}</TableCell>
                          <TableCell className="text-center">{row.decidedCases}</TableCell>
                          <TableCell className="text-center">{row.pendingCases}</TableCell>
                          <TableCell className="text-center">{row.appeal}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-semibold">
                    <TableCell colSpan={2} className="text-center">Total for {month}</TableCell>
                    <TableCell className="text-center">
                      {editableData.filter(row => row.month === month).reduce((sum, row) => sum + row.openingBalance, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {editableData.filter(row => row.month === month).reduce((sum, row) => sum + row.newRegistration, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {editableData.filter(row => row.month === month).reduce((sum, row) => sum + row.totalRegistered, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {editableData.filter(row => row.month === month).reduce((sum, row) => sum + row.decidedCases, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {editableData.filter(row => row.month === month).reduce((sum, row) => sum + row.pendingCases, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {editableData.filter(row => row.month === month).reduce((sum, row) => sum + row.appeal, 0)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
              <TableRow className="bg-blue-50 font-bold border-t-4 border-blue-500">
                <TableCell colSpan={2} className="text-center">Yearly Total ({selectedYear})</TableCell>
                <TableCell className="text-center">{yearlyTotals.openingBalance}</TableCell>
                <TableCell className="text-center">{yearlyTotals.newRegistration}</TableCell>
                <TableCell className="text-center">{yearlyTotals.totalRegistered}</TableCell>
                <TableCell className="text-center">{yearlyTotals.decidedCases}</TableCell>
                <TableCell className="text-center">{yearlyTotals.pendingCases}</TableCell>
                <TableCell className="text-center">{yearlyTotals.appeal}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Manual Entry Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Manual Entries</h2>
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="bg-primary-normal text-white px-3 py-1 rounded-md text-sm"
          >
            {showManualEntry ? 'Hide' : 'Add Manual Data'}
          </button>
        </div>
        {showManualEntry && (
          <div ref={manualEntryRef}>
            <ManualEntryTable onSave={handleManualSave} />
          </div>
        )}
      </div>

      {/* Combined Data Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Combined Totals</h2>
        <div ref={combinedTableRef}>
          <CombinedDataTable 
            systemData={editableData.filter(item => !item.isManual)} 
            manualData={[...editableData.filter(item => item.isManual), ...manualEntries]}
          />
        </div>
      </div>

      {/* Download Button with Dropdown */}
      <div className="flex justify-center mt-6 relative">
        <div className="relative inline-block">
          <button 
            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
            className="bg-primary-normal text-white p-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors flex items-center"
          >
            Download Reports
            <ChevronDown className="ml-2 h-5 w-5" />
          </button>
          
          {showDownloadOptions && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleDownloadPDF('system')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download System Data
                </button>
                <button
                  onClick={() => handleDownloadPDF('manual')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download Manual Entries
                </button>
                <button
                  onClick={() => handleDownloadPDF('combined')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download Combined Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function distributeRandomly(total: number, numClerks: number): number[] {
  const result = Array(numClerks).fill(0);
  let remaining = total;

  for (let i = 0; i < numClerks - 1; i++) {
    const allocation = Math.floor(Math.random() * remaining);
    result[i] = allocation;
    remaining -= allocation;
  }

  result[numClerks - 1] = remaining;
  return result;
}

export default CaseReportComponent;