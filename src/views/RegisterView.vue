<template>
  <div class="min-h-screen bg-black flex">
    <!-- Left Side - Visual Hero -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Dynamic Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>

      <!-- Animated Mesh Gradient -->
      <div class="absolute inset-0 opacity-30">
        <div
          class="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob">
        </div>
        <div
          class="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000">
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
              <UserPlus class="w-12 h-12 text-white animate-pulse" />
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-bounce"></div>
            <div class="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
          </div>

          <!-- Hero Text -->
          <h1 class="text-5xl font-black mb-6 ">
            Únete a
            <span class="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
              DocumentSort
            </span>
          </h1>

          <p class="text-xl text-white/90 mb-8 leading-relaxed font-light">
            Comienza tu viaje hacia una gestión de documentos más inteligente y eficiente
          </p>

          <!-- Benefit Pills -->
          <div class="flex flex-wrap gap-3 justify-center">
            <div
              class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Zap class="w-4 h-4 text-yellow-300" />
              <span class="text-sm font-medium">Clasificación IA</span>
            </div>
            <div
              class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Star class="w-4 h-4 text-emerald-300" />
              <span class="text-sm font-medium">Análisis K-Means</span>
            </div>
            <div
              class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Users class="w-4 h-4 text-cyan-300" />
              <span class="text-sm font-medium">Búsqueda Avanzada</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute top-20 left-20 w-3 h-3 bg-white/40 rounded-full animate-float"></div>
      <div class="absolute top-40 right-32 w-2 h-2 bg-emerald-300/60 rounded-full animate-float animation-delay-1000">
      </div>
      <div class="absolute bottom-32 left-1/4 w-4 h-4 bg-teal-300/50 rounded-full animate-float animation-delay-2000">
      </div>
      <div class="absolute bottom-20 right-20 w-2 h-2 bg-cyan-300/60 rounded-full animate-float animation-delay-3000">
      </div>
    </div>

    <!-- Right Side - Register Form -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-bl from-green-950 via-gray-900 to-emerald-950 relative">
      <!-- Subtle background pattern -->
      <div class="absolute inset-0 bg-dot-white/[0.02] bg-[size:20px_20px]"></div>

      <!-- Subtle animated background elements -->
      <div class="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-600/5 rounded-full blur-3xl animate-pulse"></div>
      <div
        class="absolute bottom-1/4 left-1/4 w-40 h-40 bg-teal-600/5 rounded-full blur-3xl animate-pulse animation-delay-2000">
      </div>

      <div class="w-full max-w-md relative z-10">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <div
            class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus class="w-8 h-8 text-white" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-white mb-3">
            Crear Cuenta
          </h2>
          <p class="text-gray-400 text-lg">Únete a la revolución documental</p>
        </div>

        <!-- Register Form -->
        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p class="text-red-400 text-sm text-center">{{ errorMessage }}</p>
          </div>

          <!-- Name Field -->
          <div class="space-y-2">
            <label for="fullName" class="text-sm font-semibold text-gray-300 block">
              Nombre Completo
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User
                  class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-200" />
              </div>
              <Field id="fullName" name="fullName" type="text" placeholder="Juan Pérez García" :class="[
                'w-full pl-12 pr-4 py-4 bg-gray-900/50 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:bg-gray-900/70',
                errors.fullName ? 'border-red-500 focus:ring-red-500 hover:border-red-400' : 'border-gray-700 focus:ring-emerald-500 hover:border-gray-600'
              ]" />
            </div>
            <ErrorMessage name="fullName" class="text-red-400 text-sm" />
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-semibold text-gray-300 block">
              Correo Electrónico
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail
                  class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-200" />
              </div>
              <Field id="email" name="email" type="email" placeholder="tu@email.com" :class="[
                'w-full pl-12 pr-4 py-4 bg-gray-900/50 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:bg-gray-900/70',
                errors.email ? 'border-red-500 focus:ring-red-500 hover:border-red-400' : 'border-gray-700 focus:ring-emerald-500 hover:border-gray-600'
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
                <Lock
                  class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-200" />
              </div>
              <Field id="password" name="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                :class="[
                  'w-full pl-12 pr-12 py-4 bg-gray-900/50 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:bg-gray-900/70',
                  errors.password ? 'border-red-500 focus:ring-red-500 hover:border-red-400' : 'border-gray-700 focus:ring-emerald-500 hover:border-gray-600'
                ]" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
            <ErrorMessage name="password" class="text-red-400 text-sm" />
            <!-- Password Strength Indicator -->
            <div class="mt-3">
              <div class="flex space-x-1 mb-2">
                <div v-for="i in 4" :key="i"
                  :class="passwordStrength >= i ? getStrengthColor(passwordStrength) : 'bg-gray-700'"
                  class="h-2 flex-1 rounded-full transition-colors duration-300"></div>
              </div>
              <p class="text-xs" :class="getStrengthTextColor(passwordStrength)">
                {{ getStrengthText(passwordStrength) }}
              </p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label for="confirmPassword" class="text-sm font-semibold text-gray-300 block">
              Confirmar Contraseña
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock
                  class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-200" />
              </div>
              <Field id="confirmPassword" name="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••" :class="[
                  'w-full pl-12 pr-12 py-4 bg-gray-900/50 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:bg-gray-900/70',
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500 hover:border-red-400' : 'border-gray-700 focus:ring-emerald-500 hover:border-gray-600'
                ]" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <component :is="showConfirmPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
            <ErrorMessage name="confirmPassword" class="text-red-400 text-sm" />
            <div v-if="values.confirmPassword && values.password !== values.confirmPassword"
              class="flex items-center space-x-2 text-red-400 text-sm mt-2">
              <AlertCircle class="w-4 h-4" />
              <span>Las contraseñas no coinciden</span>
            </div>
          </div>


          <!-- Register Button -->
          <button type="submit" :disabled="isLoading"
            class="w-full cursor-pointer py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl text-white font-bold text-lg hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
            <component :is="isLoading ? Loader : UserPlus" :class="isLoading ? 'animate-spin' : ''" class="w-5 h-5" />
            <span>{{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="text-center mt-6">
          <p class="text-gray-400">
            ¿Ya tienes una cuenta?
            <button @click="goToLogin"
              class="text-emerald-400 hover:text-emerald-300 transition-colors font-bold ml-1 cursor-pointer">
              Inicia sesión aquí
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserPlus, User, Mail, Lock, Eye, EyeOff, Loader,
  Zap, Star, Users, AlertCircle
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useForm, Field, ErrorMessage } from 'vee-validate'
import { registerSchema } from '@/utils/validationSchemas'
import { AuthService, type RegisterRequest } from '@/services/AuthService'

// Reactive data
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

// Setup vee-validate
const { handleSubmit, errors, values } = useForm({
  validationSchema: registerSchema
})

// Emits
defineEmits<{
  switchToLogin: []
}>()

function goToLogin() {
  router.push({ name: 'login' })
}

// Computed
const passwordStrength = computed(() => {
  const pwd = values.password || ''
  let strength = 0

  if (pwd.length >= 8) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++

  return strength
})

// Methods
const getStrengthColor = (strength: number) => {
  switch (strength) {
    case 1: return 'bg-red-500'
    case 2: return 'bg-yellow-500'
    case 3: return 'bg-blue-500'
    case 4: return 'bg-emerald-500'
    default: return 'bg-gray-700'
  }
}

const getStrengthText = (strength: number) => {
  switch (strength) {
    case 0: return 'Ingresa una contraseña'
    case 1: return 'Contraseña muy débil'
    case 2: return 'Contraseña débil'
    case 3: return 'Contraseña buena'
    case 4: return 'Contraseña muy fuerte'
    default: return ''
  }
}

const getStrengthTextColor = (strength: number) => {
  switch (strength) {
    case 0: return 'text-gray-500'
    case 1: return 'text-red-400'
    case 2: return 'text-yellow-400'
    case 3: return 'text-blue-400'
    case 4: return 'text-emerald-400'
    default: return 'text-gray-500'
  }
}

const handleRegister = handleSubmit(async (values) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const userData: RegisterRequest = {
      username: values.fullName,
      email: values.email,
      password: values.password
    }

    const response = await AuthService.register(userData)
    console.log('Registro exitoso:', response)

    // Redirigir al login con mensaje de éxito
    router.push({ name: 'login' })

  } catch (error) {
    console.error('Error en registro:', error)
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
  background: rgba(16, 185, 129, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.7);
}
</style>
