export default async function <T>(proms: T): Promise<T> {
  document.body.classList.add('_spinner')
  const res = await proms
  document.body.classList.remove('_spinner')
  return res
}