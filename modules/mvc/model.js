/*
import Listing from "../classes/List.js";
import Item from "../classes/Item.js";
import ListItem from "../classes/ListItem.js";
import Tag from "../classes/Tag.js";
import User from "../classes/User.js";
*/



import Listing from "../classes/List.js";
import Item from "../classes/Item.js";
import Tag from "../classes/Tag.js";
import User from "../classes/User.js";

export class CheqModel {
    constructor() {
        this.lists = [];
        this.items = [];
        this.tags = [];
        this.users = [];
    }

    async loadFromJson() {
        try {
            const response = await fetch("./modules/mvc/lists.json"); // JSON-Datei laden

            if (!response.ok) {
                throw new Error(`HTTP-Fehler: ${response.status}`);
            }

            const data = await response.json();
            console.log("Geladene JSON-Daten:", data);

            this.lists = []; // Listen-Array initialisieren

            for (let l of data.lists) {
                let list = new Listing(l.name);

                // Falls Items vorhanden sind, füge sie zur Liste hinzu
                if (l.items) {
                    for (let i of l.items) {
                        let item = new Item(i.name, i.symbol, i.count);
                        list.addItem(item); // Sicherstellen, dass `addItem()` existiert!
                    }
                }

                this.lists.push(list); // Liste speichern
            }

            console.log("Alle Listen geladen:", this.lists);
        } catch (err) {
            console.error("Fehler beim Laden der Listen:", err);
        }
    }

    getLists(){
        return this.lists;
    }

    getListByID (id) {
        if (this.lists[id] !== null){
            let list = this.lists[id];
            return list;
        }
        else alert("Keine Liste gefunden")
    }

    getNewName(list){
        let editingInput = document.getElementById("editingInput");
        let editBtn = document.getElementById("editBtn");
        editBtn.addEventListener("click", () => {
            let newVal = editingInput.value;
            if (newVal === "") {
                alert("Bitte neuen Namen eingeben!");
            }
            else {
                list.setListName(newVal)
            }
        });
    }

    addList(name) {
        const newList = new Listing(name);
        this.lists.push(newList);
    }

    editList(list) {
        let editingInput = document.getElementById("editingInput");
        let editBtn = document.getElementById("editBtn");
        editBtn.addEventListener("click", () => {
            let newVal = editingInput.value;
            if (editingInput.value === "") {
                alert("Bitte neuen Namen eingeben!");
            }
            list.setListName(newVal);
        });
    }

    addListe(name) {
        let newListing = new Listing(name);
        this.lists.push(newListing);
    }

    setListOpen(list){
        list.openList();
    }
}


/*
export class CheqModel {
    constructor() {
        this.lists = [];
        this.items = [];
        this.tags = [];
        this.users = [];
        this.listitems= [];
    }

    addListing(name){
        const newList = new Listing(name);
        this.lists.push(newList);
    }

    async loadFromJson() {
        try {
            const response = await fetch("./modules/mvc/lists.json"); // JSON-Datei laden
            if (!response.ok) {
                throw new Error(`HTTP-Fehler: ${response.status}`);
            }

            const data = await response.json();
            console.log("Geladene JSON-Daten:", data);

            this.lists = new Map(); // Map für Listen initialisieren

            for (let l of data.lists) {
                let list = new Listing(l.name);
                this.lists.set(list.name, list); // Map-Objekt füllt Listen nach Name

                // Items zur Liste hinzufügen
                for (let i of l.items) {
                    let item = new Item(i.name, i.symbol);
                    list.addItem(item);
                }
            }

            console.log("Alle Listen geladen:", this.lists);
        } catch (err) {
            console.error("Fehler beim Laden der Listen:", err);
        }
    }



    //async loadFromJson() {

        //const response = await fetch("./lists.json");
        //const listData = await response.json();
        //this.lists = listData.map(list => new Listing(list.name));
        //this.items = listData.map(item => new Item(item.name, item.items));
    }

    /*async loadFromJson000() {
        try {
            // JSON-Datei abrufen
            const response = await fetch("../../lists.json");
            if (!response.ok) {
                throw new Error(`HTTP-Fehler: ${response.status}`);
            }

            const data = await response.json();

            // Listen-Daten verarbeiten
            this.lists = data.lists.map(list => {
                const newList = new Listing(list.name);
                newList.id = list.id; // Falls IDs aus JSON benötigt werden
                newList.completed = list.completed || false;

                // Items der Liste hinzufügen
                if (list.items) {
                    list.items.forEach(itemId => {
                        const item = this.items.find(it => it.id === itemId);
                        if (item) {
                            newList.addItem(item);
                        }
                    });
                }

                return newList;
            });

            // Items-Daten verarbeiten
            this.items = data.items.map(item => new Item(item.id, item.name, item.symbol));

            // Tags verarbeiten
            this.tags = data.tags.map(tag => new Tag(tag.tagname));

            // Benutzer verarbeiten
            this.users = data.users.map(user => {
                const newUser = new User(user.username, user.userid, user.userStatus);

                // Listen zu Benutzern zuweisen
                user.lists.forEach(listId => {
                    const userList = this.lists.find(l => l.id === listId);
                    if (userList) {
                        newUser.addList(userList);
                    }
                });

                return newUser;
            });

            console.log("Daten erfolgreich geladen:", this);
        } catch (error) {
            console.error("Fehler beim Laden der JSON-Daten:", error);
        }
    }*/
/*

    async loadLists() {
        document.addEventListener("DOMContentLoaded", () => {

        });
        //const response = await fetch("shopping_data.json")
        //const response = await fetch("/lists.json");
          //  .then((response) => response.json())
            //.then((data) => {
              //  console.log(data);
                //for (let p of data.lists) {
               //     let Listing = new Listing(data.list.name);
                //}
                /*for (let g of data.groups) {
                    let group = new Group(g);
                    this.#contactList.set(group.id, group); //.set weil es eine Map is, wenn Array wäre dann würde .push stehen
                    this.#addMessageToContact(group, g, true);
                    for (let memberId of g.members) {
                        if (memberId != this.#ownId) {
                            let c = this.#contactList.get(memberId);
                            if (c) {
                                group.addContact(c);
                                c.addGroup(group);
                            }
                        }
                    }
                }*/
                //const listData = await response.json();
                //this.lists = listData.map(list => new Listing(list.id, list.name));

//    }
/*

    addList(name) {
        let newListing = new Listing(name);
        this.lists.push(newListing);
    }

    //this.items = listData.map(item => new Item(item.id, item.name, item.symbols))
}

*/



