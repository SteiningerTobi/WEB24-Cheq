import Article from "./Article.js";

export default class Item extends Article{
    symbol;
    tags;
    completed;
    count
    static id_counter = 0;

    constructor(name, symbol, count, completed = false, tags) {
        super(name, symbol, tags);
        this.count = count;
        this.completed = completed;
    }

    setName(name){
        super.setName(name);
        this.name = name;
    }

    setItemTags(tag){
        super.setTag(tag);
        this.tags = super.tags;
    }

    getName() {
        return super.getName();
    }

    getCount(){
        return this.count;
    }

    setCount(count){
        this.count = count;
    }

    getSymbol(){
        return super.getSymbol();
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
        this.tags.push(tag);
    }

    removeTag(tagName) {
        this.tags = this.tags.filter(tag => tag.tagname !== tagName);
    }

    getTags() {
        return super.getTags();
    }
}