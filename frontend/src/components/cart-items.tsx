import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { CartItem } from "../types/types";

type CartItemsProps = {
    cartItem: CartItem;
    incrementHandler:(cartItem:CartItem)=>void;
    decrementHandler:(cartItem:CartItem)=>void;
    removeHandler:(id:string)=>void;
}
const CartItems = ({ cartItem,incrementHandler,decrementHandler,removeHandler }: CartItemsProps) => {
    return (
        <div className="cart-item">
            <img src={cartItem.photo} alt={cartItem.name} />
            <article>
                <Link to={`/product/${cartItem.productID}`}>{cartItem.name}</Link>
                <span>₹{cartItem.price}</span>
            </article>
            <div>
                <button onClick={()=>decrementHandler(cartItem)}>-</button>
                <p>{cartItem.quantity}</p>
                <button onClick={()=>incrementHandler(cartItem)}>+</button>
            </div>

            <button onClick={()=>removeHandler(cartItem.productID)}>
                <FaTrash />
            </button>
        </div>
    )
}

export default CartItems