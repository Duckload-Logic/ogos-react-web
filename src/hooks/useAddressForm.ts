import { useState, useCallback } from "react";
import {
  getProvinces,
  getMunicipalities,
  getBarangays,
  formatAddress,
  Province,
  Municipality,
  Barangay,
} from "@/lib/addressUtils";

interface AddressFormState {
  province: string;
  municipality: string;
  barangay: string;
}

export const useAddressForm = (
  initialState: AddressFormState = {
    province: "",
    municipality: "",
    barangay: "",
  },
) => {
  const [address, setAddress] = useState<AddressFormState>(initialState);
  const [provinces] = useState<Province[]>(getProvinces());
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);

  const handleProvinceChange = useCallback((provinceCode: string) => {
    setAddress((prev) => ({
      ...prev,
      province: provinceCode,
      municipality: "",
      barangay: "",
    }));
    setMunicipalities(getMunicipalities(provinceCode));
    setBarangays([]);
  }, []);

  const handleMunicipalityChange = useCallback(
    (municipalityCode: string) => {
      setAddress((prev) => ({
        ...prev,
        municipality: municipalityCode,
        barangay: "",
      }));
      setBarangays(getBarangays(address.province, municipalityCode));
    },
    [address.province],
  );

  const handleBarangayChange = useCallback((barangayCode: string) => {
    setAddress((prev) => ({
      ...prev,
      barangay: barangayCode,
    }));
  }, []);

  const getFormattedAddress = useCallback(() => {
    return formatAddress(
      address.barangay,
      address.municipality,
      address.province,
    );
  }, [address]);

  return {
    address,
    provinces,
    municipalities,
    barangays,
    handleProvinceChange,
    handleMunicipalityChange,
    handleBarangayChange,
    getFormattedAddress,
  };
};
