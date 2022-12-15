import { ConsoleView } from "react-device-detect";

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getTime() {
  return new Date().toString().split(" ")[4];
}

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function makeId(length = 6) {
  var txt = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

function makeLorem(size = 100) {
  var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn'];
  var txt = '';
  while (size > 0) {
    size--;
    txt += words[Math.floor(Math.random() * words.length)] + ' ';
  }
  return txt;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFloat(min, max) {
  return (Math.random() * (max - min)) + min
}

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
  if (process.env.NODE_ENV === 'production') return 'https://pikmeserver.herokuapp.com/' //change when in production
  return 'http://localhost:3000/#/'
}

  // localStorage.setItem(key, JSON.stringify(value))
  // JSON.parse(localStorage.getItem(key))