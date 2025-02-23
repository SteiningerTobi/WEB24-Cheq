export default class Item {
    #id;
    #name;
    #symbol;
    #tags;
    static id_counter = 0;

    constructor(name, symbol) {
        this.#id = Item.id_counter++;
        this.#name = name;
        this.#symbol = symbol;
        this.#tags = [];
    }

    getName() {
        return this.#name;
    }

    addTag(tag) {
        this.#tags.push(tag);
    }

    removeTag(tagName) {
        this.#tags = this.#tags.filter(tag => tag.tagname !== tagName);
    }

    getTags() {
        return this.#tags;
    }
}