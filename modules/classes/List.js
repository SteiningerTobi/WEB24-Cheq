export default class Listing {
    #id;
    #name;
    completed;
    items;
    users;
    static id_counter = 1;

    constructor(name) {
        this.#id = Listing.id_counter++;
        this.#name = name;
        this.items = [];
        this.completed = false;
        this.users = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    setListName(name){
        this.#name = name;
    }

    removeItem(itemName) {
        this.items = this.items.filter(item => item.getName() !== itemName);
    }


    completeList() {
        this.completed = true;
    }

    isCompleted(){
        for (let i = 0; i < this.items.length; i++){
            let x = this.items[i];
            if (x.completed === false){
                return false;
            }
        }
        return true;
    }

    openList() {
        this.completed = false;
    }

    getItems() {
        return this.items;
    }

    getName (){
        return this.#name;
    }
}