import { useParams, useNavigate } from "react-router-dom";
import { useOrderDetailsQuery, useDeleteOrderMutation } from "../redux/api/OrderAPI";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserReducerIntialState } from "../types/reducer.types";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerIntialState }) => state.userReducer
  )
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useOrderDetailsQuery(id as string);
  const [deleteOrder] = useDeleteOrderMutation();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const handleDeleteOrder = async () => {
    setBtnLoading(true);

    try {
      await deleteOrder({ orderId: id as string, userId: user?._id as string });
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to delete order");
    }
    setBtnLoading(false);
  };

  if (isLoading) return <div className="order-details-loading">Loading...</div>;
  if (error) return <div className="order-details-error">Error fetching order details.</div>;

  return (
    <div className="order-details">
      <h1>Order Details</h1>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p><strong>Order ID:</strong> {data?.orders._id}</p>
        <p><strong>Status:</strong> {data?.orders.status}</p>
        <p><strong>Subtotal:</strong> ₹{data?.orders.subtotal}</p>
        <p><strong>Tax:</strong> ₹{data?.orders.tax}</p>
        <p><strong>Shipping Charges:</strong> ₹{data?.orders.shippingCharges}</p>
        <p><strong>Discount:</strong> ₹{data?.orders.discount}</p>
        <p><strong>Total:</strong> ₹{data?.orders.total}</p>
      </div>

      <div className="shipping-info">
        <h2>Shipping Information</h2>
        <p><strong>Address:</strong> {data?.orders.shippingInfo?.address}</p>
        <p><strong>City:</strong> {data?.orders.shippingInfo?.city}</p>
        <p><strong>State:</strong> {data?.orders.shippingInfo?.state}</p>
        <p><strong>Country:</strong> {data?.orders.shippingInfo?.country}</p>
        <p><strong>Pin Code:</strong> {data?.orders.shippingInfo?.pinCode}</p>
      </div>

      <div className="order-items">
        <h2>Order Items</h2>
        {data?.orders.orderItems?.map((item) => (
          <div key={item._id} className="order-item">
            <img src={item.photo} alt={item.name} />
            <div>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Price:</strong> ₹{item.price}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="delete-order-btn"
        onClick={handleDeleteOrder}
        disabled={btnLoading}
      >
        {btnLoading ? "Deleting..." : "Delete Order"}
      </button>
    </div>
  );
};

export default OrderDetails;
