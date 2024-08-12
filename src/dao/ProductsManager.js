fs = require('fs')

class ProductsManager {
    static path

    static async getProducts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }

    static async addProduct(product = {}) {
        let products = await this.getProducts()

        //generar id
        let id = 1
        if (products.length > 0) {
            id = Math.max(...products.map(d => d.id)) + 1
            console.log("id", id)
        }
        let newProduct = {
            id,
            ...product
        }

        products.push(newProduct)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return newProduct

    }

    static async updateProduct(id, updateProduct = {}) {
        let products = await this.getProducts()
        let indexProduct = products.findIndex(p => p.id === id)
        if (indexProduct === -1) {
            throw new Error(`Error: No existe id ${id}`)

        }

        console.log("indice", indexProduct)
        //si existe el producto lo modificamos
        products[indexProduct] = {
            ...products[indexProduct],
            ...updateProduct,
            id
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return products[indexProduct]

    }

    static async deleteProduct(id) {
        let products = await this.getProducts()
        let indexProduct = products.findIndex(p => p.id === id)
        if (indexProduct === -1) {
            throw new Error(`Error: No existe id ${id}`)

        }
        console.log("indice", indexProduct)
        let deletedProduct = products[indexProduct]
        console.log("producto a eliminar", deletedProduct)
        products = products.filter(p => p.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return deletedProduct
    }


}

module.exports = ProductsManager


/* ProductsManager.addProduct("cafetera", "Dolce Gusto", "123", 90000, true, 3, "linea blanca", ["foto1", "foto2"])

console.log(ProductsManager.getProducts()) */