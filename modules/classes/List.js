export default class Listing {
    #id;
    #name;
    #completed;
    items;
    static id_counter = 1;

    constructor(name) {
        this.#id = Listing.id_counter++;
        this.#name = name;
        this.items = [];
        this.#completed = false;
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    toggleCompleted() {
        this.#completed = !this.#completed;
    }

    getItems() {
        return this.items;
    }

    getName (){
        return this.#name;
    }
}