export default class Article {
    id;
    name;
    symbol;
    tags;
    static id_counter = 0;

    constructor(name, symbol, tags) {
        this.id = Article.id_counter++;
        this.name = name;
        this.symbol = symbol;
        this.tags = tags;
    }

    setName(name){
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getSymbol() {
        return this.symbol;
    }

    setTag(newTag) {
        console.log(`🛠 Artikel: Tag geändert auf "${newTag}"`);
        this.tags[0] = newTag;
        console.log(newTag);
        console.log(this.tags[0])
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    removeTag(tagName) {
        this.tags = this.tags.filter(tag => tag.tagname !== tagName);
    }

    getTags() {
        return this.tags;
    }

}
