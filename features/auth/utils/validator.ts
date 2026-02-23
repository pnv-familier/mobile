import { RegisterForm, RegisterErrors } from "../type"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegister(
  values: RegisterForm
): RegisterErrors {
  const errors: RegisterErrors = {}

  if (!values.fullName || values.fullName.trim().length < 2 || values.fullName.trim().length > 50) {
    errors.fullName = "Name must be 2–50 characters"
  }

  if (!isEmailValid(values.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!values.password || values.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
  }

  return errors
}

export function isEmailValid(value: string) {
  return !!(value && EMAIL_REGEX.test(value))
}