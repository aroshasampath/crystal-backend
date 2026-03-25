import Order from "../models/order.js"

export async function createOrder(req,res){
    if(req.user == null){
        res.status(401).json({
            message : "you are not authorized to create order"
        })
        return
    }
    try{
        const orderList = await Order.find().sort({date : -1}).limit(1)
        let newOrderId = "crystal000001"
        if(orderList.length != 0){
            let lastOrderIdInString = orderList[0].orderID
            let lastOrderNumberInString = lastOrderIdInString.replace("crystal","")
            let lastOrderNumber = parseInt(lastOrderNumberInString)
            lastOrderNumber = lastOrderNumber + 1
            newOrderId = "crystal" + lastOrderNumber
        }

        const newOrder =new Order({
            orderID : newOrderId,
            items : [],
            customerName : req.body.customerName,
            address : req.body.address,
            phone : req.body.phone
        })

        const savedOrder = await newOrder.save()
        res.status(201).json({
            message : "order create successfully",
            order : savedOrder
        })

        const recentOrder = orderList[0]

    }catch(err){
        res.status(500).json({
            message : "failed to create order"
        })
    }

}