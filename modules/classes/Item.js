export default class Item {
    #id;
    #name;
    #symbol;
    #tags;
    completed;
    #count
    static id_counter = 0;

    constructor(name, symbol, count, completed = false) {
        this.#id = Item.id_counter++;
        this.#name = name;
        this.#count = count;
        this.#symbol = symbol;
        this.#tags = [];
        this.completed = completed;
    }

    getName() {
        return this.#name;
    }

    getCount(){
        return this.#count;
    }

    setCount(count){
        this.#count = count;
    }

    getSymbol(){
        return this.#symbol;
    }

    isCompleted() {
        return this.completed;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    setCompleted(status) {
        this.completed = status;
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