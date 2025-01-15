import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { RootState} from "../../../redux/store";
import { useCreateCouponMutation } from "../../../redux/api/PaymentAPI";
import { responseToastDiscount } from "../../../utils/features";

const NewDiscount = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const navigate = useNavigate();
    const [createCoupon] = useCreateCouponMutation();
    const [btnLoading, setBtnLoading] = useState<boolean>(false);

    const [code, setCode] = useState("");
    const [amount, setAmount] = useState(0);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setBtnLoading(true);

        try {
            const res = await createCoupon({
                userId: user?._id as string,
                formData: {
                    couponCode: code,
                    amount: amount,
                }
            });

            responseToastDiscount(res, navigate, "/admin/discount");
        } catch (error) {
            console.log(error);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="product-management">
                <article>
                    <form onSubmit={submitHandler}>
                        <h2>New Coupon</h2>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Coupon Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Price</label>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>

                        <button disabled={btnLoading} type="submit">
                            Create
                        </button>
                    </form>
                </article>
            </main>
        </div>
    );
};

export default NewDiscount;