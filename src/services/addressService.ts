/**
 * Address Service
 * Provides data for Philippine provinces, municipalities, and barangays
 */

export interface Province {
  code: string;
  name: string;
}

export interface Municipality {
  code: string;
  name: string;
}

export interface Barangay {
  code: string;
  name: string;
}

// Philippine Provinces (Major ones for demo)
export const PHILIPPINE_PROVINCES: Province[] = [
  { code: "NCR", name: "Metro Manila" },
  { code: "CAL", name: "Calabarzon" },
  { code: "MIMAROPA", name: "Mimaropa" },
  { code: "ILO", name: "Ilocos Region" },
  { code: "COR", name: "Cordillera" },
  { code: "CAG", name: "Cagayan Valley" },
  { code: "CEN", name: "Central Luzon" },
  { code: "BIC", name: "Bicol" },
  { code: "WV", name: "Western Visayas" },
  { code: "CV", name: "Central Visayas" },
  { code: "EV", name: "Eastern Visayas" },
  { code: "ZBN", name: "Zamboanga Peninsula" },
  { code: "NMD", name: "Northern Mindanao" },
  { code: "DCR", name: "Davao Region" },
  { code: "SOCCSKSARGEN", name: "Soccsksargen" },
  { code: "ARMM", name: "Bangsamoro" },
  { code: "CAR", name: "Cordillera Administrative Region" },
];

// Sample municipalities for Metro Manila
const METRO_MANILA_MUNICIPALITIES: Municipality[] = [
  { code: "MK", name: "Makati" },
  { code: "BGC", name: "Bonifacio Global City (Taguig)" },
  { code: "QC", name: "Quezon City" },
  { code: "MAN", name: "Manila" },
  { code: "PAS", name: "Pasay" },
  { code: "CAL", name: "Caloocan" },
  { code: "LAS", name: "Las Piñas" },
  { code: "PAR", name: "Parañaque" },
  { code: "MVL", name: "Maynila" },
  { code: "TAG", name: "Tagaytay" },
];

// Sample barangays for Makati
const MAKATI_BARANGAYS: Barangay[] = [
  { code: "BF", name: "Bangkal" },
  { code: "BN", name: "Bel-Air" },
  { code: "BR", name: "Barrio Barretto" },
  { code: "BLG", name: "Bulingit" },
  { code: "EMP", name: "Pio del Pilar" },
  { code: "GRN", name: "Green Meadows" },
  { code: "KY", name: "Kampanyong Makabago" },
  { code: "LVL", name: "La Paz" },
  { code: "MAP", name: "Magallanes" },
  { code: "PDL", name: "Palanan" },
];

/**
 * Get all provinces
 */
export const getProvinces = (): Province[] => {
  return PHILIPPINE_PROVINCES;
};

/**
 * Get municipalities for a specific province
 */
export const getMunicipalities = (provinceCode: string): Municipality[] => {
  // In a real app, this would fetch from an API or database
  // For demo, returning sample data for Metro Manila
  if (provinceCode === "NCR") {
    return METRO_MANILA_MUNICIPALITIES;
  }
  return [];
};

/**
 * Get barangays for a specific municipality
 */
export const getBarangays = (
  provinceCode: string,
  municipalityCode: string,
): Barangay[] => {
  // In a real app, this would fetch from an API or database
  // For demo, returning sample data for Makati
  if (provinceCode === "NCR" && municipalityCode === "MK") {
    return MAKATI_BARANGAYS;
  }
  return [];
};

/**
 * Format address from components
 */
export const formatAddress = (
  barangay: string,
  municipality: string,
  province: string,
): string => {
  const parts = [barangay, municipality, province].filter(Boolean);
  return parts.join(", ");
};
