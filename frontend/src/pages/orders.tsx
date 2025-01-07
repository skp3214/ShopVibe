import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC"
import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserReducerIntialState } from "../types/reducer.types";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/OrderAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api.types";
import { SkeletonLoader } from "../components/loader";
type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}
const column: Column<DataType>[] = [{
    Header: "Id",
    accessor: "_id",
},
{
    Header: "Quantity",
    accessor: "quantity",
},
{
    Header: "Discount",
    accessor: "discount",
},
{
    Header: "Amount",
    accessor: "amount",
}, {
    Header: "Status",
    accessor: "status",
}, {
    Header: "Action",
    accessor: "action",
}]
const Orders = () => {
    const { user } = useSelector((state: { userReducer: UserReducerIntialState }) => state.userReducer);
    const { isLoading, data, isError, error } = useMyOrdersQuery(user?._id!);
    const [rows, setRows] = useState<DataType[]>([])
    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }

    useEffect(() => {
        if (data?.orders) {
            setRows(
                data.orders.map((order) => ({
                    _id: order._id,
                    amount: order.total,
                    quantity: order.orderItems.length,
                    discount: order.discount,
                    status: <span>{order.status}</span>,
                    action: <Link to={`/order/${order._id}`}>View</Link>
                }))
            );
        }
    }, [data]);
    const Table = TableHOC<DataType>(
        column, rows, "dashboard-product-box",
        "Orders",
        rows.length > 6
    )();
    return (
        <div className="container">
            <h1>My Orders</h1>
            <main>{isLoading ? <SkeletonLoader width="" /> : Table}</main>
        </div>
    )
}

export default Orders