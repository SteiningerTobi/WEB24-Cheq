import Listing from "../classes/List.js";
import {cheqlistController} from "./cheqlistController.js";
export class ListView {
    constructor() {
        this.listOfLists = document.querySelector("#lists-overview");
        this.listDetails = document.querySelector("#list-detail")
    }

    renderLists(lists) {
        if (!Array.isArray(lists)) {
            console.error("Fehler: 'lists' ist kein Array oder undefined:", lists);
            return;
        }
        // Container zuerst leeren
        this.listOfLists.innerHTML = "";

        if (lists.length === 0) {
            this.listOfLists.innerHTML = "Keine Listen vorhanden";
            return;
        }
        else {
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

                itemsHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${i}">
                    <button class="accordion-button collapsed d-flex justify-content-between itemInList" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${i}" aria-expanded="false" aria-controls="collapse-${i}">
                        <input class="form-check-input ms-2" type="checkbox" id="item-${i}" ${checked}>
                        <span>${name}</span>
                    </button>
                </h2>
                <div id="collapse-${i}" class="accordion-collapse collapse" aria-labelledby="heading-${i}" data-bs-parent="#list-items">
                    <div class="accordion-body">
                        <!--<div class="body-item" id="itemNameEdit">
                            <label for="${i}nameEdit">Name: </label>
                            <input type="text" class="itemName" id="${i}nameEdit" value="${name}">
                        </div>-->
                        <div class="body-item">
                            <label for="${i}numEdit">Menge:</label>
                            <input type="number" class="itemCount" id="${i}numEdit" min="1" max="99999" value="${count}">
                        </div>
                        <div class="body-item">
                            <i class="bi bi-trash3 btn btn-danger ${i}delete"></i>
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
            <p>Status: ${list.completed ? "✅ Abgeschlossen" : "🛒 Offen"}</p>
            <h4>Items:</h4>
            <div class="accordion" id="list-items">
                ${itemsHTML}
            </div>
            ${closeButtonHTML}
            ${openButtonHTML}
        </div>`;

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
}