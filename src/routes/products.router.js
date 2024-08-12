const { Router } = require("express")
const ProductsManager = require('../dao/ProductsManager')

const router = Router()

ProductsManager.path = "./data/products.json"
console.log(ProductsManager.path)

router.get('/', async (req, res) => {
    let products
    try {
        products = await ProductsManager.getProducts()

    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }
    console.log(products)
    console.log("obteniendo productos")


    let { limit } = req.query
    console.log(limit)
    if (limit) {
        limit = Number(limit)
        if (isNaN(limit)) {
            return res.send("El argumento limit tiene que ser numerico")
        }
    } else {
        limit = products.length
        console.log(`èl limite es ${limit}`)
    }
    let results = products.slice(0, limit)


    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ results })

})

router.get("/:id", async (req, res) => {
    let products
    try {
        products = await ProductsManager.getProducts()
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }
    let { id } = req.params
    console.log(id)
    id = Number(id)
    if (isNaN(id)) {
        return res.status(400).send("error: ingrese un id numerico")
    }
    let product = products.find(p => p.id == id)
    if (!product) {
        console.log("no existe el producto")
        return res.status(404).send("error: no se ha encontrado el producto")
    }
    res.status(200).send(product)
})

router.post("/", async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    console.log(title)

    let newProductBody = req.body
    console.log(newProductBody)

    console.log("status", status)

    //Por defecto status en true
    if (typeof newProductBody.status === "undefined") {
        console.log("no viene status, se crea por defecto en true")
        newProductBody.status = true
        console.log(newProductBody)
    }

    //evaluar tipos de datos
    if (typeof title !== "string" || typeof description !== "string" || typeof code !== "string" || typeof price !== "number" || typeof newProductBody.status !== "boolean" || typeof stock !== "number" || typeof category !== "string" || typeof thumbnails !== "object") {
        console.log('Argumentos en formato invalido')
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            error: 'Argumentos en formato invalido'
        })
    }

    //compruebo si los parámetros no están vacíos
    if (!title.trim() || !description.trim() || !code.trim() || !price || !stock || !category.trim()) {
        console.log("complete los datos")
        return res.status(400).json({
            error: 'Complete los datos necesarios',
        })
    }

    let products = await ProductsManager.getProducts()

    //evaluar si existe el producto
    let exits = products.find(p => p.title.toLowerCase() === title.toLowerCase())
    if (exits) {
        console.log(`El producto ${title} ya existe`)
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            error: 'El producto ya existe',
        })
    }

    try {
        let newProduct = await ProductsManager.addProduct(newProductBody)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ newProduct })

    } catch (error) {
        console.log("error", error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }

})

router.put("/:id", async (req, res) => {
    let products
    try {
        products = await ProductsManager.getProducts()
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }
    let { id } = req.params
    console.log(id)
    let { ...updateProduct } = req.body
    delete updateProduct.id
    console.log(updateProduct)


    console.log(`Editando el producto con id ${id}`)
    id = Number(id)
    //validar que sea un id numerico
    if (isNaN(id)) {
        return res.status(400).send("error: ingrese un id numerico")
    }

    //validar que exista el producto
    let product = products.find(p => p.id == id)
    if (!product) {
        console.log("no existe el producto")
        return res.status(404).send("error: no se ha encontrado el producto")
    }
    //Validar que no exista otro producto igual
    if (updateProduct.title) {
        let exist = products.find(p => p.title.toLowerCase() === updateProduct.title.toLowerCase())
        if (exist) {
            console.log(`Ya hay otro producto llamado ${updateProduct.title}`)
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({
                error: `Ya hay otro producto llamado ${updateProduct.title}`,
            })
        }
    }

    try {
        let updatedProduct = await ProductsManager.updateProduct(id, updateProduct)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ updatedProduct })

    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }

})

router.delete("/:id", async (req, res) => {
    let { id } = req.params
    console.log(`Eliminando el producto con id ${id}`)
    id = Number(id)
    //validar que sea un id numerico
    if (isNaN(id)) {
        return res.status(400).json({ "error": "ingrese un id numerico" })
    }

    try {
        let result = await ProductsManager.deleteProduct(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ result })

    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: 'Error inesperado en el servidor, intente más tarde',
            detalle: `${error.message}`
        })

    }
})


module.exports = { router }