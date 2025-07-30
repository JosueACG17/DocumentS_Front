// Tipos para Audit Logs
export interface AuditLog {
  _id: string
  timestamp: string
  username: string
  operation: string
  resource_type?: string
  document_id?: string
  document_filename?: string
  category?: string
  filepath?: string
  from_category?: string
  to_category?: string
  data?: {
    category?: string
    text?: string
    inserted_id?: string
  }
}

export type AuditLogResponse = AuditLog[]
