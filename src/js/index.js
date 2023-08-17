
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { searchForImage } from "./gallery-api";


 const refs ={
   form: document.querySelector('.search-form'),
   gallery: document.querySelector('.gallery')
 }

refs.form.addEventListener('submit', handleSubmit)
 
async function handleSubmit(e) {
  e.preventDefault()
  const query = e.target.elements.searchQuery.value.trim()
  try {
    const result = await searchForImage(query)
    if (result.total === 0 || query === '') {
      return Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    }
    renderPhoto(result.hits)
   let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
})
  } catch (error) { }


}

function renderPhoto(data) {
  const renderData = data.map(el => 
    `<div class="photo-card"><a class='photo-link' href='${el.largeImageURL}'>
  <img class='image' src="${el.webformatURL}" alt="${el.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b >Likes <span class='info-item-content'>${el.likes}</span></b>
    </p>
    <p class="info-item">
      <b >Views <span class='info-item-content'>${el.views}</span></b>
    </p>
    <p class="info-item">
      <b >Comments <span class='info-item-content'>${el.comments}</span></b>
    </p>
    <p class="info-item">
      <b >Downloads <span class='info-item-content'>${el.downloads}</span></b>
    </p>
  </div>
</div>` ).join('');
  
refs.gallery.insertAdjacentHTML('afterbegin',renderData)
  }