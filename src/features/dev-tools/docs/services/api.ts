import { apiClient } from "@/lib/api";

export const docsService = {
  getIntegrationDocs: () => apiClient.get('/docs/integrations/doc.json'),
};

export default docsService;
