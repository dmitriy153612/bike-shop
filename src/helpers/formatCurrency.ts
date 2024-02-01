export default function formatCurrency(amount: number | string): string {
  return Number(amount).toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  })
}
