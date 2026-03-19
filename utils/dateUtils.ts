export function getDateDaysFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${day}-${month}`;
}
