import {Router} from "express";
import { UserController } from "src/controllers/UserController";
import auth from "../middleware/authentication"

const router = Router();

router.get('/', auth.hasAuthentication, UserController.getAll)
router.post('/',  UserController.create)
router.put('/:id', auth.hasAuthentication, UserController.update)
router.delete('/:id', auth.hasAuthentication, UserController.delete)
router.get('/:id', auth.hasAuthentication, UserController.getById)

export default router