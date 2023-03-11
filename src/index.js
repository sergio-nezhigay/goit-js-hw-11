import 'simplelightbox/dist/simple-lightbox.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { FetchAPI } from './fetchAPI';
import { imagesMarkup } from './templates';

const element = {
  input: document.querySelector('.search-form'),
  loadmoreButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  deleteSearchButton: document.querySelector('.search-form__button--delete'),
  loading: document.querySelector('#loading'),
};

const per_page = 20;
let page = 1;
let gallery = null;
let searchQuery;
let isPageLoad = true;
const api = new FetchAPI();

const toggleLoading = isLoading => {
  element.loading.classList.toggle('hidden', !isLoading);
};

async function fetchAndShow(page, per_page) {
  try {
    toggleLoading(true);
    const { hits = [], totalHits = 0 } = await api.fetchImages({
      searchQuery,
      page,
      per_page,
    });
    toggleLoading(false);
    if (hits.length) {
      showImages(hits);
      if (isPageLoad) {
        observeLastUser();
        isPageLoad = false;
      }
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      if (page <= totalHits / per_page) {
        element.loadmoreButton.classList.remove('hidden');
      } else {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (e) {
    console.log('Error in app: ', e);
  }
}

function showImages(images) {
  const galleryItemsHtml = imagesMarkup(images);
  element.gallery.insertAdjacentHTML('beforeend', galleryItemsHtml);
  if (!gallery) {
    gallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    gallery.refresh();
    const { height: cardHeight } =
      element.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

element.loadmoreButton.addEventListener('click', () =>
  fetchAndShow(page, per_page)
);

element.input.addEventListener('submit', onSubmit);
function onSubmit(e) {
  e.preventDefault();
  ({
    searchQuery: { value: searchQuery },
  } = e.target.elements);
  if (searchQuery) {
    clearGallery();
    fetchAndShow(page, per_page);
  }
}

function clearGallery() {
  page = 1;
  if (gallery) {
    gallery.destroy();
    gallery = null;
    element.gallery.innerHTML = '';
  }
  element.loadmoreButton.classList.add('hidden');
}

element.deleteSearchButton.addEventListener('click', onDeleteSearchButton);

function onDeleteSearchButton() {
  element.input.reset();
  clearGallery();
  element.deleteSearchButton.classList.add('hidden');
}

element.input.addEventListener('input', debounce(onInput, 500));

function onInput(e) {
  if (e.target.value.length > 0)
    element.deleteSearchButton.classList.remove('hidden');
  else element.deleteSearchButton.classList.add('hidden');
}

const getLastUseEle = () =>
  document.querySelector('.gallery .gallery__item:last-child');

const infScrollCallback = async (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  page += 1;
  await fetchAndShow(page, per_page);
  observeLastUser();
  observer.unobserve(entry.target);
};

const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

const observeLastUser = () => {
  infScrollObserver.observe(getLastUseEle());
};
