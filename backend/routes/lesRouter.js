import {Router} from "express";
import {get_lesson, create_lesson, edit_lesson, delete_lesson} from "../controllers/lesController.js";
import {checkAdminToken} from '../middleware/checkAdminToken.js';
import { validUser } from '../middleware/validUser.js';
const lesRouter = Router();


lesRouter.post("/get_lesson", validUser, get_lesson);
lesRouter.get("/get_lesson", checkAdminToken, get_lesson);
lesRouter.post("/create_lesson", checkAdminToken, create_lesson);
lesRouter.put("/edit_lesson", checkAdminToken, edit_lesson);
lesRouter.delete("/delete_lesson", checkAdminToken, delete_lesson);
export default lesRouter;