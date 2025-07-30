import { genericRequest } from '@/api/GenericRequest'
import type { AxiosRequestConfig } from 'axios'

// Interfaces para los datos de autenticación
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  username: string
  message?: string
}

export interface ValidationError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

export const AuthService = {
  // POST /auth/register - Registrar usuario
  register(userData: RegisterRequest, config?: AxiosRequestConfig) {
    return genericRequest.post<AuthResponse>('/auth/register', userData, config)
  },

  // POST /auth/login - Iniciar sesión
  login(credentials: LoginRequest, config?: AxiosRequestConfig) {
    return genericRequest.post<AuthResponse>('/auth/login', credentials, config)
  },

  // Método auxiliar para manejar errores de validación
  handleValidationError(error: unknown): string {
    if (error && typeof error === 'object' && 'detail' in error) {
      const validationError = error as ValidationError
      if (Array.isArray(validationError.detail)) {
        return validationError.detail.map((err) => err.msg).join(', ')
      }
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message
    }
    return 'Error en la autenticación'
  },
}
