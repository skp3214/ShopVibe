import mongoose from "mongoose"

export const connectDB = () => {
    mongoose.connect("mongodb+srv://skprajapati3214:Sachin3214@backend-cluster.qfpxr0l.mongodb.net/?retryWrites=true&w=majority", {
        dbName: "ShopVibe",
    }).then(() => {
        console.log("Database Connected");
    }).catch((err) => {
        console.log(err);
    })
}