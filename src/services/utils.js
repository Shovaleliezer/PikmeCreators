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

export function formatDate(date) {
  return date.substring(8, 10) + '/' + date.substring(5, 7) + '/' + date.substring(0, 4)
}

export function formatHour(date) {
  return date.substring(14, 16) + ':' + date.substring(17, 19)
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

  // localStorage.setItem(key, JSON.stringify(value))
  // JSON.parse(localStorage.getItem(key))