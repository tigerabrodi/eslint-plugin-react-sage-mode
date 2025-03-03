// Check if the JSX element is a custom component (starts with uppercase)
export function isCustomComponent(name: string) {
  return /^[A-Z]/.test(name);
}

export function isEventProp(name: string) {
  return /^on[A-Z]/.test(name);
}
