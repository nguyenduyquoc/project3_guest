import React, {useEffect, useState} from "react";
import {useUser} from "../context/UserContext";
import {Link} from "react-router-dom";
import ProfileSidebar from "../elements/ProfileSidebar";
import {useLoading} from "../context/LoadingContext";
import {getOrderHistory} from "../services/user.service";
import formatDate from "../utils/datetimeFormatter";
import {formatCurrency} from "../utils/currencyFormatter";


function OrderHistory () {
    const { loadingDispatch } = useLoading();
    const {user} = useUser();
    const [orders, setOrders ] = useState([]);

    useEffect(()=>{
        fetchOrderHistory();
    }, [])

    const fetchOrderHistory = async () => {
        try {
            loadingDispatch({type: "START_LOADING"});
            const response = await getOrderHistory();
            setOrders(response);
        } catch (error) {
            console.log(error);
        } finally {
        loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    return(
        <>
            {user != null &&
                <div className="page-content bg-white">
                    <div className="content-block">
                        <section className="content-inner bg-white">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-3 col-lg-4 m-b30">
                                        <ProfileSidebar user={user} />
                                    </div>
                                    <div className="col-xl-9 col-lg-8 m-b30">
                                        <div className="shop-bx shop-profile">
                                            <div className="shop-bx-title clearfix">
                                                <h5 className="text-uppercase">Order History</h5>
                                            </div>

                                            <div className="table-responsive">
                                                <table className="table check-tbl">
                                                    <thead>
                                                    <tr>
                                                        <th>Order</th>
                                                        <th>Shipping Info</th>
                                                        <th>Status</th>
                                                        <th>Grand Total</th>
                                                        <th className="text-end">Detail</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {orders.length === 0 ?
                                                        <tr>
                                                            <td colSpan="6" className="text-center">(Your order history is empty)</td>
                                                        </tr>
                                                        :
                                                        <>
                                                            {orders.map((order, index)=>(
                                                                <tr key={order.id}>
                                                                    <td>
                                                                        <div className="fw-bold">{order.code}</div>
                                                                        <div className="text-primary font-14">Ordered on {formatDate(order.createdAt).formattedDate}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="fw-bold">{order.name} | {order.phone}</div>
                                                                        <div>{order.address}</div>
                                                                        <div>{order.district}, {order.province}</div>
                                                                    </td>
                                                                    <td>
                                                                        {(() => {
                                                                            switch (order.status) {
                                                                                case 0:
                                                                                    return <span className='badge badge-warning'>Pending</span>;
                                                                                case 1:
                                                                                    return <span className='badge badge-info'>Confirmed</span>;
                                                                                case 2:
                                                                                    return <span className='badge badge-light text-secondary'>Preparing</span>;
                                                                                case 3:
                                                                                    return <span className='badge' style={{backgroundColor: "#7239ea"}}>Shipping</span>;
                                                                                case 4:
                                                                                    return <span className='badge badge-secondary'>Delivered</span>;
                                                                                case 5:
                                                                                    return <span className='badge badge-success'>Completed</span>;
                                                                                case 6:
                                                                                    return <span className='badge badge-danger'>Canceled</span>;
                                                                                default:
                                                                                    return null; // Handle other cases or unknown values
                                                                            }
                                                                        })()}
                                                                    </td>
                                                                    <td>
                                                                        <div className="fw-bold text-center">{formatCurrency(order.grandTotal)}</div>
                                                                        <div className="text-center text-primary font-14">({order.paymentMethod})</div>
                                                                    </td>
                                                                    <td className="product-item-close">
                                                                        <Link
                                                                            className="bg-primary"
                                                                            to={`/order-history-detail/${order.code}`}
                                                                        >
                                                                            <i className="flaticon-right-arrow"></i>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            }
        </>
    )
}

export default OrderHistory;

