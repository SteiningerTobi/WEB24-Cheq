import {todoView} from "./view.js";
import {todoModel} from "./model.js";
class ToDoController {
    init(){
        //set the DOM event handlers
        let dom = todoView.dom;
        //ser the model event handlers
        todoModel.subscribe("addTask", todoView, todoView.addTask);
        todoModel.subscribe("deleteTask", todoView, todoView.deleteTask);

        dom.submit.onclick = (ev)=>{
            ev.preventDefault();
            console.log("submit clicked!");
            let title = dom.title.value;
            let description = dom.description.value;
            if(title && description){
                todoModel.add(title, description);
                dom.title.value = "";
                dom.description.value = "";
            }else{
                alert("Please fill in the title and the description!");
            }
        }

        dom.list.onclick = (ev) =>{
            ev.preventDefault();
            let target = ev.target; //Element, auf das geklickt wurde
            if(target.classList.contains("btn-danger")){
                let div = target.closest("div");
                let id = div.dataset.taskid;
                todoModel.delete(id);
            }
            else {
                alert("Fehler, konnte den Eintrag nicht löschen!")
            }
        }
    }
}

//singleton
export const todoController = new ToDoController();