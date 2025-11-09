import { Router } from "express"
import userRouter from "./UserRoutes"
import productRouter from "./ProductRoutes"   
import orderRouter from "./OrderRoutes"   
import loginRouter from "./LoginRoute"
import auth from "../middleware/authentication"

const router = Router()

router.use('/login', auth.hasAuthentication, loginRouter)
router.use('/users', auth.hasAuthentication, userRouter)
router.use('/products', productRouter)   
router.use('/orders', orderRouter)   

export default router