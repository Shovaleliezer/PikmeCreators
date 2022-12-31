

export function makeCommas(price) {
  return Math.floor((price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function getDateName(date) {
  const monthNames = ["JAN", "FEB", "MAR", "ApR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

  return (monthNames[+date.slice(5, 7) - 1] + ' ' + date.slice(8, 10))
}

export function make2digits(num) {
  if (num < 10) return '0' + num.toString()
  return num
}

export function formatDateHour(date) {
  const d = new Date(date)

  return `${d.getFullYear()}-${make2digits(d.getMonth() + 1)}-${make2digits(d.getDate())}  ${make2digits(d.getHours())}:${make2digits(d.getMinutes())}`
}

export function getSocialIcon(link) {
  if (!link) return 'instagram'
  if (link.includes('twitter')) return 'twitter'
  if (link.includes('tiktok')) return 'tiktok'
  if (link.includes('youtube')) return 'youtube'
  return 'instagram'
}

export function putKandM(num) {
  if (typeof num !== 'number') return 'To be added'
  if (num < 100000) return makeCommas(num)
  if (num < 1000000) return (num / 1000).toFixed(2) + 'K'
  return (num / 1000000).toFixed(2) + 'M'
}

export function getYears() {
  const years = []
  for (let i = Number(new Date().getFullYear()); i > 1999; i--) {
    years.push(i)
  }
  return years
}

export function getRoute() {
  if (process.env.NODE_ENV === 'production') return 'https://pickmecreators.onrender.com/#/' //change when in production
  return 'http://localhost:3000/#/'
}