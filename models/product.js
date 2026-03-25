import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productID :{
            type : String,
            unique :true,
            require :true
        },
        name :{
            type :String,
            require : true
        },
        altNames:{
            type:[String],
            default:[],
            require :true
        },
        discription :{
            type : String,
            require : true
        },
        images :{
            type : [String],
            default:[],
            require :true
        },
        price :{
            type : Number,
            require : true
        },
        labledPrice :{
            type : Number,
            require:true
        },
        category:{
            type : String,
            require : true
        },
        stock :{
            type : Number,
            require : true,
            default : 0
        }


    }
)

const Product = mongoose.model("Product",productSchema)
export default Product;
