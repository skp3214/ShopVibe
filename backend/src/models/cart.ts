import mongoose from "mongoose"

const schema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            ref: "User",
        },
        cartItems: [
            {
                productID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                photo: String,
                name: String,
                price: Number,
                quantity: Number,
                stock: Number,
            }
        ]
    },
    {
        timestamps: true,
    }
)

export const Cart = mongoose.model("Cart", schema);