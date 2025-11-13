import { Router } from "express";
import { OrderController } from "../controllers/OrderController";

const router = Router();

router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getById);
router.get("/:id/produtos", OrderController.getProductsByOrder);
router.post("/", OrderController.create);
router.post("/:id/produtos", OrderController.addProductsToOrder);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);
router.delete("/:id/produtos", OrderController.removeProductsFromOrder);
export default router;
