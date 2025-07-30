import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

class GenericRequest {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://127.0.0.1:8000',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // Interceptor para agregar el token de autorización
    this.instance.interceptors.request.use(
      (config) => {
        const token = Cookies.get('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, config)
      return response.data
    } catch (error: unknown) {
      if (this.isAxiosError(error)) {
        throw error.response?.data || error.message || 'Error en la petición GET'
      }
      throw 'Error en la petición GET'
    }
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.post(url, data, config)
      return response.data
    } catch (error: unknown) {
      if (this.isAxiosError(error)) {
        throw error.response?.data || error.message || 'Error en la petición POST'
      }
      throw 'Error en la petición POST'
    }
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.put(url, data, config)
      return response.data
    } catch (error: unknown) {
      if (this.isAxiosError(error)) {
        throw error.response?.data || error.message || 'Error en la petición PUT'
      }
      throw 'Error en la petición PUT'
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(url, config)
      return response.data
    } catch (error: unknown) {
      if (this.isAxiosError(error)) {
        throw error.response?.data || error.message || 'Error en la petición DELETE'
      }
      throw 'Error en la petición DELETE'
    }
  }
  private isAxiosError(error: unknown): error is import('axios').AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      (error as { isAxiosError?: boolean }).isAxiosError === true
    )
  }
}

export const genericRequest = new GenericRequest()
