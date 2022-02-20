const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export function validateEmail(value: string) {
  return EMAIL_REGEXP.test(value);
}

export function validatePassword(value: string) {
  return (value.length >= 8)
}

export function validateName(value: string) {
  return Boolean(value)
}