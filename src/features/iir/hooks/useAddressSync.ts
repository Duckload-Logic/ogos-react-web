import { useEffect, useState } from "react";
import { Address } from "../types";

/**
 * Hook to manage "Same As" address synchronization
 * Provides state management for syncing one address to another
 *
 * @param sourceAddress - The source address to copy from
 * @param targetAddress - The target address to copy to
 * @param onSync - Callback to update the target address
 * @returns Object with isSynced state, toggle function, and isReadOnly flag
 */
export function useAddressSync(
  sourceAddress: Address | undefined,
  targetAddress: Address | undefined,
  onSync: (address: Address | null) => void,
) {
  const [isSynced, setIsSynced] = useState(false);

  /**
   * Sync target address with source address when checkbox is toggled
   */
  useEffect(() => {
    if (isSynced && sourceAddress) {
      // Copy all fields from source to target
      onSync({
        region: sourceAddress.region || { code: "" },
        province: sourceAddress.province || { code: "" },
        city: sourceAddress.city || { code: "" },
        barangay: sourceAddress.barangay || { code: "" },
        streetDetail: sourceAddress.streetDetail || "",
      });
    }
  }, [isSynced, sourceAddress, onSync]);

  /**
   * Reactive updates: When source changes while synced, update target
   */
  useEffect(() => {
    if (isSynced && sourceAddress) {
      onSync({
        region: sourceAddress.region || { code: "" },
        province: sourceAddress.province || { code: "" },
        city: sourceAddress.city || { code: "" },
        barangay: sourceAddress.barangay || { code: "" },
        streetDetail: sourceAddress.streetDetail || "",
      });
    }
  }, [
    isSynced,
    sourceAddress?.region?.code,
    sourceAddress?.province?.code,
    sourceAddress?.city?.code,
    sourceAddress?.barangay?.code,
    sourceAddress?.streetDetail,
    onSync,
  ]);

  /**
   * Toggle sync state
   * When unchecked, target keeps current values but becomes editable
   */
  const toggleSync = (checked: boolean) => {
    setIsSynced(checked);

    if (!checked) {
      // When unchecking, keep the current values but allow editing
      // No need to clear - user can manually adjust
    }
  };

  return {
    isSynced,
    toggleSync,
    isReadOnly: isSynced, // Fields are read-only when synced
  };
}
