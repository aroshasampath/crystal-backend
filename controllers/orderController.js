import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "you are not authorized to create order"
        });
        return;
    }

    try {
        const user = req.user;

        const orderList = await Order.find().sort({ date: -1 }).limit(1);

        let newOrderId = "crystal000001";

        if (orderList.length !== 0) {
            let lastOrderIdInString = orderList[0].orderID;
            let lastOrderNumberInString = lastOrderIdInString.replace("crystal", "");
            let lastOrderNumber = parseInt(lastOrderNumberInString);
            lastOrderNumber = lastOrderNumber + 1;
            newOrderId = "crystal" + String(lastOrderNumber).padStart(6, "0");
        }

        let customerName = req.body.customerName;
        if (customerName == null) {
            customerName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        }

        let phone = req.body.phone;
        if (phone == null) {
            phone = "Not Provided";
        }

        const itemsInRequest = req.body.items;

        if (itemsInRequest == null) {
            res.status(400).json({
                message: "items are required"
            });
            return;
        }

        if (!Array.isArray(itemsInRequest)) {
            res.status(400).json({
                message: "items must be an array"
            });
            return;
        }

        if (itemsInRequest.length === 0) {
            res.status(400).json({
                message: "cart is empty"
            });
            return;
        }

        const itemsToBeAdded = [];
        let total = 0;

        for (let i = 0; i < itemsInRequest.length; i++) {
            const item = itemsInRequest[i];

            const product = await Product.findOne({ productID: item.productID });

            if (product == null) {
                res.status(400).json({
                    message: "product not found",
                    productID: item.productID
                });
                return;
            }

            if (product.stock < item.quantity) {
                res.status(400).json({
                    message: "product out of stock",
                    productID: item.productID
                });
                return;
            }

            itemsToBeAdded.push({
                productID: product.productID,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                image: product.images?.[0] || ""
            });

            total = total + product.price * item.quantity;
        }

        const newOrder = new Order({
            orderID: newOrderId,
            items: itemsToBeAdded,
            customerName: customerName,
            email: user.email,
            address: req.body.address,
            phone: phone,
            total: total
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "order created successfully",
            order: savedOrder
        });
    } catch (err) {
        console.log("create order error:", err);
        res.status(500).json({
            message: "failed to create order",
            error: err.message
        });
    }
}