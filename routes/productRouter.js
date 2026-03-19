import express from "express";
import { createProduct, deleteProduct, getProduct, getProductbyid, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getProduct)
productRouter.post("/",createProduct)
productRouter.delete("/:productID",deleteProduct)
productRouter.put("/:productID",updateProduct)
productRouter.get("/:productID",getProductbyid)

export default productRouter;
