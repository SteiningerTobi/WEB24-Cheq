import Item from "../classes/Item.js";
import Article from "../classes/Article.js";
import Tag from "../classes/Tag.js";
import {cheqlistController} from "./cheqlistController.js";
export class ItemView {
    constructor() {
        this.listOfLists = document.querySelector("#lists-overview");
        this.listDetails = document.querySelector("#list-detail")
        this.articles = [];
    }

    update(eventType, data) {
        if (eventType === "dataLoaded") {
            this.articles = data.articles || [];
            this.renderArticles(this.articles);
        } else if (eventType === "articleDeleted") {
            this.articles = this.articles.filter(article => article.getName() !== data.getName());
            this.renderArticles(this.articles);
        }

    }

    renderArticles(items) {
        if (!Array.isArray(items)) {
            console.error("Fehler: 'items' ist kein Array oder undefined:", items);
            return;
        }

        let header = document.getElementById("mainSectHeader");
        header.innerHTML = "Alle Artikel";

        // Container für Artikel abrufen
        let articlesContainer = this.listDetails;

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

        // Accordion-Container erstellen
        const accordion = document.createElement("div");
        accordion.classList.add("accordion");
        accordion.id = "articlesAccordion";

        // Durch alle Artikel iterieren und als Accordion-Elemente rendern
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let name = item.getName();
            let symbol = item.getSymbol();
            let tags = item.getTags();

            // Accordion-Item erstellen
            const accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");

            //Dynamisches Tag-Select direkt hier einfügen
            let tagOptions = `<option value="">Kein Tag</option>`; // Standardwert für kein Tag

            //Das einzelne Tag-Objekt abrufen
            let selectedTag = item.getTags(); // Falls null oder undefined, setze ""

            cheqlistController.model.tags.forEach(tag => {
                let isSelected =
                    (selectedTag && selectedTag.getTagName && selectedTag.getTagName() === tag.getTagName()) ? "selected" : "";

                tagOptions += `<option value="${tag.getTagName()}" ${isSelected}>${tag.getTagName()}</option>`;
            });

            accordionItem.innerHTML = `
            <h2 class="accordion-header" id="heading-${i}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#collapse-${i}" aria-expanded="false" aria-controls="collapse-${i}">
                    <div class="itemLeftSide">
                        <div class="articleIcon">${symbol}</div>
                        <div class="article-info">
                            <h4 class="mb-0">${name}</h4>
                        </div>
                    </div>
                </button>
            </h2>
            <div id="collapse-${i}" class="accordion-collapse collapse" aria-labelledby="heading-${i}" 
                data-bs-parent="#articlesAccordion">
                <div class="accordion-body d-flex justify-content-between align-items-center twoFlex">
                    <div class="padding-sm">
                        <label for="${i}ItemName">Name:</label>
                        <input type="text" class="itemNameEditor" id="${i}ItemName" value="${items[i].name}">
                    </div>
                    <div class="article-actions d-flex align-items-center">
                        <i class="bi bi-trash3 btn btn-danger delete-article" data-id="${i}"></i>
                    </div>
                </div>
            </div>
            `;

            setTimeout(() => {
                let itemTagEdit = document.getElementById(`tagSelect${i}`);
                if (itemTagEdit) {
                    itemTagEdit.addEventListener("change", () => {
                        let newTag = itemTagEdit.value;
                        cheqlistController.changeTagOfItem(item, newTag, items)
                    })
                }

                let itemNameEdit = document.getElementById(`${i}ItemName`);
                if (itemNameEdit) {
                    itemNameEdit.addEventListener("change", () => {
                        let newArticleName = itemNameEdit.value;
                        cheqlistController.changeArticleName(item, newArticleName, items);
                    });
                }
            }, 0);


            // Accordion-Item zum Haupt-Accordion-Container hinzufügen
            accordion.appendChild(accordionItem);
        }

        // Accordion dem Container hinzufügen
        articlesContainer.appendChild(accordion);

        // Eventlistener für Edit-Buttons setzen
        document.querySelectorAll(".edit-article").forEach(btn => {
            btn.addEventListener("click", (event) => {
                let itemId = event.target.getAttribute("data-id");
                // this.editArticle(items[itemId]);  // Falls du eine Edit-Funktion hast
            });
        });

