import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

type ProductsProps = {
  productId: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined,
}
const ProductCard = ({
  productId,
  photos,
  name,
  price,
  stock,
  handler
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={photos[0].url} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button onClick={() => handler({
          productID: productId,
          photo:photos[0].url,
          name,
          price,
          stock,
          quantity: 1,
        })}><FaPlus /></button>
      </div>
    </div>
  )
}

export default ProductCard;