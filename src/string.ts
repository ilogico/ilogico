export const prepend = (prefix: string) => (string: string) => prefix + string;
export const append = (suffix: string) => (string: string) => string + suffix;
export const indexOf = (pattern: string) => (string: string) => string.indexOf(pattern);
export const charCodeAt = (index: number) => (string: string) => string.charCodeAt(index);
export const charAt = (index: number) => (string: string) => string.charAt(index);
export const codePointAt = (index: number) => (string: string) => string.codePointAt(index);
export const startsWith = (prefix: string) => (string: string) => string.startsWith(prefix);
export const endsWith = (suffix: string) => (string: string) => string.endsWith(suffix);
