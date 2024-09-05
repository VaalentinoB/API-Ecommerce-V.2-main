import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    thumbnails: {
        type: [String]
    }
});

//Paginate
productSchema.plugin(paginate)
// Crear el modelo de Mongoose basado en el esquema
const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;

