import Listing from "../classes/List.js";
import {cheqlistController} from "./cheqlistController.js";
export class ListView {
    constructor() {
        this.listOfLists = document.querySelector("#lists-overview");
        this.listDetails = document.querySelector("#list-detail")
        this.lists = [];
    }

    update(eventType, data) {
        if (eventType === "dataLoaded") {
            this.lists = data.lists || [];
            this.renderLists(this.lists);
        } else if (eventType === "listAdded") {
            this.lists.push(data);
            this.renderLists(this.lists);
        }
    }

    renderLists(lists) {
        this.listOfLists.classList.add("p-3");
        if (!Array.isArray(lists)) {
            console.error("Fehler: 'lists' ist kein Array oder undefined:", lists);
            return;
        }
        // Container zuerst leeren
        this.listOfLists.innerHTML = "";

        if (lists.length === 0) {
            this.listOfLists.innerHTML = "Keine Listen vorhanden";
            console.log("keine Listen vorhanden");
            return;
        } else {
            this.listOfLists.innerHTML = `
            <h2>Shoppinglisten</h2>`
        }

        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];
            let listname = list.getName();

            const listElement = document.createElement("div");
            listElement.classList.add("list", "p-2", "border", "rounded", "mb-2", "alllists");

            listElement.innerHTML = ` 
                <h5>${listname}</h5>
                ${list.completed ? '<i class="bi bi-check-all"></i>' : ""}
            `;

