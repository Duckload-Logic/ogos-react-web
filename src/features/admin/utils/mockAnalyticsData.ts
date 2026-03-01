// Mock data for testing Analytics page

export interface StudentAnalytics {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  civilStatus?: string;
  religion?: string;
  studentNumber?: string;
  addresses?: any[];
  personalInfo?: {
    highSchoolGWA?: number;
  };
  education?: {
    schools?: any[];
  };
  family?: {
    fatherEducation?: string;
    motherEducation?: string;
    parentMaritalStatus?: string;
    monthlyFamilyIncome?: string;
    relatedPersons?: any[];
  };
}

const FIRST_NAMES = [
  "Juan", "Maria", "Jose", "Carmen", "Miguel", "Ana", "Carlos", "Rosa",
  "Pedro", "Sofia", "Luis", "Elena", "Diego", "Isabella", "Antonio", "Victoria",
];

const LAST_NAMES = [
  "Santos", "Garcia", "Reyes", "Flores", "Lopez", "Martinez", "Cruz", "Morales",
  "Gutierrez", "Valdez", "Navarro", "Castro", "Ruiz", "Ortiz", "Romero", "Herrera",
];

const CIVIL_STATUSES = ["Single", "Married", "Widowed", "Divorced", "In a relationship"];
const RELIGIONS = [
  "Catholic",
  "Protestant",
  "Islam",
  "Buddhism",
  "Hinduism",
  "Judaism",
  "Agnostic",
  "Atheist",
  "Others",
];

const CITIES = [
  "Manila",
  "Quezon City",
  "Caloocan",
  "Las Piñas",
  "Makati",
  "Pasay",
  "Parañaque",
  "Taguig",
  "Valenzuela",
  "Malabon",
  "Navotas",
  "Muntinlupa",
  "Cavite",
  "Laguna",
  "Bulacan",
];

const EDUCATION_LEVELS = [
  "No formal education",
  "Elementary education",
  "Incomplete high school",
  "High school graduate",
  "Vocational training",
  "Some college",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate degree",
];

const INCOME_BRACKETS = [
  "Under ₱10,000",
  "₱10,000 - ₱25,000",
  "₱25,001 - ₱50,000",
  "₱50,001 - ₱100,000",
  "₱100,001 - ₱150,000",
  "₱150,001 - ₱250,000",
  "Over ₱250,000",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomAge(): number {
  return Math.floor(Math.random() * (65 - 15 + 1)) + 15;
}

function generateBirthDate(age: number): string {
  const today = new Date();
  const birth = new Date(
    today.getFullYear() - age,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
  return birth.toISOString().split("T")[0];
}

function generateMockStudent(id: number): StudentAnalytics {
  const age = getRandomAge();
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName = getRandomElement(LAST_NAMES);

  return {
    id,
    firstName,
    lastName,
    dateOfBirth: generateBirthDate(age),
    civilStatus: getRandomElement(CIVIL_STATUSES),
    religion: getRandomElement(RELIGIONS),
    studentNumber: `STU${String(id).padStart(6, "0")}`,
    addresses: [
      {
        municipality: getRandomElement(CITIES),
        city: getRandomElement(CITIES),
        addressLine: `${Math.floor(Math.random() * 9999) + 1} Main Street`,
      },
    ],
    personalInfo: {
      highSchoolGWA: Math.random() * 4.0,
    },
    education: {
      schools: [
        {
          name: "Sample High School",
          yearGraduated: 2020,
        },
      ],
    },
    family: {
      fatherEducation: getRandomElement(EDUCATION_LEVELS),
      motherEducation: getRandomElement(EDUCATION_LEVELS),
      parentMaritalStatus: getRandomElement([
        "Married",
        "Separated",
        "Divorced",
        "Widowed",
      ]),
      monthlyFamilyIncome: getRandomElement(INCOME_BRACKETS),
      relatedPersons: [],
    },
  };
}

export function generateMockStudents(count: number = 250): StudentAnalytics[] {
  const students: StudentAnalytics[] = [];
  for (let i = 1; i <= count; i++) {
    students.push(generateMockStudent(i));
  }
  return students;
}
