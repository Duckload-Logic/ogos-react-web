export interface EducationLevel {
  school: string;
  location: string;
  public: string;
  yearGrad: string;
  awards: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormData {
  reasonForEnrollment: { [key: string]: boolean };
  reasonOther: string;
  expecting_scholarship: boolean;
  scholarship_details: string;
  lastName: string;
  firstName: string;
  middleName: string;
  civilStatus: string;
  religion: string;
  highSchoolAverage: string;
  course: string;
  email: string;
  dateOfBirth: string;
  placeOfBirth: string;
  mobileNo: string;
  height: string;
  weight: string;
  gender: string;
  provincialAddressProvince: string;
  provincialAddressMunicipality: string;
  provincialAddressBarangay: string;
  residentialAddressProvince: string;
  residentialAddressMunicipality: string;
  residentialAddressBarangay: string;
  employerName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  education: {
    elementary: EducationLevel;
    juniorHS: EducationLevel;
    seniorHS: EducationLevel;
    others: string;
  };
  fatherName: string;
  fatherAge: string;
  fatherEducation: string;
  fatherOccupation: string;
  fatherCompany: string;
  motherName: string;
  motherAge: string;
  motherEducation: string;
  motherOccupation: string;
  motherCompany: string;
  parentalStatus: string;
  parentalDetails: string;
  guardianName: string;
  guardianAddress: string;
  parentsIncome: string;
  siblings: string;
  brothers: string;
  sisters: string;
  gainfullyEmployed: string;
  supportStudies: string;
  supportFamily: string;
  financialSupport: string;
  weeklyAllowance: string;
  vision: string;
  hearing: string;
  mobility: string;
  speech: string;
  generalHealth: string;
  consultedWith: string;
  consultReason: string;
  whenStarted: string;
  numSessions: string;
  dateConcluded: string;
  dateTest: string;
  testAdministered: string;
  rs: string;
  pr: string;
  description: string;
  significantNotesDate: string;
  incident: string;
  remarks: string;
}
