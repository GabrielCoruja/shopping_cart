const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formata um valor em centavos como moeda brasileira (ex.: 1990 → "R$ 19,90"). */
export const formatPrice = (cents: number): string => brl.format(cents / 100).replace(/\u00a0/g, ' ');
