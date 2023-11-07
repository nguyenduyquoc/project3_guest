import React, {useEffect, useState} from "react";
import {useLoading} from "../context/LoadingContext";
import {Link, useParams} from "react-router-dom";
import {getOrderHistoryDetail} from "../services/user.service";
import {useUser} from "../context/UserContext";
import ProfileSidebar from "../elements/ProfileSidebar";
import formatDate from "../utils/datetimeFormatter";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {confirmReceivedOrder} from "../services/order.service";
import {toast} from "react-toastify";
import CancelOrderModal from "../elements/CancelOrderModal";
import CreateReturnRequestModal from "../elements/CreateReturnRequestModal";

function OrderHistoryDetail () {
    const [ orderHistoryDetail, setOrderHistoryDetail ] = useState([]);
    const { loadingDispatch } = useLoading();
    const { code } = useParams();
    const { user } = useUser();
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        fetchOrderHistoryDetail();
    }, [code]);

    const fetchOrderHistoryDetail = async () => {
        try {
            loadingDispatch({type: "START_LOADING"});
            const response = await getOrderHistoryDetail(code);
            console.log(response);
            setOrderHistoryDetail(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: "STOP_LOADING"});
        }
    }

    const handleConfirmReceivedOrder = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            await confirmReceivedOrder({
                code: orderHistoryDetail.code,
                email: orderHistoryDetail.email
            });
            fetchOrderHistoryDetail();
        } catch (error) {
            console.log(error);
            toast.error("Can not confirm this order")
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

    const isWithinThreeDays = Date.now() - new Date(orderHistoryDetail.updatedAt).getTime() <= threeDaysInMilliseconds;

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
                                                <h5 className="text-uppercase">Order History · Order Detail</h5>
                                            </div>
                                            {
                                                <>
                                                    {orderHistoryDetail.status <= 5 &&
                                                        <div className="row mx-0 mb-2 order-tracking-container">
                                                            <div className="col-12 hh-grayBox pt45 pb20">
                                                                <div className="row justify-content-between">
                                                                    <div
                                                                        className={`order-tracking ${orderHistoryDetail.status >= 0 && "completed"}`}>
                                                                        <span className="is-complete"></span>
                                                                        <p>
                                                                            Pending<br/>
                                                                            {orderHistoryDetail.status === 0 &&
                                                                                <span className="text-black-50">
                                                                                {formatDate(orderHistoryDetail.updatedAt ? orderHistoryDetail.updatedAt : orderHistoryDetail.createdAt).formattedDate}
                                                                                </span>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={`order-tracking ${orderHistoryDetail.status >= 1 && "completed"}`}>
                                                                        <span className="is-complete"></span>
                                                                        <p>
                                                                            Confirmed<br/>
                                                                            {orderHistoryDetail.status === 1 &&
                                                                                <span className="text-black-50">
                                                                                    {formatDate(orderHistoryDetail.updatedAt ? orderHistoryDetail.updatedAt : orderHistoryDetail.createdAt).formattedDate}
                                                                                </span>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={`order-tracking ${orderHistoryDetail.status >= 2 && "completed"}`}>
                                                                        <span className="is-complete"></span>
                                                                        <p>
                                                                            Preparing<br/>
                                                                            {orderHistoryDetail.status === 2 &&
                                                                                <span className="text-black-50">
                                                                                    {formatDate(orderHistoryDetail.updatedAt ? orderHistoryDetail.updatedAt : orderHistoryDetail.createdAt).formattedDate}
                                                                                </span>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={`order-tracking ${orderHistoryDetail.status >= 3 && "completed"}`}>
                                                                        <span className="is-complete"></span>
                                                                        <p>
                                                                            Shipping<br/>
                                                                            {orderHistoryDetail.status === 3 &&
                                                                                <span className="text-black-50">
                                                                                    {formatDate(orderHistoryDetail.updatedAt ? orderHistoryDetail.updatedAt : orderHistoryDetail.createdAt).formattedDate}
                                                                                </span>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={`order-tracking ${orderHistoryDetail.status >= 4 && "completed"}`}>
                                                                        <span className="is-complete"></span>
                                                                        <p>
                                                                            Delivered<br/>
                                                                            {orderHistoryDetail.status === 4 &&
                                                                                <span className="text-black-50">
                                                                                    {formatDate(orderHistoryDetail.updatedAt ? orderHistoryDetail.updatedAt : orderHistoryDetail.createdAt).formattedDate}
                                                                                </span>
                                                                            }
                                                                            {/*{orderHistoryDetail.status < 4 && orderHistoryDetail.deliveryEstimate &&
                                                                                <span className="text-black-50">
                                                                                    {formatDate(orderHistoryDetail.deliveryEstimate).formattedDate}
                                                                                </span>
                                                                            }*/}
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={`order-tracking ${orderHistoryDetail.status >= 5 && "completed"}`}>
                                                                        <span className="is-complete"></span>
                                                                        <p>
                                                                            Completed<br/>
                                                                            {orderHistoryDetail.status === 5 &&
                                                                                <span className="text-black-50">
                                                                                    {formatDate(orderHistoryDetail.updatedAt ? orderHistoryDetail.updatedAt : orderHistoryDetail.createdAt).formattedDate}
                                                                                </span>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                    {orderHistoryDetail.status === 6 &&
                                                        <div className="card border rounded-2 text-secondary">
                                                            <div className="card-header font-16 border-0">
                                                                <span className="text-white bg-danger rounded-2 p-2">Order Canceled</span>
                                                            </div>
                                                            <div className="card-body pt-0">
                                                                <table className="table table-borderless">
                                                                    <tbody className="">
                                                                    <tr className="border-bottom">
                                                                        <td className="px-0 py-3 text-muted">
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="fas fa-calendar-times me-2"></i>
                                                                                Cancel Date
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-0 py-3 text-end">
                                                                            {formatDate(orderHistoryDetail.updatedAt).formattedDate} at {formatDate(orderHistoryDetail.updatedAt).time12Hour}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="">
                                                                        <td className="px-0 py-3 text-muted">
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="fas fa-bookmark me-2"></i>
                                                                                Cancel Reason
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-0 py-3 text-end">
                                                                            {orderHistoryDetail.cancelReason}
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    }

                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="card border rounded-2 text-secondary">
                                                                <div className="card-header font-18 fw-bold border-0">
                                                                    Order Info
                                                                </div>
                                                                <div className="card-body pt-0">
                                                                    <table className="table table-borderless">
                                                                        <tbody className="">
                                                                        <tr className="border-bottom">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-hashtag me-2"></i>
                                                                                    Order Code
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end fw-bold text-primary">
                                                                                {orderHistoryDetail.code}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="border-bottom">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-calendar-check me-2"></i>
                                                                                    Date Added
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {formatDate(orderHistoryDetail.createdAt).formattedDate}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="py-1">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center"
                                                                                     style={{whiteSpace: "nowrap"}}>
                                                                                    <i className="far fa-credit-card me-2"></i>
                                                                                    Payment Method
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {orderHistoryDetail.paymentMethod}
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="card border rounded-2 text-secondary">
                                                                <div className="card-header font-18 fw-bold border-0">
                                                                    Customer Info
                                                                </div>
                                                                <div className="card-body pt-0">
                                                                    <table className="table table-borderless">
                                                                        <tbody className="">
                                                                        <tr className="border-bottom">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-user me-2"></i>
                                                                                    Full Name
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {orderHistoryDetail.name}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="py-1 border-bottom">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-phone me-2"></i>
                                                                                    Phone
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {orderHistoryDetail.phone}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="py-1">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-envelope me-2"></i>
                                                                                    Email
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {orderHistoryDetail.email}
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="card border rounded-2 text-secondary">
                                                                <div className="card-header font-18 fw-bold border-0">
                                                                    Shipping Info
                                                                </div>
                                                                <div className="card-body pt-0">
                                                                    <table className="table table-borderless">
                                                                        <tbody className="">
                                                                        <tr className="border-bottom">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-map-marker-alt me-2"></i>
                                                                                    Address
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {orderHistoryDetail.address}, {orderHistoryDetail.district}, {orderHistoryDetail.province}, {orderHistoryDetail.country}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="py-1 border-bottom">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-shipping-fast me-2"></i>
                                                                                    Shipping Method
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {orderHistoryDetail.deliveryService}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="py-1">
                                                                            <td className="px-0 py-3 text-muted">
                                                                                <div className="d-flex align-items-center">
                                                                                    <i className="fas fa-truck-loading me-2"></i>
                                                                                    Expected Delivery Date
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-0 py-3 text-end">
                                                                                {formatDate(orderHistoryDetail.deliveryEstimate).formattedDate}
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="table-responsive mb-4">
                                                        <table className="table check-tbl ">
                                                            <thead>
                                                            <tr>
                                                                <th>Image</th>
                                                                <th style={{width: "40%"}}>Product name</th>
                                                                <th>Unit Price</th>
                                                                <th className="text-center">Quantity</th>
                                                                <th className="text-center">Total</th>
                                                                <th className="text-end">VAT</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {orderHistoryDetail.orderProducts == null ?
                                                                <tr>
                                                                    <td colSpan="6" className="text-center">(Your order is
                                                                        empty)
                                                                    </td>
                                                                </tr>
                                                                :
                                                                <>
                                                                    {orderHistoryDetail.orderProducts.map((product, index) => (
                                                                        <tr key={index}>
                                                                            <td className="product-item-img"><img
                                                                                src={addAutoWidthTransformation(product.product.thumbnail)}
                                                                                alt=""/></td>
                                                                            <td className="product-item-name">{product.product.name}</td>
                                                                            <td className="product-item-price">
                                                                                {formatCurrency(product.price)}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {product.quantity}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {formatCurrency(product.price * product.quantity)}
                                                                            </td>
                                                                            <td className="text-end">
                                                                                7%
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </>
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="row justify-content-end mb-3">
                                                        <div className="col-md-6">
                                                            <div className="widget">
                                                                <h4 className="widget-title fw-normal font-17">Order Total</h4>
                                                                <table className="table-borderless check-tbl m-b25">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td className="">Subtotal</td>
                                                                        <td className="text-end ">{formatCurrency(orderHistoryDetail.subtotal)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="">VAT</td>
                                                                        <td className="text-end ">7%</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="">Shipping</td>
                                                                        <td className="text-end ">{formatCurrency(orderHistoryDetail.deliveryFee)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="">
                                                                            Coupon
                                                                            <span className="text-primary">
                                                                        {orderHistoryDetail.couponAmount > 0 && ` (${orderHistoryDetail.couponCode})`}
                                                                    </span>
                                                                        </td>
                                                                        <td className="text-end ">
                                                                            {orderHistoryDetail.couponAmount > 0
                                                                                ? `- ${formatCurrency(orderHistoryDetail.couponAmount)}`
                                                                                : `${formatCurrency(0)}`}

                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="fw-bold">Grand Total</td>
                                                                        <td className="text-end fw-bold">{formatCurrency(orderHistoryDetail.grandTotal)}</td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">

                                                        {/* Case 1: If the order has not been delivered (status <= 2), you can cancel the order */}
                                                        {orderHistoryDetail.status <= 2 &&
                                                            <div className="col-12">
                                                                <button
                                                                    className="btn btn-danger w-100"
                                                                    onClick={() => setModalShow(true)}
                                                                >Cancel Order
                                                                </button>
                                                                <CancelOrderModal
                                                                    show={modalShow}
                                                                    onHide={() => setModalShow(false)}
                                                                    order={orderHistoryDetail}
                                                                    fetchOrderDetail={fetchOrderHistoryDetail}
                                                                />
                                                            </div>
                                                        }

                                                        {/*Case 2:If the order has been delivered (status = 4), is still within the 3-day return window and currently the return request has not been created*/}
                                                        {orderHistoryDetail.status === 4 && isWithinThreeDays && orderHistoryDetail.returnRequestId == null &&
                                                            <>
                                                                <div className="col-md-6">
                                                                    <button
                                                                        className="btn btn-outline-primary btnhover w-100"
                                                                        onClick={() => setModalShow(true)}
                                                                    >
                                                                        Return / Refund
                                                                    </button>
                                                                    <span className="text-muted font-14">* You can return order within 3 days from delivered date.</span>
                                                                    {/*<CreateReturnRequestModal
                                                                        show={modalShow}
                                                                        onHide={() => setModalShow(false)}
                                                                        order={orderHistoryDetail}
                                                                        fetchOrderDetail={fetchOrderHistoryDetail}
                                                                    />*/}
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <button
                                                                        className="btn btn-primary btnhover w-100"
                                                                        onClick={handleConfirmReceivedOrder}
                                                                    >
                                                                        Order Received
                                                                    </button>
                                                                </div>
                                                            </>
                                                        }

                                                        {/* Case 3: A return request have been created */}
                                                        {/*{orderHistoryDetail.returnRequestId &&
                                                            <div className="col-12">
                                                                <div
                                                                    className="rounded-2 border-primary d-flex justify-content-between align-items-center p-3"
                                                                    style={{backgroundColor: "#eaa4511a", borderLeft: "3px solid"}}
                                                                >
                                                                    <div className="text-black">
                                                                        {`Your return request for this order is `}
                                                                        {(() => {
                                                                            switch (orderHistoryDetail.returnRequestStatus) {
                                                                                case 0:
                                                                                    return <span className='fw-bold text-warning text-uppercase'>Pending</span>;
                                                                                case 1:
                                                                                    return <span className='fw-bold text-info text-uppercase'>Confirmed</span>;
                                                                                case 2:
                                                                                    return <span className='fw-bold text-uppercase' style={{color: "#7239ea"}}>Returning</span>;
                                                                                case 3:
                                                                                    return <span className='fw-bold text-success text-uppercase'>Completed</span>;
                                                                                case 4:
                                                                                    return <span className='fw-bold text-danger text-uppercase'>Declined</span>;
                                                                                default:
                                                                                    return null;
                                                                            }
                                                                        })()}
                                                                    </div>
                                                                    <Link
                                                                        to={`/return-requests/${orderHistoryDetail.returnRequestId}`}
                                                                        className="btn btn-primary btnhover"
                                                                    >
                                                                        View detail
                                                                        <i className="fas fa-chevron-right m-l10"></i>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        }*/}
                                                    </div>
                                                </>
                                            }
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

export default OrderHistoryDetail;