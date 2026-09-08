const express = require("express")
require("dotenv").config()
require("./config/db-connect")
const cors = require("cors")
const path = require("path")

const Router = require("./routes/index.route")

const app = express()
app.use(cors())
app.use(express.json())
app.use("/public", express.static('./public'))
app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
  express.static(path.join(__dirname, 'dist'))
})

app.use("/api", Router)
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Server is Running at http://localhost/${port}`))


