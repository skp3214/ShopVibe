import { useEffect, useState } from "react"
import ProductCard from "../components/product-card";
import { useCategoriesQuery, useSearchedProductsQuery } from "../redux/api/ProductAPI";
import { CustomError } from "../types/api.types";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/CartReducer";
import { useDispatch } from "react-redux";

const Search = () => {
  const { data: categoriesResponse, isLoading: loadingCategories, isError, error } = useCategoriesQuery("");
  useEffect(() => {
    if (isError) {
      toast.error((error as CustomError)?.data?.message || "An error occurred");
    }
  }, [isError, error]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState("100000");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { isLoading: productLoading, data: searchedData,
    isError: productIsError, error: productError
  } = useSearchedProductsQuery({ search, sort, price: Number(maxPrice), category, page });
  const addToCartHandler = (cartItem:CartItem) => {
    if(cartItem.stock<=0){
      return toast.error("Out of stock")
    }
    dispatch(addToCart(cartItem))
    toast.success("Added to cart")
  };  const isPrevPage = page > 1;
  const isNextPage = searchedData && page < searchedData.totalPages;
  if (productIsError) {
    toast.error((productError as CustomError)?.data?.message || "An error occurred");
  }

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
            <option value="">ALL</option>
            {
              !loadingCategories && categoriesResponse?.categories.map((category) => (
                <option key={category} value={category}>{category.toUpperCase()}</option>
              ))
            }
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
        {
          productLoading ? <SkeletonLoader width="" /> : (
            <div className="search-product-list">
              {
                productLoading ? "Loading..." : searchedData?.products.map((product) => (
                  <ProductCard key={product._id} productId={product._id} photo={product.photo} name={product.name} price={product.price} stock={product.stock} handler={addToCartHandler} />
                ))
              }
            </div>
          )
        }
        {
          searchedData && searchedData?.totalPages >= 1 && (
            <article>
              <button onClick={() => setPage((prev) => prev - 1)} disabled={!isPrevPage}>prev</button>
              <span>{page} of {searchedData.totalPages}</span>
              <button onClick={() => setPage((prev) => prev + 1)} disabled={!isNextPage}>next</button>
            </article>
          )
        }
      </main>
    </div>
  )
}

export default Search