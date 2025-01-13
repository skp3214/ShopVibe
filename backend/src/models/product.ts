import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photos:[
      {
        public_id:{
          type:String,
          required:[true,"Please enter Public Id"]
        },
        url:{
          type:String,
          required:[true,"Please enter URL"]
        }
      }
    ],
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);