export function createMarkup(photos) {
    return photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                    <a class="gallery__item" href="${largeImageURL}">
                        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
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