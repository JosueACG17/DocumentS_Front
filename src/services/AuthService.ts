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

  handleValidationError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message
    }

    if (error.response?.status === 401) {
      return 'Credenciales incorrectas. Verifica tu email y contraseña.'
    }

    if (error.response?.status === 422) {
      return 'Datos inválidos. Verifica la información ingresada.'
    }

    if (error.response?.status >= 500) {
      return 'Error en el servidor. Intenta nuevamente en unos momentos.'
    }

    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return 'Error de conexión. Verifica tu conexión a internet.'
    }

    // Cambiar este mensaje por defecto
    return 'Ha ocurrido un error inesperado. Intenta nuevamente.'
  }

}
