import { apiClient } from "@/lib/api";
import { Statement } from "../types/statement";

const CONSENT_GET_ROUTES = {
  statement: (type: string) => `/consents/latest/${type}`,
  statementContent: (type: string) => `/consents/latest/${type}/content`,
  checkUserConsent: (docId: number) => `/consents/check/doc/${docId}`,
};

const CONSENT_POST_ROUTES = {
  giveConsent: (type: string, docId: number) =>
    `/consents/${type}/doc/${docId}`,
};

export const consentService = {
  getLatestStatement: (type: string): Promise<Statement> =>
    apiClient.get(CONSENT_GET_ROUTES.statement(type)).then((res) => res.data),
  getStatementContent: (type: string): Promise<string> =>
    apiClient
      .get(CONSENT_GET_ROUTES.statementContent(type))
      .then((res) => res.data),
  checkUserConsent: (docId: number): Promise<{ accepted: boolean }> =>
    apiClient
      .get(CONSENT_GET_ROUTES.checkUserConsent(docId))
      .then((res) => res.data),
  giveConsent: (type: string, docId: number) => {
    return apiClient.post(CONSENT_POST_ROUTES.giveConsent(type, docId));
  },
};
