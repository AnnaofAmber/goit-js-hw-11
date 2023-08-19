
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { searchForImage } from "./gallery-api";

 
 const refs ={
   form: document.querySelector('.search-form'),
   gallery: document.querySelector('.gallery'),
   btnLoad: document.querySelector('.load-more'),
   
 }

let page = 1
let perPage = 40
refs.form.addEventListener('submit', handleSubmit)

let lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
   })

async function handleSubmit(e) { 
  e.preventDefault()
  refs.btnLoad.classList.add('hidden')
  refresh() 
  page = 1

  const query = e.target.elements.searchQuery.value.trim()
if (query === '') {
      return Notiflix.Notify.failure("Sorry, the field is empty. Please try again.");
  } 
  
  try {
    const result = await searchForImage(query, page, perPage)
if (result.total === 0) {
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } 
    renderPhoto(result.hits)
    Notiflix.Notify.success(`"Hooray! We found ${result.totalHits} images."`)
      
    if (result.totalHits < 40) {
      refs.btnLoad.classList.add('hidden')
   }


  } catch (error) {
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!')
   }
}

function refresh() {
    refs.gallery.innerHTML = ''
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
  
  refs.gallery.insertAdjacentHTML('beforeend', renderData)
  refs.btnLoad.classList.remove('hidden')
  lightbox.refresh()

  
}

refs.btnLoad.addEventListener('click', loadMore) 

async function loadMore() {
  const query = refs.form.searchQuery.value
  page +=1      
  const result = await searchForImage(query, page, perPage)
  const math = ((page - 1) * perPage) < result.totalHits
   renderPhoto(result.hits)
  if (result.totalHits<perPage*page) {
    refs.btnLoad.classList.add('hidden')
    const photoCard = refs.gallery.querySelectorAll('.photo-card')
    console.log(photoCard.length);
    return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    }

 
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
       
}
    
// !math || page === 13 || 