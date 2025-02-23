export default class ListItem {
    #itemId;
    #quantity;
    #completed;

    constructor(itemId, quantity = 1, completed = false) {
        this.#itemId = itemId;
        this.#quantity = quantity;
        this.#completed = completed;
    }

    getItemId() {
        return this.#itemId;
    }

    getQuantity() {
        return this.#quantity;
    }

    setQuantity(quantity) {
        this.#quantity = quantity;
    }

    toggleCompleted() {
        this.#completed = !this.#completed;
    }

    isCompleted() {
        return this.#completed;
    }
}