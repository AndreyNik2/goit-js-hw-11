import { Notify } from "notiflix";
import axios from 'axios';

export class PixabayApi{
    #perPege = 40;
    #page = 1;
    #totalPages = 0;
    #guery = '';
    #key = '30639478-19eb6c69dd958be70fa1abe06'
    


    async getPhotos(search) {
        const url = `https://pixabay.com/api/?key=${this.#key}&q=${this.#guery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.#perPege}&page=${this.#page}`;
        const {data} = await axios.get(url);
        return data
        // return fetch(url).then(response => {
        //     if (!response.ok) {
        //     throw new Error(response.status);
        //     }
        //     return response.json();
        // });
    }

    incrementPage() {
        this.#page += 1;
    }

    set query(newQuery) {
        this.#guery = newQuery;
    }


    get query() {
        return this.#guery;
    }

    resetPage() {
        this.#page = 1;
    }

    calculateTotalPages(total) {
        this.#totalPages = Math.ceil(total / this.#perPege);
    }

    get isShowLoadMore() {
        return this.#page < this.#totalPages;
    }

}
