import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

export class LoginController {

    doLogin = async (req: Request, res: Response) => {
        const {user, password} = req.body

        if(user === "teste" && password === 'teste') {
            const token = jwt.sign({
                auth: true,
                email: user
            }, process.env.TOKEN_KEY!, {expiresIn: "1h"})
            return res.status(200).json({
                auth: true,
                token: token,
                message: "Logou com sucesso"
            })
        } else {
            return res.status(401).send("Não autorizado")
        }

        return res.status(500).send("Deu ruim")
    }

}