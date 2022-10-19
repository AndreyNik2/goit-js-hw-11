import { refs } from "./JS/refs";
import { PixabayApi } from "./JS/pixabayAPI";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from "notiflix";
import { createMarkup } from "./JS/creatamarkup";

const pixabay = new PixabayApi();

const handleSubmit = async event => {
    event.preventDefault();
    const { elements: { searchQuery } } = event.currentTarget
    const search = searchQuery.value.trim().toLowerCase();
    if (!search) {
        return
    }
    pixabay.query = search;
    clearPage();

    try {
        const { hits, total } = await pixabay.getPhotos();
        if (total === 0) {
            Notify.info('Sorry, there are no images mutching your search query. Please try again.')
            return
        }
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
        pixabay.calculateTotalPages(total);
        Notify.success(`Hooray, we found ${total} images`)

        if (pixabay.isShowLoadMore) {
            refs.loadMoreBTN.classList.remove('is-hidden')
        }
    } catch (error) {
        Notify.failure(error.message, "Щось пішло не так")
        clearPage();
    }
}

refs.searchForm.addEventListener('submit', handleSubmit);



const onLoadMore = async () => {
    pixabay.incrementPage();
    if (!pixabay.isShowLoadMore) {
        refs.loadMoreBTN.classList.add('is-hidden')
        Notify.info("We're sorry, but you've reached the end of search resalt")
    }
    
    try {
        const { hits } = await pixabay.getPhotos();
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup)
        lightbox.refresh();
    } catch (error) {
        Notify.failure(error.message, "Щось пішло не так")
        clearPage();
    }
}

refs.loadMoreBTN.addEventListener('click', onLoadMore);

function clearPage() {
    pixabay.resetPage();
    refs.gallery.innerHTML = '';
    refs.loadMoreBTN.classList.add('is-hidden')
}

const lightbox = new SimpleLightbox('.gallery a', {
        captionType: 'attr',
        captionsData: 'alt',
        captionDeley: 250,
        fadeSpeed: 250,
});



