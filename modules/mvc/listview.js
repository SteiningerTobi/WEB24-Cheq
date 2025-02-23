import Listing from "../classes/List.js";
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

        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];
            let listname = list.getName();

            const listElement = document.createElement("div");
            listElement.classList.add("list", "p-2", "border", "rounded", "mb-2");

            listElement.innerHTML = `<h5>${listname}</h5>`;

            this.listOfLists.appendChild(listElement);
            listElement.addEventListener("click", () => this.renderListDetails(list));
        }
    }


    renderListDetails(list) {
        if (!list || !Array.isArray(list.items)) {
            console.error("Fehler: 'list.items' ist nicht vorhanden oder kein Array:", list);
            return;
        }
        let itemsHTML = "";
        if (list.items.length > 0) {
            for (let i = 0; i < list.items.length; i++) {
                let item = list.items[i];
                itemsHTML +=`
                <li class="list-group-item">
                    ${item.name}
                    <input class="form-check-input" type="checkbox" id="checkboxNoLabel" value="" aria-label="...">
                </li>`
                ;
            }
        } else {
            itemsHTML = "<li class='list-group-item'>Keine Items vorhanden</li>";
        }
        this.listDetails.innerHTML = "";
        this.listDetails.innerHTML = `
            <div class="list-detail p-3 border rounded">
                <h3>${list.name}</h3>
                <p>Status: ${list.completed ? "✅ Abgeschlossen" : "🛒 Offen"}</p>
                <h4>Items:</h4>
                <ul id="list-items" class="list-group">
                    ${itemsHTML}
                </ul>
            </div>
        `;
    }
}