import './css/styles.css';

import Notiflix from 'notiflix';

import { FetchAPI } from './fetchAPI';

const BASE_URL = 'https://pixabay.com/api/?';
const element = {
  input: document.querySelector('#search-form'),
};

element.input.addEventListener('submit', onSubmit);

const api = new FetchAPI();
testfunc();

function testfunc() {
  const searchQuery = 'yellow';
  api
    .fetchImages(searchQuery)
    .then(({ hits, total }) => showImages(hits, total));
}

function onSubmit(e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();
  console.log(searchQuery);
  api
    .fetchImages(searchQuery)
    .then(({ hits, total }) => showImages(hits, total));
}

function showImages(images, total) {
  console.log(images);
  // const markUp =
}
