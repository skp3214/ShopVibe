import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItems from "../components/cart-items";
import { Link } from "react-router-dom";

const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 220;
const Discount = 400;
const total = subtotal + tax + shippingCharges - Discount;
const cartItems = [
  {
    productId: "123",
    name: "Asus",
    price: 100,
    quantity: 10,
    stock: 40,
    photo: "https://pngimg.com/uploads/laptop/laptop_PNG101764.png",
    handler: () => {

    }
  }
]
const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
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
  return (
    <div className="cart">
      <main>
        {
          cartItems.length>0?(
              cartItems.map((item, index) => (
                <CartItems key={index} cartItems={item} />
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
          Discount: <em className="red"> - ₹{Discount}</em>
        </p>
        <p><b>Total: ₹{total}</b></p>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {
          couponCode && (isValidCouponCode ? (<span className="green">₹{Discount} off using the <code>{couponCode}</code></span>) : (<span className="red">Invalid Coupon <VscError /></span>))
        }

        {
          cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart