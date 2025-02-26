
import {cheqlistController} from "./modules/mvc/cheqlistController.js";

document.addEventListener("DOMContentLoaded", async () => {
    await cheqlistController.initCheq();
});
























/*
class List {
    #id;
    #name;
    #icon;
    #completed;
    #items;

    constructor({id, name, icon}) {
        this.#id = id;
        this.#name = name;
        this.#icon = icon;
        this.#items = [];
        this.#completed = false;
    }

    addItem(item) {
        this.#items.push(item);
    }

    removeItem(itemId) {
        this.#items = this.#items.filter(item => item.id !== itemId);
    }

    toggleCompleted() {
        this.#completed = !this.#completed;
    }

    getItems() {
        return this.#items;
    }
}

class Item {
    #id;
    #name;
    #symbol;
    #tags;

    constructor({id, name, symbol}) {
        this.#id = id;
        this.#name = name;
        this.#symbol = symbol;
        this.#tags = [];
    }

    addTag(tag) {
        this.#tags.push(tag);
    }

    removeTag(tagName) {
        this.#tags = this.#tags.filter(tag => tag.tagname !== tagName);
    }

    getTags() {
        return this.#tags;
    }
}

class Tag {
    #tagname;

    constructor({tagname}) {
        this.#tagname = tagname;
    }

    getTagName() {
        return this.#tagname;
    }
}

class User {
    #username;
    #userid;
    #userStatus;
    #lists;

    constructor({username, userid, userStatus = 0}) {
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
}

'use strict'
document.addEventListener("DOMContentLoaded", async function() {
    // Laden der JSON-Daten
    async function loadJsonData() {
        try {
            let response = await fetch("lists.json"); // JSON Datei laden
            return await response.json();
        } catch (error) {
            console.error("Fehler beim Laden der JSON-Daten:", error);
            return null;
        }
    }

    // Listen in das HTML-Element rendern
    function renderAllLists(lists) {
        let container = document.getElementById("lists-overview");
        if (!container) {
            console.error("Element mit ID #lists-overview nicht gefunden.");
            return;
        }

        container.innerHTML = ""; // Vorherigen Inhalt löschen

        lists.forEach((list, index) => {
            const listElement = document.createElement("div");
            listElement.classList.add("list", "p-2", "border", "rounded", "mb-2");

            listElement.innerHTML = `
                <h5>${list.icon} ${list.name}</h5>
                <p>${list.completed ? "✅ Abgeschlossen" : "🛒 Offen"}</p>
            `;

            // Klick-Event für die Liste
            listElement.addEventListener("click", () => {
                // Entferne die Klasse 'activeList' von allen Listen
                document.querySelectorAll(".list").forEach(el => el.classList.remove("activeList"));

                // Füge 'activeList' nur zur geklickten Liste hinzu
                listElement.classList.add("activeList");

                // Zeige die Details der geklickten Liste
                showListDetails(lists[index]);
            });

            container.appendChild(listElement);
        });


        let listsarray = document.querySelectorAll('.list');
        let nolisttext = document.querySelector('#nolists');
        if (listsarray.length === 0){
            nolisttext.classList.remove('d-none');
        } else {
            nolisttext.classList.add('d-none');
        }
    }

    // Details der Liste anzeigen
    function showListDetails(list) {
        let detailContainer = document.getElementById("list-group");
        if (!detailContainer) {
            console.error("Element mit ID #listdetailview nicht gefunden.");
            return;
        }

        detailContainer.innerHTML = ""; // Vorherigen Inhalt löschen

        // Erstellt die Detailansicht für die ausgewählte Liste
        const detailElement = document.createElement("div");
        detailElement.classList.add("list-detail", "p-3", "border", "rounded");

        detailElement.innerHTML = `
            <h3>${list.icon} ${list.name}</h3>
            <p>Status: ${list.completed ? "✅ Abgeschlossen" : "🛒 Offen"}</p>
            <h4>Items:</h4>
            <ul id="list-items" class="list-group">
                ${list.items.length > 0
            ? list.items.map(item => `<li class="list-group-item">${item.symbol} ${item.name}</li>`).join('')
            : "<li class='list-group-item'>Keine Items vorhanden</li>"
        }
            </ul>
        `;

        detailContainer.appendChild(detailElement);
    }

    // Daten laden und rendern
    const data = await loadJsonData();
    if (data && data.lists) {
        renderAllLists(data.lists);
    }

    let addListBtn = document.querySelector('#addList');
    addListBtn.onclick = function () {
        createModal();

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

            document.getElementById("closeModal").onclick = function () {
                modal.remove();
            };

            document.getElementById("createList").onclick = function () {
                let nameInput = document.querySelector('#listNameInput');
                let listName = nameInput.value;
                if (listName === '') {
                    alert("Bitte einen Namen eingeben!");
                } else {
                    const newList = {
                        id: Date.now(),
                        name: listName,
                        icon: "🛍️", // Standard-Icon
                        completed: false,
                        items: []
                    };
                    data.lists.push(newList);
                    localStorage.setItem("shoppingLists", JSON.stringify(data.lists));
                    renderAllLists(data.lists);
                }
                modal.remove();
            };
        }
    };
});*/