        // Eventlistener für Delete-Buttons setzen (mit Bestätigung)
        document.querySelectorAll(".delete-article").forEach(btn => {
            btn.addEventListener("click", (event) => {
                let itemId = event.target.getAttribute("data-id");
                let itemToDelete = items[itemId];

                // Bestätigungs-Modal aufrufen
                this.showDeleteConfirmationModal(itemToDelete, items);
            });
        });

    }

    showDeleteConfirmationModal(item, items) {
        let modalHTML = `
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Bestätigung erforderlich</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button>
                    </div>
                    <div class="modal-body">
                        <p>⚠️ Möchten Sie den Artikel <strong>"${item.getName()}"</strong> wirklich löschen?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
                        <button type="button" class="btn btn-danger" id="confirmDelete">Löschen</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // 🔹 Falls das Modal bereits existiert, entfernen und neu erstellen
        let existingModal = document.getElementById("confirmDeleteModal");
        if (existingModal) {
            existingModal.remove();
        }

        // 🔹 Modal ins DOM einfügen
        document.body.insertAdjacentHTML("beforeend", modalHTML);

        // 🔹 Bootstrap Modal initialisieren
        let deleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"), {
            backdrop: "static",
            keyboard: false
        });

        // 🔹 Eventlistener für den Bestätigungs-Button setzen
        document.getElementById("confirmDelete").addEventListener("click", () => {
            cheqlistController.deleteArticle(item, items);
            deleteModal.hide();
            //setTimeout(() => location.reload(), 300); // 🔥 Nach dem Löschen Seite neu laden, um die Änderungen zu reflektieren
        });

        // 🔹 Modal anzeigen
        deleteModal.show();
    }

    renderArticleMenu() {
        // Sidebar-Container für Artikel
        let articleSidebar = this.listOfLists;

        if (!articleSidebar) {
            console.error("Element mit ID 'article-sidebar' nicht gefunden.");
            return;
        }

        // Liste aller verfügbaren Tags abrufen
        let tags = cheqlistController.model.tags;

        // HTML für das Artikelmenü erstellen
        articleSidebar.innerHTML = `
        <div class="article-menu">
            <h2>Artikelübersicht</h2>
           
            <button type="button" id="addNewArticleBtn" class="newArticleBtn btn btn-success w-100 mt-2" 
            data-bs-toggle="modal" data-bs-target="#addItemModal">Neuen Artikel anlegen</button>

            <h5 class="margin-top-med">Filtern nach Tags:</h5>
            <div id="tagFilterContainer" class="tag-filters">
                <div class="form-check d-flex align-items-center">
                    <input class="form-check-input tag-radio me-2" type="radio" name="tagFilterGroup" id="tag-all" value="all" checked>
                    <label class="form-check-label" for="tag-all">Alle Artikel</label>
                </div>
                
                <!-- Dynamische Tag-Radiobuttons -->
                ${tags.length > 0 ? tags.map(tag => `
                    <div class="form-check d-flex align-items-center">
                        <input class="form-check-input tag-radio me-2" type="radio" name="tagFilterGroup" id="tag-${tag.tagname}" value="${tag.tagname}">
                        <label class="form-check-label" for="tag-${tag.tagname}">${tag.tagname}</label>
                    </div>
                `).join("") : "<p class='text-muted'>Keine Tags verfügbar</p>"}
            </div>
            
            <div class="btn btn-outline-success filterBtn mt-2" id="filterBtn"><i class="bi bi-funnel"></i> Filtern</div>            

            </div>
        `;

        let articleAddingBtn = document.getElementById("addNewArticleBtn");
        articleAddingBtn.addEventListener("click", () => {
            cheqlistController.addArticleToModel();
        })

        let filterBtn = document.getElementById("filterBtn");
        filterBtn.addEventListener("click", () => {
            let selectedRadio = document.querySelector('input[name="tagFilterGroup"]:checked');
            let filterTag = selectedRadio.value;
            cheqlistController.filterBy(filterTag);
        })

        // Eventlistener für den "Neuen Artikel anlegen"-Button
        document.getElementById("addNewArticleBtn").addEventListener("click", () => {
            //this.renderArticleCreationForm();
        });

        // Eventlistener für Tag-Filter-Checkboxen setzen
        let checkboxes = document.querySelectorAll(".tag-checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                //this.filterArticlesByTags();
            });
        });
    }

}
