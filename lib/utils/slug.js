/**
 * Utilitários para geração de slugs (URLs amigáveis)
 */

/**
 * Converte um texto em um slug URL-friendly
 * @param {string} value
 * @returns {string}
 */
export function slugify(value) {
  if (!value) return ''

  return value
    .toString()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-')      // Espaços para hífen
    .replace(/-+/g, '-')        // Hífens duplicados
    .toLowerCase()
}
