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
  detail:
    | Array<{
        loc: (string | number)[]
        msg: string
        type: string
      }>
    | string
}

export interface SimpleError {
  detail: string
  message?: string
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
    // Si el error tiene la estructura de FastAPI con detail array
    if (error && typeof error === 'object' && 'detail' in error) {
      const validationError = error as ValidationError
      if (Array.isArray(validationError.detail)) {
        return validationError.detail.map((err) => err.msg).join(', ')
      }
      // Si detail es un string directamente
      if (typeof validationError.detail === 'string') {
        return validationError.detail
      }
    }

    // Si el error tiene un mensaje directo
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message
    }

    // Si el error es un string directamente
    if (typeof error === 'string') {
      return error
    }

    // Si el error tiene la estructura {detail: "mensaje"}
    if (error && typeof error === 'object' && 'detail' in error) {
      const simpleError = error as SimpleError
      if (typeof simpleError.detail === 'string') {
        return simpleError.detail
      }
    }

    return 'Ha ocurrido un error inesperado'
  },
}
