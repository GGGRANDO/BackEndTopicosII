import { Router } from "express"
import userRouter from "./UserRoutes"
import productRouter from "./ProductRoutes"   
import orderRouter from "./OrderRoutes"   
import loginRouter from "./LoginRoute"
import auth from "../middleware/authentication"

const router = Router()

router.use('/login', loginRouter)
router.use('/users',  userRouter)
router.use('/products',  auth.hasAuthentication, productRouter)   
router.use('/orders', auth.hasAuthentication, orderRouter)   

export default router