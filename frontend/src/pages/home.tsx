import { Link } from "react-router-dom"
import ProductCard from "../components/product-card.tsx"
import { useLatestProductsQuery } from "../redux/api/ProductAPI.ts";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/loader.tsx";
import { CartItem } from "../types/types.ts";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/CartReducer.ts";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();
  const addToCartHandler = (cartItem:CartItem) => {
    if(cartItem.stock<=0){
      return toast.error("Out of stock")
    }
    dispatch(addToCart(cartItem))
    toast.success("Added to cart")
  };
  if (isLoading) return <>
    <SkeletonLoader width="" />
  </>
  if (isError) toast.error("Failed to fetch products");
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">More</Link>
      </h1>
      <main>
        {
          data?.products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              photos={product.photos}
              name={product.name}
              price={product.price}
              stock={product.stock}
              handler={addToCartHandler}
            />
          ))
        }
      </main>
    </div>
  )
}

export default Home