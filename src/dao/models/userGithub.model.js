import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{type: String, unique:true},
    age:Number,
    password:{type:String},
    cart: String,
    rol:String
});
const usersModel = mongoose.model("users", userSchema);
export default usersModel;