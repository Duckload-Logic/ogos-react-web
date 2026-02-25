import { apiClient } from "@/lib/api";

const LOCATION_GET_ROUTES = {
  regions: "/locations/regions",
  cities: (regionId: number) => `/locations/regions/${regionId}/cities`,
  barangays: (cityId: number) => `/locations/cities/${cityId}/barangays`,
};

export const locationService = {
  async getRegions() {
    const route = LOCATION_GET_ROUTES.regions;
    const { data } = await apiClient.get(route);
    return data;
  },

  async getCities(regionId: number) {
    const route = LOCATION_GET_ROUTES.cities(regionId);
    const { data } = await apiClient.get(route);
    return data;
  },

  async getBarangays(cityId: number) {
    const route = LOCATION_GET_ROUTES.barangays(cityId);
    const { data } = await apiClient.get(route);
    return data;
  },
};
