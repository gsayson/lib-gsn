export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) temp.push(array.slice(i, i + chunkSize));
  return temp;
}