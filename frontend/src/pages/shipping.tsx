import { ChangeEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { CartReducerIntialState } from "../types/reducer.types"
import { useSelector } from "react-redux"

const Shipping = () => {
    const {cartItems}=useSelector((state:{cartReducer:CartReducerIntialState})=>state.cartReducer)
    const navigate=useNavigate();
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        country: "",
        state: "",
        pinCode: "",
    })
    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    useEffect(()=>{
        if(cartItems.length<=0){
            return navigate("/cart");
        }
    },[cartItems])
    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate(-1)}><BiArrowBack /></button>
            <form>
                <h1>Shipping Address</h1>
                <input type="text" name="address" placeholder="Enter Your Address" onChange={changeHandler} value={shippingInfo.address} />
                <input type="text" name="city" placeholder="Enter Your City" onChange={changeHandler} value={shippingInfo.city} />
                <input type="text" name="state" placeholder="Enter Your State" onChange={changeHandler} value={shippingInfo.state} />
                <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                    <option value="">Select Your Country</option>
                    <option value="USA">USA</option>
                    <option value="India">India</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                </select>
                <input type="number" name="pinCode" placeholder="Enter Your PinCode" onChange={changeHandler} value={shippingInfo.pinCode} />
                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping