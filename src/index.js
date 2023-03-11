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
  gallery: document.querySelector('.gallery'),
  deleteSearchButton: document.querySelector('.search-form__button--delete'),
  loading: document.querySelector('#loading'),
};

const per_page = 40;
let page = 1;
let gallery = null;
let searchQuery;
const api = new FetchAPI();

const toggleLoadingIndicator = isLoading => {
  element.loading.classList.toggle('hidden', !isLoading);
};

const fetchAndShowImages = async ({ page, per_page, searchQuery }) => {
  try {
    toggleLoadingIndicator(true);
    const { hits = [], totalHits = 0 } = await api.fetchImages({
      searchQuery,
      page,
      per_page,
    });
    toggleLoadingIndicator(false);
    if (!hits.length && page === 1) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      displayImages(hits);
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      if (page > totalHits / per_page) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      observeLastUser();
    }
  } catch (e) {
    console.log('Error in app: ', e);
  }
};

const shiftRow = () => {
  if (page !== 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
};

const displayImages = images => {
  if (!images.length) return;
  const galleryItemsHtml = imagesMarkup(images);
  element.gallery.insertAdjacentHTML('beforeend', galleryItemsHtml);
  if (!gallery) {
    gallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    gallery.refresh();
    shiftRow();
  }
};

const resetGallery = () => {
  page = 1;
  if (gallery) {
    gallery.destroy();
    gallery = null;
    element.gallery.innerHTML = '';
  }
};

const onSubmitSearchForm = e => {
  e.preventDefault();
  ({
    searchQuery: { value: searchQuery },
  } = e.target.elements);
  if (searchQuery) {
    resetGallery();
    fetchAndShowImages({ page, per_page, searchQuery });
  }
};

element.input.addEventListener('submit', onSubmitSearchForm);

const onDeleteSearchButtonClick = () => {
  element.input.reset();
  resetGallery();
  element.deleteSearchButton.classList.add('hidden');
};

element.deleteSearchButton.addEventListener('click', onDeleteSearchButtonClick);

const onSearchFormInput = e => {
  if (e.target.value.length > 0)
    element.deleteSearchButton.classList.remove('hidden');
  else element.deleteSearchButton.classList.add('hidden');
};

element.input.addEventListener('input', debounce(onSearchFormInput, 500));

const infScrollCallback = async (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  page += 1;
  await fetchAndShowImages({ page, per_page, searchQuery });
  observeLastUser();
  observer.unobserve(entry.target);
};

const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

const getLastUseEle = () =>
  document.querySelector('.gallery .gallery__item:last-child');

const observeLastUser = () => {
  infScrollObserver.observe(getLastUseEle());
};