            this.listOfLists.appendChild(listElement);
            listElement.addEventListener("click", () => {
                this.renderListDetails(list);
                document.querySelectorAll(".list").forEach(el => el.classList.remove("activeList"));
                listElement.classList.add("activeList");
            });
        }

        let addListBtn = document.createElement("div")
        addListBtn.innerHTML = `
        <button class="btn btn-success mt-3 w-100" id="addList" data-bs-toggle="modal"
                    data-bs-target="#addListsModal">Neue Liste anlegen</button>
        `
        this.listOfLists.appendChild(addListBtn);
    }

    renderEmptyListDetails(){
        let listDetail = document.getElementById("list-detail");
        listDetail.innerHTML = ``;
        listDetail.innerHTML = `
        <div class="noListSelected">Keine Liste ausgewählt</div>`;
    }

    renderListDetails(list) {
        if (!list || !Array.isArray(list.items)) {
            console.error("Fehler: 'list.items' ist nicht vorhanden oder kein Array:", list);
            return;
        }
        let items = list.getItems();
        let listname = list.getName();

        let itemsHTML = "";
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let name = item.getName();
                let checked = item.isCompleted() ? "checked" : "";
                let count = item.getCount();
                let article = cheqlistController.findArticle(list, item);
                let symbol = article.getSymbol();

                itemsHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${i}">
                        <button class="accordion-button collapsed d-flex justify-content-between itemInList" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${i}" aria-expanded="false" aria-controls="collapse-${i}">
                            <input class="form-check-input ms-2" type="checkbox" id="item-${i}" ${checked}>
                            <span>${symbol} ${name}</span>
                            <p class="itemNumber">x${count}</p>
                        </button>
                    </h2>
                    <div id="collapse-${i}" class="accordion-collapse collapse" aria-labelledby="heading-${i}" data-bs-parent="#list-items">
                        <div class="accordion-body">
                            <div class="body-item">
                                <label for="${i}numEdit">Menge:</label>
                                <input type="number" class="itemCount" id="${i}numEdit" min="1" max="99999" value="${count}">
                            </div>
                            <div class="body-item">
                                <i class="bi bi-trash3 btn btn-danger deleteBtn" id="${i}delete"></i>
                            </div>                       
                        </div>
                    </div>
                </div>`;
            }

        } else {
            itemsHTML = "<li class='list-group-item text-muted'>Keine Items vorhanden</li>";
        }

        let renderCloseBtn = !list.completed && items.length > 0;
        let renderOpenBtn = list.completed && items.length > 0;

        // ✅ "Liste abschließen"-Button nur anzeigen, wenn ALLE Checkboxen aktiv sind
        let closeButtonHTML = renderCloseBtn ? `<button id="completeListBtn" class="btn btn-success mt-3 w-100" disabled>Liste abschließen</button>` : "";
        let openButtonHTML = renderOpenBtn ? `<button id="openListBtn" class="btn btn-success mt-3 w-100">Liste öffnen</button>` : "";

        this.listDetails.innerHTML = `
        <div class="list-detail p-3 border rounded">
            <div class="ListHeader d-flex justify-content-between align-items-center">
                <h3>${listname}</h3>
                <i class="bi bi-pencil btn btn-success list-edit" id="${list.id}-edit-btn" data-bs-toggle="modal" data-bs-target="#editModal"></i>    
            </div>
            <p>
              <div class="UsersinList">
              </div>
            </p>
            <p>Status: ${list.completed ? "✅ Abgeschlossen" : "🛒 Offen"}</p>
            <div class="itemInListHeader">
                <h4>Items:</h4>
                <i class="bi bi-plus-lg addItemInListBtn btn btn-outline-success" data-bs-toggle="modal"
                    data-bs-target="#addExistingItemModal"></i>
            </div>
            <div class="accordion" id="list-items">
                ${itemsHTML}
            </div>
            ${closeButtonHTML}
            ${openButtonHTML}
        </div>`;

        let addItemBtn = document.createElement("div");
        addItemBtn.innerHTML = `
            <h2>Aktuelle Liste</h2>
            <div class="btn btn-success itemToList-btn">
        `;

        //let addItemBtn = document.querySelector(".addItemInListBtn");
        let addItemToListBtn = document.querySelector(".addItemInListBtn")
        addItemToListBtn.addEventListener("click", () => {
            cheqlistController.addItemToList(list);
        });


        // ✅ Eventlistener für Checkboxen setzen
        list.items.forEach((item, index) => {
            let checkbox = document.getElementById(`item-${index}`);
            if (checkbox) {
                checkbox.addEventListener("change", (event) => {
                    if (list.completed===true){
                        checkbox.checked = true;
                        alert("Liste ist geschlossen!");
                    }
                    else {
                        item.setCompleted(checkbox.checked);
                        this.updateCompleteButton(list);
                    }
                });
            }
        });

        // Eventlistener für die Anzahl-Inputs hinzufügen
        list.items.forEach((item, index) => {
            let countInput = document.querySelector(`#collapse-${index} .itemCount`);
            if (countInput) {
                countInput.addEventListener("change", (event) => {
                    let newValue = parseInt(event.target.value, 10);
                    if (!isNaN(newValue)) {
                        item.setCount(newValue);
                    }
                });
            }
        });


        // ✅ Eventlistener für "Liste abschließen"-Button setzen
        let closeButton = document.getElementById("completeListBtn");
        if (closeButton) {
            closeButton.addEventListener("click", () => {
                cheqlistController.closeList(list);
            });
        }

        let openButton = document.getElementById("openListBtn");
        if (openButton) {
            openButton.addEventListener("click", () => {
                cheqlistController.openList(list);
            })
        }

        // ✅ Eventlistener für den Edit-Button setzen
        let editBtn = document.getElementById(`${list.id}-edit-btn`);
        if (editBtn) {
            editBtn.addEventListener("click", () => {
                cheqlistController.editList(list);
            });
        }

        // ✅ Direkt prüfen, ob der Button aktiviert werden kann
        this.updateCompleteButton(list);

        cheqlistController.addDeleteEventListeners(list);

    }


    /**
     * ✅ Überprüft, ob ALLE Items einer Liste abgehakt wurden
     * und aktiviert / deaktiviert den "Liste abschließen"-Button.
     */
    updateCompleteButton(list) {
        let allChecked = list.items.every(item => item.isCompleted());
        let closeButton = document.getElementById("completeListBtn");
        if (closeButton) {
            closeButton.disabled = !allChecked;
        }
    }


    renderListEditing(){
        let editModalHeader = document.getElementById("editModalHeader");
        editModalHeader.innerHTML = "";
        editModalHeader.innerHTML = "Liste Bearbeiten"
        let inputLabel = document.getElementById("editInputModal");
        inputLabel.innerHTML = "";
        inputLabel.innerHTML = "Neuer Name der Liste";
        let input = document.getElementById("editingInput");
        input.value = "";
    }

    renderAddExistingItemModal(list, articles) {
        // Sicherstellen, dass das Modal existiert
        const modal = document.getElementById("addExistingItemModal");
        if (!modal) return;

        // Das Select-Element für die Artikel
        const select = document.getElementById("existingArticleSelect");
        select.innerHTML = ""; // Vorherige Optionen entfernen

        // Dropdown mit Artikeln befüllen
        articles.forEach(article => {
            let option = document.createElement("option");
            option.value = article.name;
            option.textContent = `${article.symbol} ${article.name}`;
            select.appendChild(option);
        });

        // Eventlistener für den Bestätigungsbutton setzen
        document.getElementById("confirmAddExistingItem").addEventListener("click", () => {
            cheqlistController.addExistingItemToList(list);
        });
    }

    renderConfirmationModal() {
        // Prüfen, ob das Modal bereits existiert, um doppelte Einträge zu vermeiden
        if (document.getElementById("confirmModal")) return;

        let modal = document.createElement("div");
        modal.innerHTML = `
        <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Bestätigung erforderlich</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button>
                    </div>
                    <div class="modal-body">
                        <h5>Wollen Sie das Element wirklich löschen?</h5>
                    </div>
                    <div class="modal-footer confirmBtns">
                        <button type="button" class="btn btn-success" id="denyChoice" data-bs-dismiss="modal">Nein</button>
                        <button type="button" class="btn btn-danger" id="confirmChoice">Ja</button>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.appendChild(modal);
    }

    initializeEmojiPicker() {
        const emojiPicker = document.getElementById("emojiPicker");
        const emojiPickerBtn = document.getElementById("emojiPickerBtn");
        const emojiInput = document.getElementById("itemSymbol");

        if (!emojiPicker || !emojiPickerBtn || !emojiInput) {
            console.error("Fehler: Emoji-Picker-Elemente nicht gefunden.");
            return;
        }

        // Picker anzeigen, wenn auf den Button geklickt wird
        emojiPickerBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Verhindert das sofortige Schließen
            emojiPicker.style.display = "block";

            emojiPicker.style.display = "block";
            emojiPicker.style.position = "fixed"; // Fixierte Position relativ zum Viewport
            emojiPicker.style.top = "50%"; // Vertikal zentriert
            emojiPicker.style.left = "50%"; // Horizontal zentriert
            emojiPicker.style.transform = "translate(-50%, -50%)"; // Exakte Zentrierung
            emojiPicker.style.zIndex = "1050"; // Sicherstellen, dass er über allem liegt
            emojiPicker.style.backgroundColor = "white"; // Hintergrund für bessere Sichtbarkeit
            emojiPicker.style.border = "1px solid #ccc"; // Optional: Rand hinzufügen
            emojiPicker.style.borderRadius = "10px"; // Abgerundete Ecken
            emojiPicker.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)"; // Optional: Schatten für besseren Look
            emojiPicker.style.padding = "10px"; // Abstand innen für bessere Darstellung
        });

        // Event: Wenn Emoji ausgewählt wird, in Input-Feld setzen & Picker schließen
        emojiPicker.addEventListener("emoji-click", (event) => {
            emojiInput.value = event.detail.unicode;
            emojiPicker.style.display = "none"; // Picker verstecken
        });

        // Picker schließen, wenn außerhalb geklickt wird
        document.addEventListener("click", (event) => {
            if (!emojiPicker.contains(event.target) && event.target !== emojiPickerBtn) {
                emojiPicker.style.display = "none";
            }
        });
    }



}