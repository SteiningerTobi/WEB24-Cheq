import Listing from "../classes/List.js";
import Item from "../classes/Item.js";
import Article from "../classes/Article.js";
import Tag from "../classes/Tag.js";
import Subject from "./subject.js";
export class CheqModel extends Subject{
    constructor() {
        super();
        this.lists = [];
        this.articles = [];
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

            this.lists = [];
            this.articles = [];
            this.items = []; // Alle Items speichern
            this.tags = [];

            // 🔹 **Artikel aus JSON laden**
            for (let art of data.articles) {
                let article = new Article(art.name, art.symbol, art.tags || []);
                this.articles.push(article);
            }

            for (let t of data.tags){
                let tag = new Tag(t.tagname);
                this.tags.push(tag);
            }

            // 🔹 **Listen und ihre Items laden**
            for (let l of data.lists) {
                let list = new Listing(l.name);
                list.items = []; // ✅ Sicherstellen, dass jede Liste ein leeres Items-Array hat

                if (l.items && Array.isArray(l.items)) {

                    for (let i of l.items) {

                        // ✅ **Artikel nach Namen suchen**
                        let article = this.articles.find(a => a.name === i.name);

                        if (!article) {
                            console.warn(`Artikel "${i.name}" nicht in articles gefunden!`);
                            continue; // Falls Artikel nicht existiert, überspringen
                        }

                        // ✅ **Item aus Artikel erstellen**
                        let item = new Item(
                            article.name,
                            article.symbol,
                            i.count,
                            i.completed || false,
                            article.getTags()
                        );

                        // ✅ **Item zur Liste hinzufügen**
                        list.addItem(item);
                        this.items.push(item); // Speichert alle Items separat
                    }
                } else {
                    console.warn(`Keine Items für Liste "${l.name}" gefunden oder nicht als Array definiert.`);
                }
                this.lists.push(list);
            }
        } catch (err) {
            console.error("Fehler beim Laden der Listen und Artikel:", err);
        }
        this.notify("dataLoaded", { lists: this.lists, articles: this.articles });
    }

    removeItem(list, item){

        list.removeItem(item.name)
    }

    populateTagSelect(){
        let tagSelect = document.getElementById("itemTags");
        tagSelect.innerHTML = ""; // Vorherige Optionen entfernen

        let existingTags = ["Lebensmittel", "Getränke", "Hygiene", "Obst", "Gemüse"]; // Beispiel-Tags, aus Model holen!

        existingTags.forEach(tag => {
            let option = document.createElement("option");
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
    }

    getItemForTag(tag){
        // 🔹 Falls kein Tag übergeben wird, alle Artikel zurückgeben
        if (!tag || tag === "all") {
            return this.articles;
        }

        // 🔹 Filtert alle Artikel, die den angegebenen Tag enthalten
        let filteredArticles = this.articles.filter(article =>
            article.tags && article.tags.includes(tag)
        );

        return filteredArticles;
    }

    changeArticleName(item, newArticleName){
        item.setName(newArticleName);
    }

    getNewItemData(list) {
        const itemName = document.getElementById("itemName").value.trim();
        let itemSymbol = document.getElementById("itemSymbol").value.trim();
        const itemCount = parseInt(document.getElementById("itemCount").value, 10);
        const itemTags = document.getElementById("itemTags").value;

        // 🔹 **Validierung der Eingabewerte**
        if (!itemName) {
            alert("Bitte einen Namen für das Item eingeben.");
            return;
        }
        if (isNaN(itemCount) || itemCount < 1) {
            alert("Bitte eine gültige Anzahl eingeben.");
            return;
        }

        // 🔹 Prüfen, ob der Artikel bereits als Item in der Liste existiert
        let articleName = document.getElementById("itemName").value;
        let existingItem = list.getItems().find(item => item.getName() === articleName);
        if (existingItem) {
            alert(`Der Artikel "${articleName}" existiert bereits in der Liste.`);
            return;
        }

        // 🔹 **Falls kein Symbol gewählt wurde, Standard-Emoji setzen**
        itemSymbol = itemSymbol || "🛒";

        // 🔹 **Tags in Array umwandeln**
        let tagsArray = itemTags.split(",").map(tag => tag.trim());

        // 🔹 **Prüfen, ob der Artikel bereits existiert**
        let existingArticle = this.articles.find(article => article.getName() === itemName);

        if (!existingArticle) {
            // 🔹 **Neuen Artikel erstellen**
            existingArticle = new Article(itemName, itemSymbol, tagsArray);
            this.articles.push(existingArticle);
        } else {
            console.log(`Artikel "${itemName}" existiert bereits.`);
        }

        // 🔹 **Neues Item aus dem Artikel erstellen**
        let newItem = new Item(existingArticle.getName(), existingArticle.getSymbol(), itemCount, false, existingArticle.getTags());

        // 🔹 **Item zur Liste hinzufügen**
        list.addItem(newItem);

        return newItem; // Optional, falls UI darauf reagieren soll
    }

    getNewArticleData() {
        this.populateTagSelect(this.tags);
        let articleName = document.getElementById("itemName").value.trim();
        let articleSymbol = document.getElementById("itemSymbol").value.trim();
        let articleTag = document.getElementById("itemTags").value.trim(); // Nur ein Tag erlaubt

        // 🔹 Validierung: Name darf nicht leer sein
        if (!articleName) {
            alert("⚠️ Der Artikelname darf nicht leer sein!");
            return null;
        }

        // 🔹 Standardwert setzen, falls kein Symbol angegeben ist
        if (!articleSymbol) {
            articleSymbol = "📦"; // Standard-Icon
        }

        // 🔹 Neuen Artikel erstellen
        let newArticle = new Article(articleName, articleSymbol, articleTag);
        this.articles.push(newArticle);

        return newArticle;
    }


    createItemInList(list) {
        // 🔹 Werte aus dem Modal abrufen
        let count = parseInt(document.getElementById("existingItemCount").value, 10);
        let articleName = document.getElementById("existingArticleSelect").value;

        // 🔹 Validierung der Eingaben
        if (!articleName) {
            alert("Bitte einen Artikel auswählen.");
            return;
        }
        if (isNaN(count) || count < 1) {
            alert("Bitte eine gültige Anzahl eingeben.");
            return;
        }

        let existingItem = list.getItems().find(item => item.getName() === articleName);
        if (existingItem) {
            alert(`Der Artikel "${articleName}" existiert bereits in der Liste.`);
            return;
        }

        // 🔹 Den Artikel anhand des Namens in der Artikelliste suchen
        let article = this.articles.find(art => art.name === articleName);

        if (!article) {
            alert("Fehler: Artikel nicht gefunden.");
            return;
        }

        // 🔹 Neues Item aus dem Artikel erstellen
        let newItem = new Item(article.name, article.symbol, count, false, article.tags);

        // 🔹 Item zur entsprechenden Liste hinzufügen
        list.addItem(newItem);
        list.openList();

    }

    setTagName(tag, newTagName, oldTagName) {
        newTagName = newTagName.trim();

        if (!tag || typeof newTagName !== "string" || newTagName === "") {
            console.error("Fehler: Ungültiger Tag oder leerer neuer Name.");
            return;
        }

        tag.tagname = newTagName;

        // **Artikel aktualisieren, die diesen Tag verwenden**
        this.articles.forEach(article => {
            let articleTagName = article.tags[0];
            if (articleTagName === oldTagName) {
                article.setTag(newTagName);  // 🔄 Tag updaten
            }
        });
    }

    removeTag(tag) {
        // **Prüfen, ob der Tag in Artikeln verwendet wird**
        let isTagUsedInArticles = this.articles.some(article => article.tags[0] === tag.tagname);

        if (isTagUsedInArticles) {
            return false; // ❌ Tag ist noch in Benutzung
        }

        // **Tag aus dem Modell entfernen**
        this.tags = this.tags.filter(t => t !== tag);

        return true; // ✅ Tag erfolgreich gelöscht
    }

    deleteArticle(item) {
        if (!item) {
            console.error("❌ Fehler: Ungültiger Artikel.");
            return;
        }

        // Prüfen, ob der Artikel in einer Liste vorkommt
        let isUsed = this.lists.some(list =>
            list.getItems().some(listItem => listItem.getName() === item.getName())
        );

        if (isUsed) {
            alert("⚠️ Artikel kann nicht gelöscht werden, da er in einer Liste verwendet wird.");
            return;
        }

        // Artikel aus der Artikelliste entfernen
        let index = this.articles.findIndex(article => article.getName() === item.getName());
        if (index !== -1) {
            this.articles.splice(index, 1);
            this.notify("articleDeleted", item);
        } else {
            console.warn("⚠️ Artikel nicht gefunden.");
        }
    }

    addTag(tagname){
        let newTag = new Tag(`${tagname}`);
        this.tags.push(newTag);
    }

    changeTag(item, tagname){
        item.setTag(tagname);
    }

    addList(name) {
        const newList = new Listing(name);
        this.lists.push(newList);
        this.notify("listAdded", newList);
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



