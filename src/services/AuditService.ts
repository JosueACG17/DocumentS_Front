import { genericRequest } from '@/api/GenericRequest'
import type { AxiosRequestConfig } from 'axios'
import type { AuditLogResponse } from '@/types/auditlog'

export const AuditService = {
  // GET /audit/audit-logs - Obtener todos los logs de auditoría
  getAllAuditLogs(config?: AxiosRequestConfig) {
    return genericRequest.get<AuditLogResponse>('/audit/audit-logs', config)
  },

  // GET /audit/audit-logs/by-operation/{operation} - Obtener logs por operación
  getLogsByOperation(operation: string, config?: AxiosRequestConfig) {
    return genericRequest.get<AuditLogResponse>(
      `/audit/audit-logs/by-operation/${encodeURIComponent(operation)}`,
      config,
    )
  },

  // GET /audit/audit-logs/by-user/{username} - Obtener logs por usuario
  getLogsByUser(username: string, config?: AxiosRequestConfig) {
    return genericRequest.get<AuditLogResponse>(
      `/audit/audit-logs/by-user/${encodeURIComponent(username)}`,
      config,
    )
  },
}
