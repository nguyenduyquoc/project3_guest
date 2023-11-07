import React, {useEffect, useState} from "react";
import ProfileSidebar from "../elements/ProfileSidebar";
import {useUser} from "../context/UserContext";
import {useLoading} from "../context/LoadingContext";
import {getReturnRequestHistory} from "../services/user.service";
import {Link} from "react-router-dom";
import {formatCurrency} from "../utils/currencyFormatter";
import formatDate from "../utils/datetimeFormatter";

function ReturnRequestHistory () {

    const { loadingDispatch } = useLoading();
    const { user } = useUser();
    const [ returnRequests, setReturnRequests ] = useState([]);

    useEffect(() => {
        fetchReturnRequestHistory();
    }, [])

    const fetchReturnRequestHistory = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getReturnRequestHistory();
            setReturnRequests(response);
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
                                                <h5 className="text-uppercase">Return Request History</h5>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table check-tbl">
                                                    <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Request Info</th>
                                                        <th>Refund</th>
                                                        <th>Status</th>
                                                        <th className="text-center">Request Date</th>
                                                        <th className="text-end">Detail</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {returnRequests.length === 0 ?
                                                        <tr>
                                                            <td colSpan="6" className="text-center">(Your don't have any return request)</td>
                                                        </tr>
                                                        :
                                                        <>
                                                            {returnRequests.map((request)=>(
                                                                <tr key={request.id}>
                                                                    <td>
                                                                        <div className="">#{request.id}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="">
                                                                            For order:
                                                                            <span className="text-primary fw-bold m-l10">{request.order.code}</span>
                                                                        </div>
                                                                        <div>Reason: {request.returnReason}</div>
                                                                        <div>Return {request.returnProducts.reduce((total, product) => total + product.returnQuantity, 0)} product(s)</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="text-center">{formatCurrency(request.refundAmount)}</div>
                                                                    </td>
                                                                    <td>
                                                                        {(() => {
                                                                            switch (request.status) {
                                                                                case 0:
                                                                                    return <span className='badge badge-warning'>Pending</span>;
                                                                                case 1:
                                                                                    return <span className='badge badge-info'>Confirmed</span>;
                                                                                case 2:
                                                                                    return <span className='badge badge-light' style={{backgroundColor: "#7239ea"}}>Returning</span>;
                                                                                case 3:
                                                                                    return <span className='badge badge-success'>Completed</span>;
                                                                                case 4:
                                                                                    return <span className='badge badge-danger'>Declined</span>;
                                                                                default:
                                                                                    return null;
                                                                            }
                                                                        })()}
                                                                    </td>
                                                                    <td>
                                                                        <div className="text-center">{formatDate(request.createdAt).formattedDate}</div>
                                                                    </td>
                                                                    <td className="product-item-close">
                                                                        <Link
                                                                            className="bg-primary"
                                                                            to={`/return-requests/${request.id}`}
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

export default ReturnRequestHistory;