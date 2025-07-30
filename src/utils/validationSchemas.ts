import * as yup from 'yup'

// Esquema de validación para login
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// Esquema de validación para registro
export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('El nombre completo es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número',
    ),
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
})
