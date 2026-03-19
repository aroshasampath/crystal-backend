import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res){

    if(!isAdmin(req)){
        res.json(
            {
                message : "you are not authorized to create product"
            }
            
        )
        return
    }

    try{
        const productData = req.body;
    const product = new Product(productData)

    await product.save()

    res.json(
        {
            message :"product create successfully",
            product : product
        }
    )

    }catch(err){
        res.status(500).json(
            {
                message : "failed to create product"
            }
        )
    }

    
}

export async function getProduct(req,res){
    try{
        const products = await Product.find()
        res.json(products)

    }catch(err){
         res.json({
            message : "failed to retrive products"
         })
    }
}


export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.json({
            message : "only admin can delete product"
        })
        return
    }

    try{
        const productID = req.params.productID;
        

        await Product.deleteOne({
            productID : productID
        })
        res.json({
            message : "product delete successfully "
        })

    }catch(err){
        res.json({
            message : "failed to delete product"
        })
    }

}

export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.json({
            message : "only admin can update product"
        })
        return;
    }

    try{
        const productID = req.params.productID;
        const updateData = req.body;

        await Product.updateOne(
            {
                productID : productID
            },
            updateData
        )

        res.json({
            message : "product updated successfully"
        })

    }catch(err){
        res.json({
            message : "failed to update product"
        })
    }
}

export async function getProductbyid(req,res){
    try{
        const productID = req.params.productID;

        const product = await Product.findOne({
            productID : productID
        })

        if(product == null){
            res.json({
                message : "product not found"
            })
            return
        }

        res.json(product)

    }catch(err){
        res.json({
            message : "failed to retrive product"
        })
    }
}