
import {cheqlistController} from "./modules/mvc/cheqlistController.js";

document.addEventListener("DOMContentLoaded", async () => {
    await cheqlistController.initCheq();
});