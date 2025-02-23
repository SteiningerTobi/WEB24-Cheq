import {List} from "./model.js";

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
        listElement.dataset.index = index; // Speichert den Index für Controller-Zugriff

        listElement.innerHTML = `<h5>${list.name}</h5>`;

       //<p>${list.completed ? "✅ Abgeschlossen" : "🛒 Offen"}</p>


        container.appendChild(listElement);
    });

    let nolisttext = document.querySelector('#nolists');
    nolisttext.classList.toggle('d-none', lists.length > 0);
}



function showListDetails(list) {
    let detailContainer = document.getElementById("list-group");
    if (!detailContainer) {
        console.error("Element mit ID #listdetailview nicht gefunden.");
        return;
    }
    console.log("Aktuelle Liste:", list);
    console.log("Items in der Liste:", list.items);


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

    detailContainer.innerHTML = `
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


export { renderAllLists, showListDetails };
