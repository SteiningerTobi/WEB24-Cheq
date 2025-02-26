import {cheqlistController} from "./cheqlistController.js";
export class TagView {
    constructor() {
        this.tagMenu = document.querySelector("#lists-overview");
        this.tagContainer = document.querySelector("#list-detail")
        this.tags = [];
    }

    update(eventType, data) {
        if (eventType === "dataLoaded") {
            this.tags = data.tags || [];
            this.renderTags(this.tags);
        } else if (eventType === "tagAdded") {
            this.tags.push(data);
            this.renderTags(this.tags);
        } else if (eventType === "tagDeleted") {
            this.tags = this.tags.filter(tag => tag.tagname !== data.tagname);
            this.renderTags(this.tags);
        }
    }

    renderTagMenu(){
        let tagSidebar = this.tagMenu;

        if (!tagSidebar) {
            console.error("Element mit ID 'article-sidebar' nicht gefunden.");
            return;
        }

        tagSidebar.innerHTML = `
        <div class="article-menu">
            <h2>Tag-Übersicht</h2>
            <input type="text" class="input-form" placeholder="Namen für neuen Tag eingeben" id="tagCreationName">
            <div id="addTagBtn" class="btn btn-success w-100 mt-2">Neuen Tag anlegen</div>            

            </div>
        `;

        let addTagBtn = document.getElementById("addTagBtn");
        addTagBtn.addEventListener("click",() => {
            let nameOfNewTag = document.getElementById("tagCreationName").value.trim();
            if (nameOfNewTag === ""){
                alert("Bitte Namen eingeben")
            }
            else {
                cheqlistController.addTag(nameOfNewTag);
            }
        })
    }

    renderTags(tags) {
        if (!Array.isArray(tags)) {
            console.error("Fehler: 'tags' ist kein Array oder undefined:", tags);
            return;
        }

        let tagContainer = this.tagContainer;
        if (!tagContainer) {
            console.error("Fehler: 'tagContainer' ist nicht vorhanden.");
            return;
        }

        let header = document.getElementById("mainSectHeader");
        header.innerHTML = "Alle Tags";

        tagContainer.innerHTML = "";

        if (tags.length === 0) {
            tagContainer.innerHTML = "<p class='text-muted'>Keine Tags vorhanden</p>";
            return;
        }

        let tagList = document.createElement("ul");
        tagList.classList.add("list-group");

        tags.forEach((tag, index) => {
            let tagName = tag.tagname;

            let listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

            listItem.innerHTML = `
            <div>
                <label for="${index}NameOfTag">Bezeichnung:</label>   
                <input type="text" class="tag-name-edit" value="${tagName}" id="${index}NameOfTag" placeholder="${tagName}">
            </div>
            <div>
                <i class="bi bi-trash3 btn btn-danger delete-tag" data-id="${index}"></i>
            </div>
        `;

            tagList.appendChild(listItem);
        });

        tagContainer.appendChild(tagList);

        document.querySelectorAll(".tag-name-edit").forEach((input, index) => {
            input.addEventListener("change", (event) => {
                let newTagName = event.target.value.trim();

                if (newTagName === "") {
                    alert("⚠️ Tag-Name darf nicht leer sein!");
                    return;
                }
                let oldTagName = event.target.placeholder.trim();
                cheqlistController.changeTagName(tags[index], newTagName, oldTagName);
            });
        });


        document.querySelectorAll(".delete-tag").forEach(btn => {
            btn.addEventListener("click", (event) => {
                let tagId = event.target.getAttribute("data-id");
                cheqlistController.deleteTag(tags[tagId]);
            });
        });
    }

}