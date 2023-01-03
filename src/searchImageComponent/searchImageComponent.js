import '../css/searchImageComponent.css';
import ContentComponent from '../contentComponent/contentComponent.js';

class SearchImage extends ContentComponent {
  constructor() {
    super();
    this.render();
  }

  async getImages(dogBreed) {
    dogBreed = dogBreed.split(' ');
    let urlString;
    if (dogBreed.length === 1) {
      urlString = `https://dog.ceo/api/breed/${dogBreed[0]}/images`;
    } else if (dogBreed.length === 2) {
      urlString = `https://dog.ceo/api/breed/${dogBreed[1]}/${dogBreed[0]}/images`;
    }
    const response = await fetch(urlString);
    if (response.status === 404) {
      return;
    }
    if (!response.ok) {
      throw new Error('API response error');
    }
    const data = await response.json();
    return data.message;
  }

  displayImage(imageList) {
    const image = document.createElement('img');
    image.src = imageList[Math.floor(Math.random() * imageList.length)];
    this.clearErrors();
    document.querySelector('#content').appendChild(image);
  }

  render() {
    const markup = `
    <form class="dog-search">
      <span class="search-icon"></span>
      <input type="text" id="dogSearchInput">
      <input type="text" id="imageNumberInput" placeholder="1">
      <button type="submit">Search</button>
    </form>
    `;
    document.querySelector('#header').insertAdjacentHTML('beforeend', markup);
    document.querySelector('.dog-search button').addEventListener('click', (event) => {
      // megakadályozzuk a form küldését
      event.preventDefault();
      const searchTerm = document.querySelector('#dogSearchInput').value;
      const count = Number(document.querySelector('#imageNumberInput').value);

      if (!searchTerm) {
        this.displayError('Please enter a search term');
        return;
      }

      this.clearContent();
      //checks if count isNaN or can be looped
      if (isNaN(count) == false && Math.floor(count) > 0) {
        console.log('Int vagy kerekitett érték ', Math.floor(count));
        for (let i = 0; i < Math.floor(count); i++) {
          this.getImages(searchTerm.toLowerCase())
            .then((imageList) => {
              if (imageList) {
                this.displayImage(imageList);
              } else {
                this.displayError('Breed not found. Please try to list the breeds first.');
              }
            })
            .catch((error) => {
              this.displayError('Something went wrong. Please try again later.');
              console.error(error);
            });
        }
      } else {
        console.log('Fallback 1x futásra (pl. NaN/negativ érték) ', typeof count, count);
        this.getImages(searchTerm.toLowerCase())
          .then((imageList) => {
            if (imageList) {
              this.displayImage(imageList);
            } else {
              this.displayError('Breed not found. Please try to list the breeds first.');
            }
          })
          .catch((error) => {
            this.displayError('Something went wrong. Please try again later.');
            console.error(error);
          });
      }
      /*  this.getImages(searchTerm.toLowerCase())
        .then((imageList) => {
          if (imageList) {
            this.displayImage(imageList);
          } else {
            this.displayError('Breed not found. Please try to list the breeds first.');
          }
        })
        .catch((error) => {
          this.displayError('Something went wrong. Please try again later.');
          console.error(error);
        }); */
    });
  }
}

export default SearchImage;
