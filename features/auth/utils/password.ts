export type PasswordStrength = 'weak' | 'medium' | 'strong' | ''

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const hasLetters = /[a-zA-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length === 0) {
    return ''
  }

  if (password.length < 6) {
    return 'weak'
  }

  if (hasLetters && hasNumbers && hasSpecialChar) {
    return 'strong'
  }

  if ((hasLetters && hasNumbers) || (hasLetters && hasSpecialChar) || (hasNumbers && hasSpecialChar)) {
    return 'medium'
  }

  return 'weak'
}
