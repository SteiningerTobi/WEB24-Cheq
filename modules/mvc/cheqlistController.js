//import { renderAllLists, showListDetails } from "./view.js";
import { ListView } from "./listview.js";
import { CheqModel } from "./model.js";
import ListItem from "../classes/ListItem.js";
import Tag from "../classes/Tag.js";
import User from "../classes/User.js";

class CheqController {
    constructor() {
        this.listView = new ListView;
        this.itemView = new ListView;
        this.tagView = new ListView;
        this.userview = new ListView;
        this.model = new CheqModel;

        document.getElementById("createList").onclick = this.createList.bind(this);
    }



    initCheq() {
        this.model.loadFromJson();
        this.updateListsView();
        console.log("initiated");
        alert("NEIN")


        //this.view.bindAddBook((title, author) => {
        //    this.model.addBook(title, author);
        //    this.updateView();
        //});
    }

    updateListsView() {
        this.listView.renderLists(this.model.lists);
    }

    createList(){
        let nameInput = document.querySelector("#listNameInput");
        let listName = nameInput.value.trim();
        console.log(listName);

        if (listName === "") {
            alert("Bitte einen Namen eingeben!");
        } else {
            this.model.addListing(listName);
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