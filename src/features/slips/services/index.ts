import { apiClient } from "@/lib/api";
import { QueryParams } from "../types/params";
import { decamelizeKeys } from "humps";

const SLIP_LOOKUP_ROUTES = {
  statuses: "/slips/lookups/statuses",
  categories: "/slips/lookups/categories",
};

const SLIP_GET_ROUTES = {
  all: "/slips",
  urgent: "/slips/urgent",
  mySlips: "/slips/me",
  stats: "/slips/stats",
  slip: (id: number) => `/slips/id/${id}`,
  attachments: (id: number) => `/slips/id/${id}/attachments`,
  download: (id: number, attachmentId: number) =>
    `/slips/id/${id}/attachments/${attachmentId}`,
};

const SLIP_POST_ROUTES = {
  submit: "/slips",
};

const SLIP_PATCH_ROUTES = {
  updateStatus: (id: number) => `/slips/id/${id}/status`,
};

export const slipService = {
  async getSlipStats(params?: QueryParams) {
    const response = await apiClient.get(SLIP_GET_ROUTES.stats, {
      params: decamelizeKeys(params),
    });
    return response.data;
  },
  async getSlipStatuses() {
    const response = await apiClient.get(SLIP_LOOKUP_ROUTES.statuses);
    return response.data;
  },
  async getSlipCategories() {
    const response = await apiClient.get(SLIP_LOOKUP_ROUTES.categories);
    return response.data;
  },
  async getMySlips({ params }: { params?: QueryParams } = {}) {
    const response = await apiClient.get(SLIP_GET_ROUTES.mySlips, {
      params: decamelizeKeys(params),
    });
    return response.data;
  },
  async getUrgentSlips(params?: QueryParams) {
    const response = await apiClient.get(SLIP_GET_ROUTES.urgent, {
      params: decamelizeKeys(params),
    });
    console.log(
      "[slipService.getUrgentSlips] Request params:",
      decamelizeKeys(params),
    );
    console.log("[slipService.getUrgentSlips] Response data:", response.data);
    return response.data;
  },
  async getAllSlips(params?: QueryParams) {
    const response = await apiClient.get(SLIP_GET_ROUTES.all, {
      params: decamelizeKeys(params),
    });
    console.log(
      "[slipService.getAllSlips] Request params:",
      decamelizeKeys(params),
    );
    console.log("[slipService.getAllSlips] Response data:", response.data);
    return response.data;
  },
  async getSlipByID(id: number) {
    const route = SLIP_GET_ROUTES.slip(id);
    const response = await apiClient.get(route);
    return response.data;
  },
  async getSlipAttachments(id: number) {
    const route = SLIP_GET_ROUTES.attachments(id);
    const response = await apiClient.get(route);
    return response.data;
  },
  async submitSlip(data: FormData) {
    const response = await apiClient.post(SLIP_POST_ROUTES.submit, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async updateSlipStatus(id: number, status: string, adminNotes?: string) {
    const route = SLIP_PATCH_ROUTES.updateStatus(id);
    const payload: { status: string; adminNotes?: string } = { status };
    if (adminNotes !== undefined) {
      payload.adminNotes = adminNotes;
    }
    const response = await apiClient.patch(route, payload);
    return response.data;
  },
  async downloadAttachment(slipId: number, attachmentId: number) {
    const route = SLIP_GET_ROUTES.download(slipId, attachmentId);
    console.log(
      `[slipService.downloadAttachment] Starting download from route: ${route}`,
    );

    try {
      console.log(
        "[slipService.downloadAttachment] Making axios request with responseType: blob",
      );

      const response = await apiClient.get(route, {
        responseType: "blob",
      });

      console.log(
        `[slipService.downloadAttachment] Response received - status: ${response.status}, size: ${response.data?.size || 0}, type: ${response.data?.type || "unknown"}`,
      );

      return response.data;
    } catch (error: any) {
      console.error("[slipService.downloadAttachment] Request failed:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        responseType: error.config?.responseType,
        headers: error.config?.headers,
        message: error.message,
        errorData: error.response?.data,
      });
      throw error;
    }
  },
};
