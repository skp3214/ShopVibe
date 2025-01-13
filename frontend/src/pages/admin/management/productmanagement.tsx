import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerIntialState } from "../../../types/reducer.types";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/ProductAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SkeletonLoader } from "../../../components/loader";
import { responseToast } from "../../../utils/features";
import { useFileHandler } from "6pp";

const Productmanagement = () => {

  const { user } = useSelector(
    (state: { userReducer: UserReducerIntialState }) => state.userReducer
  )

  const params = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);
  console.log(data);
  const { _id, name, price, stock, category, photos } = data?.product || {
    _id: "",
    name: "",
    price: 0,
    stock: 0,
    category: "",
    photos: []
  };

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);

  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  const photosFiles = useFileHandler("multiple", 20, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const formData = new FormData();
      if (!stockUpdate) {
        setStockUpdate(0);
      }
      if (!nameUpdate || !priceUpdate || !categoryUpdate) {
        return;
      }
      if (nameUpdate) {
        formData.set("name", nameUpdate);
      }
      if (priceUpdate) {
        formData.set("price", priceUpdate.toString());
      }
      if (stockUpdate !== undefined && stockUpdate !== null) {
        formData.set("stock", stockUpdate.toString());
      }
      if (categoryUpdate) {
        formData.set("category", categoryUpdate);
      }
      if (photosFiles.file && photosFiles.file.length > 0) {
        photosFiles.file.forEach((file) => {
          formData.append("photos", file);
        });
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const res = await updateProduct({ userId: user?._id as string, productId: _id as string, formData })
      responseToast(res, navigate, "/admin/product")
    } catch (error) {
      console.log(error);
    }
    finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name)
      setPriceUpdate(data.product.price)
      setStockUpdate(data.product.stock)
      setCategoryUpdate(data.product.category)
    }

    return () => {
    }
  }, [data])

  if (isError) {
    return <Navigate to="/404" />;
  }

  const deleteHandler = async () => {
    const res = await deleteProduct({ userId: user?._id as string, productId: _id as string })
    responseToast(res, navigate, "/admin/product")
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {
          isLoading ? SkeletonLoader({ width: "" }) : (
            <>
              <section>
                <strong>ID -{_id} </strong>
                <img src={`${photos[0]?.url}`} alt="Product" />
                <p>{name}</p>
                {stock > 0 ? (
                  <span className="green">{stock} Available</span>
                ) : (
                  <span className="red"> Not Available</span>
                )}
                <h3>₹{price}</h3>
              </section>
              <article>
                <button className="product-delete-btn" onClick={deleteHandler}>
                  <FaTrash />
                </button>
                <form onSubmit={submitHandler}>
                  <h2>Manage</h2>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={nameUpdate}
                      onChange={(e) => setNameUpdate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={priceUpdate}
                      onChange={(e) => setPriceUpdate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Stock</label>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={stockUpdate}
                      onChange={(e) => setStockUpdate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      placeholder="eg. laptop, camera etc"
                      value={categoryUpdate}
                      onChange={(e) => setCategoryUpdate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Photos</label>
                    <input type="file" multiple onChange={photosFiles.changeHandler} />
                  </div>
                  {
                    photosFiles.error && <p>{photosFiles.error}</p>
                  }
                  {
                    photosFiles.preview &&
                    photosFiles.preview.map((img: string, index: number) => (
                      <img key={index} src={img} alt="preview" />
                    ))
                  }
                  <button disabled={btnLoading} type="submit">Update</button>
                </form>
              </article>
            </>
          )

        }
      </main>
    </div>
  );
};

export default Productmanagement;
