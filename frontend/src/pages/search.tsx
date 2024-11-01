import { useState } from "react"
import ProductCard from "../components/product-card";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const addToCartHandler = () => { };
  const isNextPage = page>1;
  const isPrevPage = page<4;

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="asc">Price (asc)</option>
            <option value="desc">Price (desc)</option>
          </select>
        </div>
        <div>
          <h4>Max Price:{maxPrice || "0"}</h4>
          <input type="range" min="0" max="100000" onChange={(e) => setMaxPrice(e.target.value)} value={maxPrice} />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="camera">Camera</option>
            <option value="game">Game</option>
            <option value="laptop">Laptop</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
        <div className="search-product-list">
          <ProductCard productId="xyz" photo="https://pngimg.com/uploads/laptop/laptop_PNG101764.png" name="xyz" price={100} stock={10} handler={addToCartHandler} />
        </div>
        <article>
          <button onClick={() => setPage((prev) => prev - 1)} disabled={!isPrevPage}>prev</button>
          <span>{page} of 5</span>
          <button onClick={() => setPage((prev) => prev + 1)} disabled={!isNextPage}>next</button>
        </article>
      </main>
    </div>
  )
}

export default Search