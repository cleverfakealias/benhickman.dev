export const getEnv = (key: string): string => {
  if (import.meta.env) {
    return import.meta.env[key] || '';
  }
  // Fallback for environments where import.meta is not defined
  return '';
};
