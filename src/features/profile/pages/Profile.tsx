import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context";
import { useStudentForm } from "@/features/pds/hooks/useStudentForm";
import { studentService } from "@/features/pds/services/service";

const convertDateToReadable = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Profile() {
  const { user } = useAuth();
  const [additionalInfo, setAdditionalInfo] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchProfile = async () => {
      const data = await studentService.getStudentProfile(user.id);
      setAdditionalInfo(data);
    };

    fetchProfile();
  }, [user]);

  

  const residential = additionalInfo?.addresses?.find((addr: any) => addr.addressType === 'Residential');
  const fullAddress = residential 
    ? `${residential.streetLotBlk}, ${residential.barangayName}, ${residential.cityName}, ${residential.regionName}`
    : '-';

  const profileData = {
    firstName: user?.firstName,
    middleInitial: user?.middleName ? user.middleName.charAt(0) + '.' : '',
    surname: user?.lastName,
    email: user?.email,
    phone: additionalInfo?.studentProfile?.contactNo || '-',
    address: fullAddress,
    dateOfBirth: additionalInfo?.studentProfile?.birthDate ? convertDateToReadable(additionalInfo.studentProfile.birthDate) : '-',
    placeOfBirth: additionalInfo?.studentProfile?.placeOfBirth || '-',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            Manage your account information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">


        {/* Personal Data Section */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold text-gray-900">
              Personal Data
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Student Header */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-bold text-primary">
                {profileData.surname}, {profileData.firstName} {profileData.middleInitial}
              </h3>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-900 font-medium">{profileData.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Place of Birth</label>
                  <p className="text-gray-900 font-medium">{profileData.placeOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile No.</label>
                  <p className="text-gray-900 font-medium">{profileData.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  <p className="text-gray-900 font-medium">{profileData.email}</p>
                </div>
              </div>

              {/* Right Column - Address & Other Info */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Residential Address
                    <span className="text-xs text-gray-500 block">(Where you stay while you are studying in PUP)</span>
                  </label>
                  <textarea
                    value={profileData.address}
                    readOnly
                    disabled
                    className="w-full h-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-900 text-sm resize-vertical min-h-20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Certification */}
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-700 italic">
                I hereby certify that all the information provided are true and correct to the best of my knowledge.
              </p>
            </div>
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
