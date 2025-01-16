import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { RootState } from "../../../redux/store";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { SkeletonLoader } from "../../../components/loader";
import {
    useGetCouponDetailQuery,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} from "../../../redux/api/PaymentAPI";
import { responseToastDiscount } from "../../../utils/features";

const DiscountManagement = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: couponDetail, isLoading, error } = useGetCouponDetailQuery({ couponId: id as string, userId: user?._id as string });
    const { couponCode, amount } = couponDetail?.coupons || {
        couponCode: "",
        amount: 0
    }
    const [updateCoupon] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [couponCodeUpdate, setCouponCodeUpdate] = useState<string>(couponCode);
    const [amountUpdate, setAmountUpdate] = useState<number>(amount);

    useEffect(() => {
        if (error) {
            toast.error("Something went wrong while fetching data");
        }
    }, [error]);

    useEffect(() => {
        if (couponDetail) {
            setCouponCodeUpdate(couponDetail.coupons.couponCode!);
            setAmountUpdate(couponDetail.coupons.amount!);
        }
    }, [couponDetail]);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBtnLoading(true);

        try {
            const res = await updateCoupon({
                couponId: id as string,
                userId: user?._id as string,
                formData: {
                    couponCode: couponCodeUpdate,
                    amount: amountUpdate,
                },
            });

            responseToastDiscount(res, navigate, "/admin/discount");
        } catch (err) {
            toast.error("Failed to update the coupon");
            console.error(err);
        } finally {
            setBtnLoading(false);
        }
    };

    const deleteHandler = async () => {
        setBtnLoading(true);

        try {
            const response = await deleteCoupon({
                couponId: id as string,
                userId: user?._id as string,
            }).unwrap();

            if (response.success) {
                toast.success(response.message);
                navigate("/admin/discount");
            }
        } catch (err) {
            toast.error("Failed to delete the coupon");
            console.error(err);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="product-management">
                {isLoading ? (
                    <SkeletonLoader width="" />
                ) : (
                    <article>
                        <button className="product-delete-btn" onClick={deleteHandler}>
                            <FaTrash />
                        </button>
                        <form onSubmit={submitHandler}>
                            <h2>Manage Discount</h2>
                            <div>
                                <label>Name</label>
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    value={couponCodeUpdate}
                                    onChange={(e) => setCouponCodeUpdate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Price</label>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={amountUpdate}
                                    onChange={(e) => setAmountUpdate(Number(e.target.value))}
                                />
                            </div>

                            <button disabled={btnLoading} type="submit">
                                Update
                            </button>
                        </form>
                    </article>
                )}
            </main>
        </div>
    );
};

export default DiscountManagement;
