import Item from "../classes/List.js";
import {cheqlistController} from "./cheqlistController.js";
export class ItemView {
    constructor() {
        this.listOfLists = document.querySelector("#lists-overview");
        this.listDetails = document.querySelector("#list-detail")
    }

    renderArticles(items) {
        if (!Array.isArray(items)) {
            console.error("Fehler: 'items' ist kein Array oder undefined:", items);
            return;
        }

        // Container für Artikel abrufen
        let articlesContainer = this.listOfLists;

        // Falls Container nicht existiert, abbrechen
        if (!articlesContainer) {
            console.error("Element mit ID 'articles-overview' nicht gefunden.");
            return;
        }

        // Container zuerst leeren
        articlesContainer.innerHTML = "";

        if (items.length === 0) {
            articlesContainer.innerHTML = "<p class='text-muted'>Keine Artikel vorhanden</p>";
            return;
        }

        // Durch alle Artikel iterieren und rendern
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let name = item.getName();
            let count = item.getCount();
            let completed = item.isCompleted() ? "checked" : "";

            const itemElement = document.createElement("div");
            itemElement.classList.add("article", "p-2", "border", "rounded", "mb-2", "d-flex", "align-items-center", "justify-content-between");

            itemElement.innerHTML = `
            <div class="article-info">
                <h5 class="mb-0">${name}</h5>
                <span class="text-muted">Menge: ${count}</span>
            </div>
            <div class="article-actions d-flex align-items-center">
                <input class="form-check-input me-2" type="checkbox" id="article-${i}" ${completed}>
                <i class="bi bi-pencil btn btn-success edit-article" data-id="${i}"></i>
                <i class="bi bi-trash3 btn btn-danger delete-article" data-id="${i}"></i>
            </div>
        `;

            articlesContainer.appendChild(itemElement);
        }

        // Eventlistener für Checkboxen setzen
        items.forEach((item, index) => {
            let checkbox = document.getElementById(`article-${index}`);
            if (checkbox) {
                checkbox.addEventListener("change", () => {
                    item.setCompleted(checkbox.checked);
                });
            }
        });

        // Eventlistener für Edit-Buttons setzen
        document.querySelectorAll(".edit-article").forEach(btn => {
            btn.addEventListener("click", (event) => {
                let itemId = event.target.getAttribute("data-id");
                //this.editArticle(items[itemId]);
            });
        });

        // Eventlistener für Delete-Buttons setzen
        document.querySelectorAll(".delete-article").forEach(btn => {
            btn.addEventListener("click", (event) => {
                let itemId = event.target.getAttribute("data-id");
                //this.deleteArticle(items[itemId]);
            });
        });
    }


}
