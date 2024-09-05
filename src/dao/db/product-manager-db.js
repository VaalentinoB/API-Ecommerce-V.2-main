import ProductModel from "../fs/data/product.model.js";
import mongoose from "mongoose";

class ProductManager {


    async addProduct({ title, description, code, stock, category, image, price, thumbnails }) {
        try {

            if (!title || !description || !price || !code || !stock || !category) {
                console.log("¡¡¡Todos los campos son obligatorios!!!" + " Validacion numero 2 XD");
                return;
            }

            const existeProducto = await ProductModel.findOne({ code: code })

            if (existeProducto) {
                console.log("EL PRODUCTO YA EXISTE!")
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                code,
                status: true,
                stock,
                category,
                image,
                price,
                thumbnails: thumbnails || []
            });

            await newProduct.save()


        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const result = await ProductModel.paginate(filter, options);
            result.docs = result.docs.map(doc => doc.toObject());
            return result;
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }
    async getProductById(id) {
        try {
            // Validar si el ID es un ObjectId válido
            if (!mongoose.isValidObjectId(id)) {
                console.log("ID no válido");
                return null;
            }

            // Buscar el producto por ID
            const buscado = await ProductModel.findById(id);

            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }
    async updateProduct(id, productoActualizado) {
        try {
            // Validar si el ID es un ObjectId válido
            if (!mongoose.isValidObjectId(id)) {
                console.log("ID no válido");
                return null;
            }

            const producto = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });

            if (!producto) {
                console.log("No encontre el producto :/");
                return null;
            } else {
                console.log("PRODUCTO ACTUALIZADO!!");
                return producto;
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            // Validar si el ID es un ObjectId válido
            if (!mongoose.isValidObjectId(id)) {
                console.log("ID no válido");
                return null;
            }

            const borrado = await ProductModel.findByIdAndDelete(id);
            if (!borrado) {
                console.log("No lo encontre :/");
                return null;
            } else {
                console.log("Producto eliminado");
                return borrado;
            }

        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;