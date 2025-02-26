export default class User {
    #username;
    #userid;
    #userStatus;
    #lists;

    constructor(username, userid, userStatus = 0) {
        this.#userid = userid;
        this.#userStatus = userStatus;
        this.#username = username;
        this.#lists = [];
    }

    addList(list) {
        this.#lists.push(list);
    }

    removeList(listId) {
        this.#lists = this.#lists.filter(list => list.id !== listId);
    }

    getLists() {
        return this.#lists;
    }

    getUserPerList(list){
        let listname = list.name;
    }
}