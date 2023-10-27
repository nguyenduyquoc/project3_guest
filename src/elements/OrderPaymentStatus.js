import {formatCurrency} from "../utils/currencyFormatter";
import {Link} from "react-router-dom";
import React from 'react';

const OrderPaymentStatus = ({paymentSuccess, setPaymentStatus, createdOrder}) => {

    return(
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 position-relative mt-5 rounded-3 p-5" style={{boxShadow: "1px 0 50px rgba(0, 0, 0, 0.1)"}}>
                    {paymentSuccess ?
                        <span className="icon-container d-flex justify-content-center align-items-center bg-primary">
                            <i className="fas fa-clipboard-check" style={{scale:"3"}}></i>
                        </span>
                        :
                        <span className="icon-container d-flex justify-content-center align-items-center bg-primary">
                            <i className="fas fa-exclamation" style={{scale:"3"}}></i>
                        </span>
                    }
                    <div className="tp-donations-amount text-center">
                        {paymentSuccess ?
                            <>
                                <h3 className="mt-4">Payment Success!</h3>
                                <p className="mb-0">Your order have been confirmed.</p>
                                <p className="mb-0">Check your email for more detail.</p>
                            </>
                            :
                            <>
                                <h3 className="mt-4">Ops! Something Wrong.</h3>
                                <p className="mb-0">Your payment have fail or have been canceled.</p>
                            </>
                        }
                        <table className="table-bordered check-tbl mt-4 m-b40 text-start">
                            <tbody>
                            <tr>
                                <td>Order Tracking</td>
                                <td className="fw-bold text-primary">{createdOrder.code}</td>
                            </tr>
                            <tr>
                                <td>Customer Info</td>
                                <td>
                                    <div><span className="fw-bold">{createdOrder.name}</span> | {createdOrder.phone}</div>
                                    <div>{createdOrder.email}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>Shipping Address</td>
                                <td>
                                    <div>{createdOrder.address}</div>
                                    <div>{createdOrder.district}, {createdOrder.province}, {createdOrder.country}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>Total Payment</td>
                                <td>{formatCurrency(createdOrder.grandTotal)} ({createdOrder.paymentMethod})</td>
                            </tr>
                            </tbody>
                        </table>
                        {paymentSuccess ?
                            <Link to="/" class="btn btn-primary" >
                                Back to Home
                                <i className="fa fa-angle-right m-l10"></i>
                            </Link>
                            :
                            <Link class="btn btn-primary" style={{paddingRight: "30px"}} onClick={() => setPaymentStatus(null)}>
                                Retry Payment
                                <i className="fas fa-undo m-l10"></i>
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderPaymentStatus;