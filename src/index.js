import { refs } from "./JS/refs";
import { PixabayApi } from "./JS/pixabayAPI";
import SimpleLightbox from "simplelightbox";
import { Notify } from "notiflix";

const pixabay = new PixabayApi();

const lightbox = new SimpleLightbox('.gallery a', {
        captionType: 'attr',
        captionsData: 'alt',
        captionDeley: 250,
        fadeSpeed: 250,
    });

const handleSubmit = event => {
    event.preventDefault();
    const { elements: { searchQuery } } = event.currentTarget
    const search = searchQuery.value.trim().toLowerCase();
    if (!search) {
        return
    }
    pixabay.query = search;
    clearPage();
    pixabay.getPhotos().then(({ hits, total }) => {
        if (total === 0) {
            Notify.info('Sorry, there are no images mutching your search query. Please try again.')
            return
        }
        const markup = createMarkup(hits);
        console.log(markup);
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        pixabay.calculateTotalPages(total);
        Notify.success(`Hooray, we found ${total} images`)

        if (pixabay.isShowLoadMore) {
            refs.loadMoreBTN.classList.remove('is-hidden')
        }
    }).catch(error => {
        Notify.failure(error.message, "Щось пішло не так")
        clearPage();
    })

    
}

refs.searchForm.addEventListener('submit', handleSubmit);

function createMarkup(photos) {
    return photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                    <a class="gallery__item" href="${largeImageURL}">
                        <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    </a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b><br>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b><br>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b><br>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b><br>${downloads}
                        </p>
                    </div>
                </div>`;
    }).join('')
}

const onLoadMore = () => {
    pixabay.incrementPage();
    if (!pixabay.isShowLoadMore) {
        refs.loadMoreBTN.classList.add('is-hidden')
        Notify.info("We're sorry, but you've reached the end of search resalt")
        }
    pixabay.getPhotos().then(({ hits }) => {
        const markup = createMarkup(hits);
        console.log(markup);
        refs.gallery.insertAdjacentHTML('beforeend', markup)
    }).catch(error => {
        Notify.failure(error.message, "Щось пішло не так")
        clearPage();
    })
}

refs.loadMoreBTN.addEventListener('click', onLoadMore);

function clearPage() {
    pixabay.resetPage();
    refs.gallery.innerHTML = '';
    refs.loadMoreBTN.classList.add('is-hidden')
}



