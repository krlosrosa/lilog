/**
 * Formata o nome para ter apenas a primeira letra maiúscula
 * @param name - Nome a ser formatado
 * @returns Nome formatado com primeira letra maiúscula
 */
export const formatName = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
