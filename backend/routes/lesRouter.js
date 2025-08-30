import {Router} from "express";
import {get_lesson, create_lesson, edit_lesson, delete_lesson} from "../controllers/lesController.js";
import {checkAdminToken} from '../middleware/checkAdminToken.js';
const lesRouter = Router();


lesRouter.post("/get_lesson", get_lesson);
lesRouter.get("/get_lesson", checkAdminToken, get_lesson);
lesRouter.post("/create_lesson", checkAdminToken, create_lesson);
lesRouter.put("/edit_lesson", checkAdminToken, edit_lesson);
lesRouter.delete("/:id", checkAdminToken, delete_lesson);
export default lesRouter;