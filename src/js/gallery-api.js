import axios from 'axios'

 const BASE_URL = 'https://pixabay.com/api/';
 const API_KEY = '38875476-56470004daa575dac0a90faa7';

 
 export async function searchForImage(query) {
   const response = await axios.get(BASE_URL, {
     params: {
       key: API_KEY,
       q: query,
       image_type: 'photo',
       orientation: 'horizontal',
       safesearch: true,

     }
   });
     console.log(response.data);
   return response.data
 }