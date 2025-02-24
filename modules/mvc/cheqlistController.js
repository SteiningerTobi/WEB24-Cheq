//import { renderAllLists, showListDetails } from "./view.js";
import { ListView } from "./listview.js";
import { ItemView} from "./articleview.js";
import { CheqModel } from "./model.js";
import ListItem from "../classes/ListItem.js";
import Tag from "../classes/Tag.js";
import User from "../classes/User.js";

class CheqController {
    constructor() {
        this.listView = new ListView;
        this.itemView = new ItemView;
        this.tagView = new ListView;
        this.userview = new ListView;
        this.model = new CheqModel;

        document.getElementById("createList").onclick = this.createList.bind(this);
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
            console.log("Neue Listen nach Bearbeitung:", this.model.lists);

            // UI aktualisieren
            this.updateListsView();

            // Klick auf die geänderte Liste simulieren
            this.simulateClickOnList(list);
        };
    }

    closeList(list){
        console.log(list.items);
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
        console.log(list);
    }

    openList(list){
        list.openList();
        this.updateListsView();
        this.simulateClickOnList(list);
        this.listView.renderListDetails(list);
        console.log(list);
    }

    openListTab(){
        let tabs = document.querySelectorAll(".activeTab");
        for (let tab of tabs){
            tab.classList.remove("activeTab");
        }
        let listTab = document.querySelector(".listtab");
        listTab.classList.add("activeTab");

        let currentList = document.querySelector(".active");
        this.updateListsView();
        currentList.click();
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

    updateItemView(){
        this.itemView.renderArticles(this.model.items);
    }

    simulateClickOnList(list) {
        setTimeout(() => {
            let listElements = document.querySelectorAll(".list");
            let targetList = [...listElements].find(el => el.textContent.trim() === list.getName());

            if (targetList) {
                targetList.click();  // 🔥 Klick auf die Liste simulieren
            } else {
                console.warn("Liste nicht gefunden:", list.getName());
            }
        }, 100); // Kleiner Timeout für das UI-Update
    }


    async initCheq() {
        await this.model.loadFromJson();
        this.updateListsView();
        this.listView.renderEmptyListDetails();
        console.log("initiated");
        //alert("NEIN")


        //this.view.bindAddBook((title, author) => {
        //    this.model.addBook(title, author);
        //    this.updateView();
        //});
    }

    updateListsView() {
        this.listView.renderLists(this.model.lists);
        let mainHeader = document.getElementById("mainSectHeader");
        mainHeader.innerHTML = "";
        mainHeader.innerHTML = "Aktuelle Liste";
    }

    createList(){
        let nameInput = document.querySelector("#listNameInput");
        let listName = nameInput.value.trim();
        console.log(listName);

        if (listName === "") {
            alert("Bitte einen Namen eingeben!");
        } else {
            this.model.addList(listName);
            nameInput.value = "";
            this.listView.renderLists(this.model.lists);
        }
    }

}

export const cheqlistController = new CheqController();

/*

let data = { lists: [] }; // Globale Variable für Listen

const myModal = document.getElementById('addListsModal')
const myInput = document.getElementById('addListsModal')

myModal.addEventListener('shown.bs.modal', () => {
    myInput.focus()
})

async function loadJsonData() {
    try {
        let response = await fetch("lists.json");
        data = await response.json();
    } catch (error) {
        console.error("Fehler beim Laden der JSON-Daten:", error);
        data = { lists: [] };
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    await loadJsonData();
    renderAllLists(data.lists);
    attachListClickEvents(); // Events setzen
});

document.getElementById("createList").onclick = () => {
    let nameInput = document.querySelector("#listNameInput");
    let listName = nameInput.value.trim();
    console.log(listName);

    if (listName === "") {
        alert("Bitte einen Namen eingeben!");
    } else {
        let newList = new List({ id: Date.now(), name: listName });
        data.lists.push(newList);
        localStorage.setItem("Lists", JSON.stringify(data.lists));

        renderAllLists(data.lists);
        attachListClickEvents();
    }
};

function attachListClickEvents() {
    document.querySelectorAll(".list").forEach(listElement => {
        listElement.addEventListener("click", () => {
            document.querySelectorAll(".list").forEach(el => el.classList.remove("activeList"));
            listElement.classList.add("activeList");

            const listIndex = listElement.dataset.index;
            showListDetails(data.lists[listIndex]);
        });
    });
}

function createModal() {
    let modal = document.createElement("div");
    modal.innerHTML = `
        <div class="modal-wrapper">
            <div class="listCreation modal-container">
                <h2>Liste erstellen</h2>
                <label for="listNameInput">Name der Liste</label>
                <input type="text" id="listNameInput">
                    <div class="modal-btns">
                        <button id="closeModal" class="btn btn-danger">Schließen</button>
                        <button id="createList" class="btn btn-success">Liste erstellen</button>
                    </div>
            </div>
        </div>
`;

document.body.insertBefore(modal, document.body.firstChild);

document.getElementById("closeModal").onclick = () => modal.remove();


}*/