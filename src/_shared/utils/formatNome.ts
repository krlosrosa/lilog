export function normalizarNome(nome: string): string {
  const partes = nome
    .trim()
    .toLowerCase()
    .split(/\s+/); // separa por espaços múltiplos

  if (partes.length === 0) return "";

  const primeiro = partes[0];
  const ultimo = partes.length > 1 ? partes[partes.length - 1] : "";

  const capitalizar = (palavra: string) =>
    palavra.charAt(0).toUpperCase() + palavra.slice(1);

  return ultimo
    ? `${capitalizar(primeiro)} ${capitalizar(ultimo)}`
    : capitalizar(primeiro);
}
