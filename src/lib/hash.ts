const SECRET_KEY = import.meta.env.VITE_SECRET;

// Simple hash function using base64 encoding with a secret prefix
export const hashId = (id: string): string => {
  const combined = `${SECRET_KEY}:${id}`;
  return btoa(combined);
};

export const unhashId = (hash: string): string => {
  try {
    const decoded = atob(hash);
    const parts = decoded.split(':');
    if (parts.length !== 2 || parts[0] !== SECRET_KEY) {
      console.error('Invalid hash format or wrong secret');
      return '';
    }
    return parts[1];
  } catch (error) {
    console.error('Error decoding hash:', error);
    return '';
  }
};
