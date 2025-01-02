import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItems from "../components/cart-items";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerIntialState } from "../types/reducer.types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, removeFromCart } from "../redux/reducer/CartReducer";

const Cart = () => {
  const {cartItems,subtotal,tax,total,shippingCharges,discount}=useSelector((state:{cartReducer:CartReducerIntialState})=>state.cartReducer)
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const dispatch = useDispatch();
  const incrementHandler = (cartItem:CartItem) => {
    if(cartItem.quantity>=cartItem.stock){
      return;
    }
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity+1}))
  };
  const decrementHandler = (cartItem:CartItem) => {
    if(cartItem.quantity<=1){
      return;
    }
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}))
  };
  const removeHandler = (id:string) => {
    dispatch(removeFromCart(id))
  };
  useEffect(() => {
    const id = setTimeout(() => {
      if (Math.random() > 0.5) {
        setIsValidCouponCode(true)
      }
      else {
        setIsValidCouponCode(false)
      }
    }, 1000)
    return () => {
      clearTimeout(id)
      setIsValidCouponCode(false)
    }
  }, [couponCode])
  useEffect(()=>{
    dispatch(calculatePrice())
  },[cartItems])
  return (
    <div className="cart">
      <main>
        {
          cartItems.length>0?(
              cartItems.map((item, index) => (
                <CartItems key={index} cartItem={item} incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler} />
              ))
          ):(
            <h1>No items in cart</h1>
          )
        }
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Tax: ₹{tax}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p><b>Total: ₹{total}</b></p>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {
          couponCode && (isValidCouponCode ? (<span className="green">₹{discount} off using the <code>{couponCode}</code></span>) : (<span className="red">Invalid Coupon <VscError /></span>))
        }

        {
          cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart