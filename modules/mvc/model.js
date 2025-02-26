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
            this.items = [];
            this.tags = [];

            for (let art of data.articles) {
                let article = new Article(art.name, art.symbol, art.tags || []);
                this.articles.push(article);
            }

            for (let t of data.tags){
                let tag = new Tag(t.tagname);
                this.tags.push(tag);
            }

            for (let l of data.lists) {
                let list = new Listing(l.name);
                list.items = [];

                if (l.items && Array.isArray(l.items)) {

                    for (let i of l.items) {

                        let article = this.articles.find(a => a.name === i.name);

                        if (!article) {
                            console.warn(`Artikel "${i.name}" nicht in articles gefunden!`);
                            continue;
                        }

                        let item = new Item(
                            article.name,
                            article.symbol,
                            i.count,
                            i.completed || false,
                            article.getTags()
                        );

                        list.addItem(item);
                        this.items.push(item);
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
        tagSelect.innerHTML = "";

        let existingTags = ["Lebensmittel", "Getränke", "Hygiene", "Obst", "Gemüse"];

        existingTags.forEach(tag => {
            let option = document.createElement("option");
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
    }

    getItemForTag(tag){
        if (!tag || tag === "all") {
            return this.articles;
        }

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

        if (!itemName) {
            alert("Bitte einen Namen für das Item eingeben.");
            return;
        }
        if (isNaN(itemCount) || itemCount < 1) {
            alert("Bitte eine gültige Anzahl eingeben.");
            return;
        }

        let articleName = document.getElementById("itemName").value;
        let existingItem = list.getItems().find(item => item.getName() === articleName);
        if (existingItem) {
            alert(`Der Artikel "${articleName}" existiert bereits in der Liste.`);
            return;
        }

        itemSymbol = itemSymbol || "🛒";

        let tagsArray = itemTags.split(",").map(tag => tag.trim());

        let existingArticle = this.articles.find(article => article.getName() === itemName);

        if (!existingArticle) {
            existingArticle = new Article(itemName, itemSymbol, tagsArray);
            this.articles.push(existingArticle);
        } else {
            console.log(`Artikel "${itemName}" existiert bereits.`);
        }

        let newItem = new Item(existingArticle.getName(), existingArticle.getSymbol(), itemCount, false, existingArticle.getTags());

        list.addItem(newItem);

        return newItem;
    }

    getNewArticleData() {
        this.populateTagSelect(this.tags);
        let articleName = document.getElementById("itemName").value.trim();
        let articleSymbol = document.getElementById("itemSymbol").value.trim();
        let articleTag = document.getElementById("itemTags").value.trim(); // Nur ein Tag erlaubt

        if (!articleName) {
            alert("⚠️ Der Artikelname darf nicht leer sein!");
            return null;
        }

        if (!articleSymbol) {
            articleSymbol = "📦";
        }

        let newArticle = new Article(articleName, articleSymbol, articleTag);
        this.articles.push(newArticle);

        return newArticle;
    }


    createItemInList(list) {
        let count = parseInt(document.getElementById("existingItemCount").value, 10);
        let articleName = document.getElementById("existingArticleSelect").value;

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

        let article = this.articles.find(art => art.name === articleName);

        if (!article) {
            alert("Fehler: Artikel nicht gefunden.");
            return;
        }

        let newItem = new Item(article.name, article.symbol, count, false, article.tags);

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

        this.articles.forEach(article => {
            let articleTagName = article.tags[0];
            if (articleTagName === oldTagName) {
                article.setTag(newTagName);
            }
        });
    }

    removeTag(tag) {
        let isTagUsedInArticles = this.articles.some(article => article.tags[0] === tag.tagname);

        if (isTagUsedInArticles) {
            return false;
        }

        this.tags = this.tags.filter(t => t !== tag);

        return true;
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



