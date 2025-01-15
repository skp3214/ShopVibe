import { useState, FormEvent } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerIntialState } from "../../../types/reducer.types";
import { useNewProductMutation } from "../../../redux/api/ProductAPI";
import { useNavigate } from "react-router-dom";
import { responseToast } from "../../../utils/features";
import { useFileHandler } from "6pp";

const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerIntialState }) => state.userReducer
  )
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");

  const [newProduct] = useNewProductMutation()

  const photos = useFileHandler("multiple", 20, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      if (!name || !price || stock < 0 || !category || photos.file.length < 1 || !description) {
        return;
      }

      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);

      photos.file.forEach((file: File) => {
        formData.append("photos", file)
      })
      const res = await newProduct({ id: user?._id as string, formData })
      responseToast(res, navigate, "/admin/product")
    } catch (error) {
      console.log(error);
      
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input type="file" multiple required onChange={photos.changeHandler} />
            </div>
            {
              photos.error && <p>{photos.error}</p>
            }
            {
              photos.preview &&
              photos.preview.map((img: string, index: number) => (
                <img key={index} src={img} alt="preview" />
              ))
            }
            <button disabled={isLoading} type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
