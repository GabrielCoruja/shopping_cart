import type { Customer } from '../types';

export type CheckoutErrors = Partial<Record<keyof Customer, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

export function validateCustomer(customer: Customer): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (customer.name.trim().length < 3) errors.name = 'Informe seu nome completo';
  if (!EMAIL.test(customer.email.trim())) errors.email = 'Informe um e-mail válido';
  if (customer.cep.replace(/\D/g, '').length !== 8) errors.cep = 'O CEP precisa ter 8 dígitos';
  if (customer.address.trim().length < 5) errors.address = 'Informe rua e número';
  if (customer.city.trim().length < 2) errors.city = 'Informe a cidade';
  return errors;
}
