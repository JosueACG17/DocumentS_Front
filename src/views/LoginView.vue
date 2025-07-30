<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 flex">
    <!-- Left Side - Visual Hero -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Dynamic Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600"></div>

      <!-- Animated Mesh Gradient -->
      <div class="absolute inset-0 opacity-30">
        <div
          class="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob">
        </div>
        <div
          class="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000">
        </div>

      </div>

      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
        <div class="max-w-lg">
          <!-- Animated Logo -->
          <div class="relative mb-8">
            <div
              class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border border-white/30 shadow-2xl">
              <FileText class="w-12 h-12 text-white animate-pulse" />
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full animate-bounce"></div>
            <div class="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
          </div>

          <!-- Hero Text -->
          <h1 class="text-5xl font-black mb-6 leading-tight">
            Bienvenido a
            <span class="bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              DocumentSort
            </span>
          </h1>

          <p class="text-xl text-white/90 mb-8 leading-relaxed font-light">
            La plataforma más avanzada para organizar y gestionar tus documentos con modelos inteligentes.
          </p>

          <!-- Feature Pills -->
          <div class="flex flex-wrap gap-3 justify-center">
            <div
              class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Brain class="w-4 h-4 text-yellow-300" />
              <span class="text-sm font-medium">IA Avanzada</span>
            </div>
            <div
              class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Shield class="w-4 h-4 text-green-300" />
              <span class="text-sm font-medium">100% Seguro</span>
            </div>
            <div
              class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Zap class="w-4 h-4 text-blue-300" />
              <span class="text-sm font-medium">Super Rápido</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute top-20 left-20 w-3 h-3 bg-white/40 rounded-full animate-float"></div>
      <div class="absolute top-40 right-32 w-2 h-2 bg-cyan-300/60 rounded-full animate-float animation-delay-1000">
      </div>
      <div class="absolute bottom-32 left-1/4 w-4 h-4 bg-blue-300/50 rounded-full animate-float animation-delay-2000">
      </div>
      <div class="absolute bottom-20 right-20 w-2 h-2 bg-indigo-300/60 rounded-full animate-float animation-delay-3000">
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-bl from-blue-900 via-gray-900 to-blue-950 relative">
      <!-- Subtle background pattern -->
      <div class="absolute inset-0 bg-dot-white/[0.02] bg-[size:20px_20px]"></div>

      <!-- Subtle animated background elements -->
      <div class="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
      <div
        class="absolute bottom-1/4 left-1/4 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl animate-pulse animation-delay-2000">
      </div>

      <div class="w-full max-w-md relative z-10">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <div
            class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText class="w-8 h-8 text-white" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-white mb-3">
            Iniciar Sesión
          </h2>
          <p class="text-gray-400 text-lg">Accede a tu cuenta para continuar</p>
        </div>

        <!-- Login Form -->
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p class="text-red-400 text-sm text-center">{{ errorMessage }}</p>
          </div>
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-semibold text-gray-300 block">
              Correo Electrónico
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <Field id="email" name="email" type="email" placeholder="tu@email.com" :class="[
                'w-full pl-12 pr-4 py-4 bg-gray-900/50 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:bg-gray-900/70',
                errors.email ? 'border-red-500 focus:ring-red-500 hover:border-red-400' : 'border-gray-700 focus:ring-blue-500 hover:border-gray-600'
              ]" />
            </div>
            <ErrorMessage name="email" class="text-red-400 text-sm" />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-semibold text-gray-300 block">
              Contraseña
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <Field id="password" name="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                :class="[
                  'w-full pl-12 pr-12 py-4 bg-gray-900/50 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:bg-gray-900/70',
                  errors.password ? 'border-red-500 focus:ring-red-500 hover:border-red-400' : 'border-gray-700 focus:ring-blue-500 hover:border-gray-600'
                ]" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
            <ErrorMessage name="password" class="text-red-400 text-sm" />
          </div>

          <!-- Login Button -->
          <button type="submit" :disabled="isLoading"
            class="w-full py-4 cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-2xl text-white font-bold text-lg hover:from-blue-600 hover:via-indigo-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
            <component :is="isLoading ? Loader : LogIn" :class="isLoading ? 'animate-spin' : ''" class="w-5 h-5" />
            <span>{{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="text-center mt-6">
          <p class="text-gray-400">
            ¿No tienes una cuenta?
            <button @click="goToRegister"
              class="text-blue-400 hover:text-blue-300 transition-colors font-bold ml-1 cursor-pointer">
              Regístrate gratis
            </button>
          </p>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-gray-600 text-sm">
            © 2025 DocumentSort. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <ConfirmModal :is-open="showSuccessModal" type="success" title="¡Inicio de Sesión Exitoso!"
      message="Has iniciado sesión correctamente. Serás redirigido al dashboard automáticamente en unos segundos."
      :show-cancel="false" :show-confirm="false" @close="showSuccessModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FileText, Mail, Lock, Eye, EyeOff, LogIn, Loader,
  Brain, Shield, Zap
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useForm, Field, ErrorMessage } from 'vee-validate'
import { loginSchema } from '@/utils/validationSchemas'
import { AuthService, type LoginRequest } from '@/services/AuthService'
import { useAuthStore } from '@/stores/auth'
import ConfirmModal from '@/components/ConfirmModal.vue'

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const router = useRouter()
const authStore = useAuthStore()

// Setup vee-validate
const { handleSubmit, errors } = useForm({
  validationSchema: loginSchema
})

function goToRegister() {
  router.push({ name: 'register' })
}

// Emits
defineEmits<{
  switchToRegister: []
}>()

const handleLogin = handleSubmit(async (values) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const credentials: LoginRequest = {
      email: values.email,
      password: values.password
    }

    const response = await AuthService.login(credentials)
    console.log('Login exitoso:', response)

    // Guardar datos en el store
    authStore.setAuth(
      {
        username: response.username,
        email: values.email
      },
      response.access_token
    )

    // Mostrar modal de éxito
    showSuccessModal.value = true

    // Redirigir después de 4 segundos
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 2000)

  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = AuthService.handleValidationError(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.bg-grid-white\/\[0\.05\] {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

.bg-dot-white\/\[0\.02\] {
  background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}
</style>
