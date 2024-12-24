import { Link } from "react-router-dom"
import ProductCard from "../components/product-card.tsx"
import { useLatestProductsQuery } from "../redux/api/ProductAPI.ts";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/loader.tsx";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const addToCartHandler = () => { };
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
              photo={product.photo}
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