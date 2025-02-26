import { ListView } from "./listview.js";
import { ItemView} from "./articleview.js";
import { CheqModel } from "./model.js";
import {TagView} from "./tagview.js";

class CheqController {
    constructor() {
        this.listView = new ListView;
        this.itemView = new ItemView;
        this.tagView = new TagView;
        this.model = new CheqModel;

        this.model.addObserver(this.listView);
        this.model.addObserver(this.itemView);
        this.model.addObserver(this.tagView);

        document.getElementById("createList").onclick = this.createList.bind(this);
        let listTabBtn = document.querySelector(".listtab");
        listTabBtn.addEventListener("click", () => {
            cheqlistController.openListTab();
        });
        let itemTabBtn = document.querySelector(".itemtab");
        itemTabBtn.addEventListener("click", () => {
            cheqlistController.openItemTab();
        })
        let userTabBtn = document.querySelector(".usertab");
        userTabBtn.addEventListener("click", () => {
            alert("Dieser Bereich ist noch nicht verfügbar")
        })
        let tagTabBtn = document.querySelector(".tagstab");
        tagTabBtn.addEventListener("click", () => {
            cheqlistController.openTagTab();
        })
        let logo = document.querySelector(".bi-person-circle");
        logo.addEventListener("click", () => {
            alert("Dieser Bereich ist noch nicht verfügbar")
        })

        let newArticleBtn = document.querySelector(".newArticleBtn");
        newArticleBtn.addEventListener("click", () => {
            cheqlistController.populateTagSelect();
        })

        if (newArticleBtn) {
            newArticleBtn.addEventListener("click", function (event) {
                event.preventDefault(); // Verhindert unerwünschtes Verhalten

                // Modal "Vorhandenen Artikel hinzufügen" schließen
                let existingItemModal = bootstrap.Modal.getInstance(document.getElementById("addExistingItemModal"));
                if (existingItemModal) {
                    existingItemModal.hide();
                }

                // Modal "Neuen Artikel erstellen" öffnen
                let newItemModal = new bootstrap.Modal(document.getElementById("addItemModal"), { backdrop: "static" });
                newItemModal.show();
            });
        }
    }

    deleteArticle(item, items){
        this.model.deleteArticle(item);
        this.itemView.renderArticles(items);
    }

    editList(list){
        this.listView.renderListEditing();

        // Sicherstellen, dass der Button vorhanden ist
        let editBtn = document.getElementById("editBtn");
        let editingInput = document.getElementById("editingInput");

        if (!editBtn || !editingInput) {
            console.error("Edit-Modal UI-Elemente nicht gefunden!");
            return;
        }

        // Click-Listener setzen
        editBtn.onclick = () => {
            let newVal = editingInput.value.trim();
            if (newVal === "") {
                alert("Bitte neuen Namen eingeben!");
                return;
            }

            // Name in der Model-Liste ändern
            list.setListName(newVal);

            // UI aktualisieren
            this.updateListsView();

            // Klick auf die geänderte Liste simulieren
            this.simulateClickOnList(list);
        };
    }

    closeList(list){
        for (let i = 0; i < list.items.length; i++){
            let ilist = list.items[i];
            if (!ilist.isCompleted()){
                alert("Es sind noch Einkäufe in der Liste offen!")
                return
            }
        }
        list.completeList();
        this.updateListsView();
        this.simulateClickOnList(list);
    }

    openList(list){
        list.openList();
        this.updateListsView();
        this.simulateClickOnList(list);
        this.listView.renderListDetails(list);
    }

    openListTab(){
        let tabs = document.querySelectorAll(".activeTab");
        for (let tab of tabs){
            tab.classList.remove("activeTab");
        }
        let listTab = document.querySelector(".listtab");
        listTab.classList.add("activeTab");

        let currentList = document.querySelector(".activeList");
        this.updateListsView();
        this.listView.renderEmptyListDetails()
    }

    openItemTab(){
        let tabs = document.querySelectorAll(".activeTab");
        for (let tab of tabs){
            tab.classList.remove("activeTab");
        }
        let itemTab = document.querySelector(".itemtab");
        itemTab.classList.add("activeTab");
        this.updateItemView();
    }

    changeArticleName(item, newArticleName, items) {
        this.model.changeArticleName(item, newArticleName);
        this.itemView.renderArticles(items);
    }

    addTag(nameOfNewTag){
        this.model.addTag(nameOfNewTag);
        this.tagView.renderTags(this.model.tags);
    }

    changeTagOfItem(item, newTag, items){
        this.model.changeTag(item, newTag);
        this.itemView.renderArticles(items)
    }

    updateItemView(){
        this.itemView.renderArticles(this.model.articles);
        this.itemView.renderArticleMenu();
    }

    simulateClickOnList(list) {
        setTimeout(() => {
            let listElements = document.querySelectorAll(".list");
            let targetList = [...listElements].find(el => el.textContent.trim() === list.getName());

            if (targetList) {
                targetList.click();
            } else {
                console.warn("Liste nicht gefunden:", list.getName());
            }
        }, 100); // Kleiner Timeout für das UI-Update
    }

    openTagTab(){
        let tabs = document.querySelectorAll(".activeTab");
        for (let tab of tabs){
            tab.classList.remove("activeTab");
        }
        let tagTab = document.querySelector(".tagstab");
        tagTab.classList.add("activeTab")
        this.tagView.renderTagMenu();
        this.tagView.renderTags(this.model.tags);
    }

