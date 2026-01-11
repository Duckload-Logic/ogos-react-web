import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  Download,
  FileText,
  Check,
  Clock,
} from "lucide-react";

interface ExcuseSlip {
  id: string;
  date: string;
  reason: string;
  fileName: string;
  status: "pending" | "approved" | "rejected";
  submissionDate: string;
}

const MOCK_EXCUSE_SLIPS: ExcuseSlip[] = [
  {
    id: "1",
    date: "2025-09-23",
    reason: "Medical appointment",
    fileName: "excuse_slip_2025-09-23.pdf",
    status: "approved",
    submissionDate: "2025-09-24",
  },
];

export default function ExcuseSlip() {
  const [uploadDate, setUploadDate] = useState("");
  const [uploadReason, setUploadReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excuseSlips, setExcuseSlips] =
    useState<ExcuseSlip[]>(MOCK_EXCUSE_SLIPS);
  const [isUploading, setIsUploading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleUploadExcuseSlip = async () => {
    if (!uploadDate || !uploadReason || !uploadedFile) {
      alert("Please fill in all fields and select a PDF file");
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newSlip: ExcuseSlip = {
        id: String(excuseSlips.length + 1),
        date: uploadDate,
        reason: uploadReason,
        fileName: uploadedFile.name,
        status: "pending",
        submissionDate: new Date().toISOString().split("T")[0],
      };

      setExcuseSlips([newSlip, ...excuseSlips]);
      setUploadDate("");
      setUploadReason("");
      setUploadedFile(null);
      setIsUploading(false);
      alert("Excuse slip uploaded successfully!");
    }, 1000);
  };

  const handleDownloadTemplate = () => {
    alert("Template download initiated. Check your downloads folder.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1">
            <Check className="w-4 h-4" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-1">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideUpSmooth {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .template-card {
          animation: slideUpSmooth 0.4s ease-out 0.08s both;
        }
        .upload-card {
          animation: slideUpSmooth 0.4s ease-out 0.12s both;
        }
        .slips-list {
          animation: slideUpSmooth 0.4s ease-out 0.16s both;
        }
      `}</style>
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Excuse Slip Management
          </h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            Upload and manage your excuse slips
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Template Download and Excuse Slips List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Download Section */}
            <Card className="border-0 shadow-sm bg-primary-foreground template-card">
              <CardHeader className="bg-primary border-b py-4">
                <CardTitle className="text-lg text-primary-foreground flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Excuse Slip Template
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-6 px-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Download our template to fill out your excuse slip before uploading.
                </p>
                <Button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 bg-primary hover:bg-secondary text-primary-foreground hover:text-gray-900 font-semibold py-2 h-auto transition-all duration-300 w-full justify-center"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* Excuse Slips List */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm slips-list">
              <h2 className="text-xl font-bold text-primary mb-4">Excuse Slips List</h2>
            {excuseSlips.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-8 pb-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm">No excuse slips submitted yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {excuseSlips.map((slip) => (
                  <Card
                    key={slip.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="bg-blue-50 border-b pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          {slip.reason}
                        </CardTitle>
                        {getStatusBadge(slip.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Date</p>
                          <p className="text-base font-semibold text-gray-900">
                            {slip.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Submitted</p>
                          <p className="text-base font-semibold text-gray-900">
                            {slip.submissionDate}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-600">Slip ID</p>
                        <p className="text-base text-gray-900">#{slip.id}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-600">File</p>
                        <p className="text-base text-gray-900">{slip.fileName}</p>
                      </div>

                      {slip.status !== "pending" && (
                        <div className="pt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Status:{" "}
                            <span className="font-semibold text-gray-900">
                              {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Right Column: Upload Form and Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Form Card */}
            <Card className="border-0 shadow-sm upload-card">
              <CardHeader className="bg-gray-50 border-b py-6 px-6">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Excuse Slip
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-6 px-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">
                        Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={uploadDate}
                        onChange={(e) => setUploadDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      Reason <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={uploadReason}
                      onChange={(e) => setUploadReason(e.target.value)}
                      placeholder="Explain the reason for your absence..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      Upload PDF <span className="text-red-600">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="font-semibold text-gray-700">
                          {uploadedFile
                            ? uploadedFile.name
                            : "Click to select PDF or drag and drop"}
                        </p>
                        <p className="text-sm text-gray-500">PDF files only</p>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleUploadExcuseSlip}
                    disabled={isUploading}
                    className="w-full bg-primary hover:bg-secondary text-primary-foreground hover:text-gray-900 font-semibold py-3 text-base transition-all duration-300"
                  >
                    {isUploading ? "Uploading..." : "Upload Excuse Slip"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Section */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle className="text-lg text-blue-900">
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Please submit your excuse slip within 3 days of your absence
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>The PDF file must be signed and scanned clearly</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>File size must not exceed 10 MB</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Processing time is usually 1-3 business days</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  You will receive a notification once your request is approved
                  or rejected
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}