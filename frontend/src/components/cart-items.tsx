import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"

type CartItemsProps = {
    cartItems: any
}
const CartItems = ({ cartItems }: CartItemsProps) => {
    return (
        <div className="cart-item">
            <img src={cartItems.photo} alt={cartItems.name} />
            <article>
                <Link to={`/product/${cartItems.productId}`}>{cartItems.name}</Link>
                <span>₹{cartItems.price}</span>
            </article>
            <div>
                <button>-</button>
                <p>{cartItems.quantity}</p>
                <button>+</button>
            </div>

            <button>
                <FaTrash />
            </button>
        </div>
    )
}

export default CartItems