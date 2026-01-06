import React from "react";

interface AddressSelectorProps {
  label: string;
  provinceValue: string;
  municipalityValue: string;
  barangayValue: string;
  onProvinceChange: (value: string) => void;
  onMunicipalityChange: (value: string) => void;
  onBarangayChange: (value: string) => void;
  isRequired?: boolean;
  isMobile?: boolean;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  label,
  provinceValue,
  municipalityValue,
  barangayValue,
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
  isRequired = false,
  isMobile = false,
}) => {
  const gridColsClass = isMobile
    ? "grid-cols-1"
    : "sm:grid-cols-2 md:grid-cols-3";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
        {/* Province Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Province
            {isRequired && <span className="text-red-600">*</span>}
          </label>
          <select
            value={provinceValue}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="">Select Province</option>
            <option value="NCR">Metro Manila</option>
            <option value="CAL">Calabarzon</option>
            <option value="MIMAROPA">Mimaropa</option>
            <option value="ILO">Ilocos Region</option>
            <option value="COR">Cordillera</option>
            <option value="CAG">Cagayan Valley</option>
            <option value="CEN">Central Luzon</option>
            <option value="BIC">Bicol</option>
            <option value="WV">Western Visayas</option>
            <option value="CV">Central Visayas</option>
            <option value="EV">Eastern Visayas</option>
            <option value="ZBN">Zamboanga Peninsula</option>
            <option value="NMD">Northern Mindanao</option>
            <option value="DCR">Davao Region</option>
            <option value="SOCCSKSARGEN">Soccsksargen</option>
          </select>
        </div>

        {/* Municipality Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Municipality
            {isRequired && <span className="text-red-600">*</span>}
          </label>
          <select
            value={municipalityValue}
            onChange={(e) => onMunicipalityChange(e.target.value)}
            disabled={!provinceValue}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Municipality</option>
            {provinceValue === "NCR" && (
              <>
                <option value="MK">Makati</option>
                <option value="BGC">Bonifacio Global City (Taguig)</option>
                <option value="QC">Quezon City</option>
                <option value="MAN">Manila</option>
                <option value="PAS">Pasay</option>
                <option value="CAL">Caloocan</option>
                <option value="LAS">Las Piñas</option>
                <option value="PAR">Parañaque</option>
              </>
            )}
          </select>
        </div>

        {/* Barangay Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Barangay
            {isRequired && <span className="text-red-600">*</span>}
          </label>
          <select
            value={barangayValue}
            onChange={(e) => onBarangayChange(e.target.value)}
            disabled={!municipalityValue}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Barangay</option>
            {provinceValue === "NCR" && municipalityValue === "MK" && (
              <>
                <option value="BF">Bangkal</option>
                <option value="BN">Bel-Air</option>
                <option value="BR">Barrio Barretto</option>
                <option value="BLG">Bulingit</option>
                <option value="EMP">Pio del Pilar</option>
                <option value="GRN">Green Meadows</option>
                <option value="KY">Kampanyong Makabago</option>
                <option value="LVL">La Paz</option>
                <option value="MAP">Magallanes</option>
                <option value="PDL">Palanan</option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};
