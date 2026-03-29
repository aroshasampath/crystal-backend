import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
    if (req.user == null) {
        return res.status(401).json({
            message: "you are not authorized to create order"
        });
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
            return res.status(400).json({
                message: "items are required"
            });
        }

        if (!Array.isArray(itemsInRequest)) {
            return res.status(400).json({
                message: "items must be an array"
            });
        }

        if (itemsInRequest.length === 0) {
            return res.status(400).json({
                message: "cart is empty"
            });
        }

        const itemsToBeAdded = [];
        let total = 0;

        for (let i = 0; i < itemsInRequest.length; i++) {
            const item = itemsInRequest[i];

            const product = await Product.findOne({ productID: item.productID });

            if (product == null) {
                return res.status(400).json({
                    message: "product not found",
                    productID: item.productID
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: "product out of stock",
                    productID: item.productID
                });
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
            total: total,
            status: "pending"
        });

        const savedOrder = await newOrder.save();

        return res.status(201).json({
            message: "order created successfully",
            order: savedOrder
        });
    } catch (err) {
        console.log("create order error:", err);
        return res.status(500).json({
            message: "failed to create order",
            error: err.message
        });
    }
}

export async function getOrders(req, res) {
    try {
        if (req.user == null) {
            return res.status(401).json({
                message: "you are not authorized to view orders"
            });
        }

        if (isAdmin(req)) {
            const orders = await Order.find().sort({ date: -1 });
            return res.json(orders);
        } else {
            const orders = await Order.find({ email: req.user.email }).sort({ date: -1 });
            return res.json(orders);
        }
    } catch (err) {
        console.log("get orders error:", err);
        return res.status(500).json({
            message: "failed to fetch orders",
            error: err.message
        });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "only admin can update order status"
            });
        }

        const orderID = req.params.orderID;
        const status = req.body.status;

        if (!status) {
            return res.status(400).json({
                message: "status is required"
            });
        }

        const validStatuses = ["pending", "processing", "delivered", "cancelled"];

        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                message: "invalid status"
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { orderID: orderID },
            { status: status.toLowerCase() },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "order not found"
            });
        }

        return res.json({
            message: "order status updated successfully",
            order: updatedOrder
        });
    } catch (err) {
        console.log("update order status error:", err);
        return res.status(500).json({
            message: "failed to update order status",
            error: err.message
        });
    }
}