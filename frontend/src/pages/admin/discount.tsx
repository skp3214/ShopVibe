import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { SkeletonLoader } from "../../components/loader";
import { RootState} from "../../redux/store";
import { useAllCouponsQuery } from "../../redux/api/PaymentAPI";

interface DataType {
    code: string;
    amount: number;
    _id: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },

    {
        Header: "Code",
        accessor: "code",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Discount = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const {data,isLoading,error}=useAllCouponsQuery(user?._id as string);
    const [rows, setRows] = useState<DataType[]>([]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Products",
        rows.length > 6
    )();

    if (error) toast.error("Something went wrong while fetching data");

    useEffect(() => {
        if (data)
            setRows(
                data.coupons.map((coupons) => ({
                    _id: coupons._id,
                    code: coupons.couponCode,
                    amount: coupons.amount,
                    action: <Link to={`/admin/discount/${coupons._id}`}>Manage</Link>,
                }))
            );
    }, [data]);

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main>{isLoading ? <SkeletonLoader width="" /> : Table}</main>
            <Link to="/admin/discount/new" className="create-product-btn">
                <FaPlus />
            </Link>
        </div>
    );
};

export default Discount;