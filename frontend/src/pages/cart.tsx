import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItems from "../components/cart-items";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerIntialState } from "../types/reducer.types";
import { CartItem } from "../types/types";
import axios from "axios";
import { RootState, server } from "../redux/store";
import { useAddToCartMutation, useDeleteCartItemMutation, useGetCartQuery } from "../redux/api/CartAPI";
import { addToCart, calculatePrice, discountApplied } from "../redux/reducer/CartReducer";
import toast from "react-hot-toast";
import { CustomError } from "../types/api.types";

const Cart = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { subtotal, tax, total, shippingCharges, discount } = useSelector(
    (state: { cartReducer: CartReducerIntialState }) => state.cartReducer
  );
  const dispatch = useDispatch();
  const { data: cartData, isLoading: cartLoading, isError: cartError,error } = useGetCartQuery(user?._id as string);
  useEffect(() => {
    if (cartError) {
      toast.error((error as CustomError)?.data?.message || "An error occurred");
    }
  }, [cartError]);
  const cartItems = cartData?.cart?.cartItems || [];
  
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const [addCart] = useAddToCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(addToCart(cartItems)); 
      dispatch(calculatePrice()); 
    }
  }, [cartItems, dispatch]);

  const incrementHandler = async (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;

    const updatedCartItem = { ...cartItem, quantity: 1 };
    await addCart({
      userId: user?._id as string,
      cartItems: updatedCartItem,
    });
  };

  const decrementHandler = async (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;

    const updatedCartItem = { ...cartItem, quantity: - 1 };
    await addCart({
      userId: user?._id as string,
      cartItems: updatedCartItem,
    });
  };

  const removeHandler = async (id: string) => {
    await deleteCartItem({
      userId: user?._id as string,
      productID: id,
    });
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const id = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?couponCode=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(id);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode, dispatch]);

  return (
    <div className="cart">
      <main>
        {cartLoading ? (
          <h1>Loading...</h1>
        ) : cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <CartItems
              key={index}
              cartItem={item}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No items in cart</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Tax: ₹{tax}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