    changeTagName(tag, newTagName, oldTagName) {
        newTagName = newTagName.trim();

        if (!tag || typeof newTagName !== "string" || newTagName === "") {
            console.error("Fehler: Ungültiger Tag oder leerer neuer Name.", newTagName);
            alert("⚠️ Tag-Name darf nicht leer sein!");
            return;
        }

        // **Prüfen, ob der Name bereits existiert**
        let existingTag = this.model.tags.find(t => t.tagname.toLowerCase() === newTagName.toLowerCase());
        if (existingTag) {
            alert("Dieser Tag-Name existiert bereits!");
            return;
        }

        this.model.setTagName(tag, newTagName, oldTagName);
        this.tagView.renderTags(this.model.tags);
    }

    deleteTag(tag) {
        if (!tag) {
            console.error("Fehler: Kein Tag zum Löschen angegeben.");
            return;
        }

        // **Tag nur löschen, wenn er nirgends verwendet wird**
        let success = this.model.removeTag(tag);

        if (!success) {
            alert(`⚠️ Der Tag "${tag.tagname}" wird noch verwendet und kann nicht gelöscht werden!`);
            return;
        }

        // **Ansicht aktualisieren**
        this.tagView.renderTags(this.model.tags);
    }

    async initCheq() {
        await this.model.loadFromJson();
        this.updateListsView();
        this.listView.renderEmptyListDetails();
        let listTab = document.querySelector(".listtab");
        listTab.classList.add("activeTab");
    }

    updateListsView() {
        this.listView.renderLists(this.model.lists);
        let mainHeader = document.getElementById("mainSectHeader");
        mainHeader.innerHTML = "";
        mainHeader.innerHTML = "Aktuelle Liste";
    }

    filterBy(filterTag){
        let filterArticles = this.model.getItemForTag(filterTag);
        this.itemView.renderArticles(filterArticles)
    }

    addArticleToModel(){
        this.listView.initializeEmojiPicker();
        let confirmNewArticle = document.getElementById("confirmAddItem");

        // Verhindert mehrfaches Hinzufügen von Event-Listenern
        confirmNewArticle.replaceWith(confirmNewArticle.cloneNode(true));
        confirmNewArticle = document.getElementById("confirmAddItem");

        this.populateTagSelect();

        confirmNewArticle.addEventListener("click", () => {
            let newArticle = this.model.getNewArticleData();
            this.itemView.renderArticles(this.model.articles);
        });
    }

    addItemToList(list) {
        this.listView.renderAddExistingItemModal(list, this.model.articles);
        this.listView.initializeEmojiPicker();
        let confirmNewArticle = document.getElementById("confirmAddItem");


        // Verhindert mehrfaches Hinzufügen von Event-Listenern
        confirmNewArticle.replaceWith(confirmNewArticle.cloneNode(true));
        confirmNewArticle = document.getElementById("confirmAddItem");

        confirmNewArticle.addEventListener("click", () => {
            let newItem = this.model.getNewItemData(list);

            if (newItem) {
                list.openList();
                this.updateListsView();  // UI aktualisieren
                this.simulateClickOnList(list); // Liste erneut auswählen
            } else {
                console.warn("⚠️ Kein Item hinzugefügt.");
            }
        });
    }

    addExistingItemToList(list){
        this.model.createItemInList(list);
        this.listView.renderLists(this.model.lists);
        this.simulateClickOnList(list);
    }


    removeItemFromList(list, item){
        this.model.removeItem(list, item);
        this.updateListsView();
        this.listView.renderListDetails(list);
    }

    createList(){
        let nameInput = document.querySelector("#listNameInput");
        let listName = nameInput.value.trim();

        if (listName === "") {
            alert("Bitte einen Namen eingeben!");
        } else {
            this.model.addList(listName);
            nameInput.value = "";
            this.listView.renderLists(this.model.lists);
        }
    }

    findArticle(list, item) {
        let name = item.name;
        let article = this.model.articles.find(article => article.getName() === name);

        if (!article) {
            console.warn(`Artikel "${name}" nicht in der globalen Artikelliste gefunden!`);
            return null;
        }
        return article;
    }

    async getConfirmation() {
        this.listView.renderConfirmationModal();

        let confirmModal = document.getElementById("confirmModal");
        let modalInstance = new bootstrap.Modal(confirmModal, {
            backdrop: "static",
            keyboard: false
        });

        return new Promise((resolve) => {
            document.getElementById("confirmChoice").onclick = () => {
                modalInstance.hide();
                resolve(true);
            };

            document.getElementById("denyChoice").onclick = () => {
                modalInstance.hide();
                resolve(false);
            };

            modalInstance.show();

            confirmModal.addEventListener("hidden.bs.modal", () => {
                confirmModal.remove();
            });
        });
    }

    populateTagSelect(){
        this.model.populateTagSelect();
    }


    addDeleteEventListeners(list) {
        document.querySelectorAll(".deleteBtn").forEach((deleteBtn, index) => {
            deleteBtn.replaceWith(deleteBtn.cloneNode(true));
            deleteBtn = document.querySelectorAll(".deleteBtn")[index];

            deleteBtn.addEventListener("click", async () => {
                let confirmation = await this.getConfirmation();
                if (confirmation) {
                    let itemToDelete = list.getItems()[index];
                    this.removeItemFromList(list, itemToDelete);
                    this.listView.renderListDetails(list);

                    setTimeout(() => this.addDeleteEventListeners(list), 100);
                }
            });
        });
    }


}

export const cheqlistController = new CheqController();
