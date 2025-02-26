export default class Tag {
    tagname;

    constructor(tagname) {
        this.tagname = tagname;
    }

    getTagName() {
        return this.tagname;
    }

    setNewTagName(name){
        this.name = name;
    }
}