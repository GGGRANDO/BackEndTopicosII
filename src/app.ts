import express from "express"
import routes from "./routes/index"
import cors from "cors"


const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/login', (req, res) => res.status(200).json({"auth": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"}))

app.get('/healthcheck', (req, res) => res.status(200).send("API funcionando"))

app.use('/api/v1', routes)


export default app;