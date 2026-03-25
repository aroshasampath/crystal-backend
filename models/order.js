import mongoose from "mongoose";    

const orderSchema = new mongoose.Schema({
    orderID :{
        type:String,
        unique :true,
        require :true
    },
    items :{
        type:[
            {
                productID :{
                    type : String,
                    require : true
                },
                name :{
                    type : String,
                    require : true
                },
                quantity :{
                    type : Number,
                    require : true
                },
                price :{
                    type : Number,
                    require : true
                },
                image:{
                    type : String,
                    require : true
                }
            }
        ],
        require :true
    },
    customerName:{
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true
    },
    phone:{
        type : String,
        require : true
    },
    address:{
        type : String,
        require : true
    },
    total:{
        type : Number,
        require : true
    },
    status:{
        type : String,
        require : true,
        default : "pending"
    },
    date:{
        type : Date,
        default : Date.now
    }
});

const Order = mongoose.model("Order",orderSchema);

export default Order