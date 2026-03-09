import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownField, InputField } from "@/components/form";
import {
  useRegions,
  useCities,
  useBarangays,
} from "@/features/locations/hooks";
import { Barangay, City, Region } from "@/features/iir/types/IIRForm";

export function AddressCard({
  studentInfo,
  onChange,
  addrType,
  id,
}: {
  studentInfo?: any;
  onChange: (path: string, value: any) => void;
  addrType: string;
  id: any;
}) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(
    null,
  );

  const { data: regions = [], isLoading: isRegionsLoading } = useRegions();
  const { data: cities = [], isLoading: isCitiesLoading } = useCities(
    selectedRegion?.id || 0,
  );
  const { data: barangays = [], isLoading: isBarangaysLoading } = useBarangays(
    selectedCity?.id || 0,
  );

  return (
    <>
      <Card id={id} className="bg-card border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{addrType || "Address"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownField formStyle
              label="Region"
              options={regions}
              value={studentInfo?.addresses?.[id]?.address?.region || ""}
              onChange={(val) => {
                onChange(`student.addresses.${id}.address.region`, val);
                const selected =
                  regions.find((r: Region) => r.id === val) || null;
                setSelectedRegion(selected);
                setSelectedCity(null); // Reset city when region changes
              }}
              required
            />
            <DropdownField formStyle
              label="City/Municipality"
              options={cities || []}
              enabled={!!selectedRegion && !isCitiesLoading}
              value={studentInfo?.addresses?.[id]?.address?.city || ""}
              onChange={(val) => {
                onChange(`student.addresses.${id}.address.city`, val);
                const selected = cities.find((c: City) => c.id === val) || null;
                setSelectedCity(selected);
              }}
              required
            />
            <DropdownField formStyle
              label="Barangay"
              options={barangays || []}
              enabled={!!selectedCity && !isBarangaysLoading}
              value={studentInfo?.addresses?.[id]?.address?.barangay || ""}
              onChange={(val) => {
                onChange(`student.addresses.${id}.address.barangay`, val);
                const selected =
                  barangays.find((b: Barangay) => b.id === val) || null;
                setSelectedBarangay(selected);
              }}
              required
            />
            <InputField
              label="Street"
              value={studentInfo?.addresses?.[id]?.address?.streetDetail || ""}
              placeholder="Street/Lot/Blk"
              onChange={(val) =>
                onChange(`student.addresses.${id}.address.streetDetail`, val)
              }
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
