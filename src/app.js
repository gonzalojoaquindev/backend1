const express = require('express')
const { router: productRouter } = require("./routes/products.router")
const { router: cartRouter } = require("./routes/cart.router")


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)



app.get('/heros', async (req, res) => {
    //let heros = JSON.parse(await fs.promises.readFile("./heros.json", { encoding: "utf-8" }))
    let heros = await HeroesManager.getHeroes()
    console.log(heros)
    console.log("obteniendo heroes")
    /* res.send(heros) */
    let { limit } = req.query
    console.log(limit)
    if (limit) {
        limit = Number(limit)
        if (isNaN(limit)) {
            return res.send("El argumento limit tiene que ser numerico")
        } else {
            limit = heros.length
        }
    }
    let resultado = heros.slice(0, limit)
    res.send(resultado)
    /* let products = ["hola", "mundo"]
   res.send(heros) */
})

app.get("/heros/:id", async (req, res) => {
    let { id } = req.params
    console.log(id)
    id = Number(id)
    if (isNaN(id)) {
        return res.send("error: ingrese un id numerico")
    }
    let hero = await HeroesManager.getHeroes()
    //let hero = heros.find(h => h.id == id)
    res.send(hero)
})



app.listen(8080, () => console.log("Servidor arriba en el puerto 8080"))