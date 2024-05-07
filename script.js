const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-btn');
const dogImagesContainer = document.getElementById('dog-images');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const currentPageElement = document.getElementById('current-page');

let currentPage = 1;
const itemsPerPage = 3;

const apiKey = 'live_pdbmEdCgzbEQwYleoHj16OSdp8c1kF6y10eO54zTAUnWBoP2HPyPeHhL8bUNkoDC';
const baseUrl = 'https://api.thedogapi.com/v1/breeds/search';

async function searchDogs(searchTerm) {
  const response = await fetch(`${baseUrl}?q=${searchTerm}`, {
    headers: {
      'x-api-key': apiKey
    }
  });
  const breeds = await response.json();
//  console.log(breeds);
  let dogData = [];
  for (const breed of breeds) {
    const breedId = breed.id;
    const searchUrl = `https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`;

    try {
      const response = await fetch(searchUrl, {
        headers: {
          'x-api-key': apiKey
        }
      });
      const dogImages = await response.json();
      dogData = dogData.concat(dogImages);  
    } catch (error) {
      console.error('Error fetching images for breed', breed.name, error);
     
    }
  }

  displayDogs(dogData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
}

function displayDogs(data) {
  dogImagesContainer.innerHTML = '';
  data.forEach(dog => {
    const image = document.createElement('img');
    image.src = dog.url;
    dogImagesContainer.appendChild(image);
  });

  updatePaginationButtons(data.length);
}

function updatePaginationButtons(dataLength) {
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage >= Math.ceil(dataLength / itemsPerPage);
}


searchButton.addEventListener('click', () => {
  currentPage = 1;
  searchDogs(searchBar.value);
});

prevButton.addEventListener('click', () => {
  currentPage--;
  searchDogs(searchBar.value);
});

nextButton.addEventListener('click', () => {
  currentPage++;
  searchDogs(searchBar.value);
});