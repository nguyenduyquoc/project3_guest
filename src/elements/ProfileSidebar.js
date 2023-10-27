import React from "react";
import {Link, useLocation} from "react-router-dom";
import profile from './../assets/images/profile-yellow.png';
import {useAuth} from "../context/AuthContext";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";

function ProfileSidebar ({user}) {

    const location = useLocation();
    const { authDispatch } = useAuth();

    return (
        <div className="sticky-top">
            <div className="shop-account">
                <div className="account-detail text-center">
                    <div className="my-image">
                        <Link to={"#"}>
                            <img alt="profile" src={user.avatar ? addAutoWidthTransformation(user.avatar) : profile}/>
                        </Link>
                    </div>
                    <div className="account-title">
                        <div className="">
                            <h4 className="m-b5"><Link to={"#"}>{user.fname} {user.lname}</Link></h4>
                        </div>
                    </div>
                </div>
                <ul className="account-list">
                    <li>
                        <Link to={"/my-profile"} className={location.pathname === '/my-profile' ? 'active' : ''}><i className="far fa-user" aria-hidden="true"></i>
                            <span>Profile</span></Link>
                    </li>
                    <li>
                        <Link to={"/order-history"} className={location.pathname.startsWith('/order-history') ? 'active' : ''}>
                            <i className="flaticon-shopping-cart-1"></i>
                            <span>Order History</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/return-requests"} className={location.pathname.startsWith('/return-requests') ? 'active' : ''}>
                            <i className="flaticon-transfer"></i>
                            <span>Return Request</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"my-profile"} className="">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Addresses</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            className=""
                            onClick={() => {
                                authDispatch({ type: 'LOGOUT' });
                            }}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Log Out</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default ProfileSidebar;