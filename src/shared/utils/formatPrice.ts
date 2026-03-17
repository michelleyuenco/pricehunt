import { type Currency } from '../../domain/entities/Response';

export function formatPrice(price: number, currency: Currency): string {
  if (currency === 'NT$' || currency === 'HK$' || currency === 'S$') {
    return `${currency}${price % 1 === 0 ? price : price.toFixed(1)}`;
  }
  if (currency === '¥') {
    return `¥${Math.round(price)}`;
  }
  return `${currency}${price}`;
}
