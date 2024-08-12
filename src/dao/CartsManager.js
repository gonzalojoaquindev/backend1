fs = require('fs')

class CartManager {
    static path

    static async getCarts() {
        if (fs.existsSync(this.path)) {
            console.log("si existe")
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
        } else {
            console.log("no encuentra archivo")
            return []
        }
    }

    static async addCart() {
        let carts = await this.getCarts()

        //generar id
        let id = 1
        if (carts.length > 0) {
            id = Math.max(...carts.map(d => d.id)) + 1
            console.log("id", id)
        }
        let newCarts = {
            id,
            products: []
        }

        carts.push(newCarts)

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        return newCarts
    }

    static async addProductToCart(cid, pid, cart) {
        let carts = await this.getCarts()
        let indexCart = carts.findIndex(c => c.id == cid)
        if (indexCart === -1) {
            throw new Error(`Error: No existe carrito con id ${id}`)
        }
        console.log("indice", indexCart)
        //si existe el producto lo modificamos
        carts[indexCart] = {
            ...carts[indexCart],
            ...cart
        }

        console.log(`se escribirá ${carts}`)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        return carts[indexCart]


    }
    /* 
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
    
     */

}

module.exports = CartManager


/* ProductsManager.addProduct("cafetera", "Dolce Gusto", "123", 90000, true, 3, "linea blanca", ["foto1", "foto2"])

console.log(ProductsManager.getProducts()) */