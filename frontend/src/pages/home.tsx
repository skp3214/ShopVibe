import { Link } from "react-router-dom"
import ProductCard from "../components/product-card.tsx"

const Home = () => {
  const addToCartHandler=()=>{};
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">More</Link>
      </h1>
      <main>
        <ProductCard productId="xyz" photo="https://pngimg.com/uploads/laptop/laptop_PNG101764.png" name="xyz" price={100} stock={10} handler={addToCartHandler}/>
      </main>
    </div>
  )
}

export default Home