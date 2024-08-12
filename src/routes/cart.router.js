const { Router } = require("express")
const CartsManager = require("../dao/CartsManager")

const router = Router()

CartsManager.path = "./data/carts.json"
console.log(CartsManager.path)

router.get("/:cid", async (req, res) => {
    let carts
    try {
        carts = await CartsManager.getCarts()
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }
    let { cid } = req.params
    console.log(cid)
    id = Number(cid)
    if (isNaN(id)) {
        return res.status(400).send("error: ingrese un id numerico")
    }
    console.log("carts", carts)
    let cart = carts.find(p => p.id == id)
    if (!cart) {
        console.log("no existe el carrito de compra 🛒")
        return res.status(404).send("No existe el carrito de compra 🛒")
    }
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ cart })
})

router.post("/", async (req, res) => {
    console.log("Creando carrito 🛒")
    try {
        let newCart = await CartsManager.addCart()
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ newCart })

    } catch (error) {
        console.log("error", error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params;

    cid = Number(cid)
    pid = Number(pid)
    console.log("id carrito", cid)
    console.log("id producto", pid)
    //evaluar tipos de datos
    if (typeof cid !== "number" || typeof pid !== "number") {
        console.log('Argumentos en formato invalido')
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            error: 'Argumentos en formato invalido'
        })
    }

    //validar que sea un id numerico
    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).send("error: ingrese un id numerico")
    }

    let carts = await CartsManager.getCarts()
    console.log(carts)
    //Evaluar si existe el carro
    let cart = carts.find(c => c.id == cid)
    console.log("carrito", cart)
    if (!cart) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: 'El carro no existe' })
    }
    //Evaluar si el carrito tiene productos
    if (cart.products.length > 0) {
        console.log("el carrito tiene productos")
        //Evaluar si ya existe el producto en dentro del carro
        let product = cart.products.find(p => p.product == pid)
        if (product) {
            product.quantity = product.quantity + 1
            console.log(`ya existe producto, le sumé 1 a la cantidad quedando en: ${product.quantity}`)
        } else {
            let newProduct = {
                product: pid,
                quantity: 1
            }
            cart.products.push(newProduct)
            console.log(`no existía el producto en el carro, se agregó: producto ${newProduct.product}`)
        }

    } else {
        cart.products.push({
            product: pid,
            quantity: 1
        })
        console.log(`El carro estaba vacío, se agregó: ${cart.products.product}`)
    }

    try {
        let product = await CartsManager.addProductToCart(cid, pid, cart)
        console.log("agregando producto al carro")
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ product })

    } catch (error) {
        console.log("error", error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }

})



module.exports = { router }