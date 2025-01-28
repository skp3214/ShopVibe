import { FaPlus, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";
import { transformImage } from "../utils/features";
interface ProductsProps {
  productId: string;
  photos: { url: string }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => Promise<string | undefined>;
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
      {photos && photos[0] ? (
        <img src={transformImage(photos[0]?.url,700)} alt={name} />
      ) : (
        <span>No Image</span>
      )}
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button onClick={() => handler({
          productID: productId,
          photo: photos && photos[0] ? photos[0].url : "",
          name,
          price,
          stock,
          quantity: 1,
        })}><FaPlus /></button>
        <Link to={`/product/${productId}`}> <FaExternalLinkAlt/> </Link>  
      </div>
    </div>
  )
}

export default ProductCard;