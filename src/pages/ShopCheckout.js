import React, {useEffect, useState} from 'react';
//import {Link} from 'react-router-dom';
import { Collapse, Form } from 'react-bootstrap';

//Components 
import PageTitle from './../layouts/PageTitle';

import {useUser} from "../context/UserContext";
import {useLoading} from "../context/LoadingContext";
import {useCart} from "../context/CartContext";
import SimpleReactValidator from "simple-react-validator";
import {useProvinces} from "../context/ProvinceContext";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {Link, useLocation} from "react-router-dom";
import {formatCurrency} from "../utils/currencyFormatter";
import {useCouponContext} from "../context/CouponContext";
import {postOrder} from "../services/order.service";
import {toast} from "react-toastify";
import PaypalCheckoutButton from "../elements/PaypalCheckoutButton";
import OrderPaymentStatus from "../elements/OrderPaymentStatus";

function ShopCheckout(){
    const { user } = useUser();
    const { loadingDispatch } = useLoading();
    const { cartState } = useCart();

    const {
        provinces,
        selectedProvinceId, selectedDistrictId,
        setSelectedProvinceId, setSelectedDistrictId,
        deliveryFee
    } = useProvinces();

    const {
        coupon,
        discountAmount
    } = useCouponContext();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        district: '',
        province: '',
        note: '',
        paymentMethod: '',
    });

    useEffect(() => {
        setFormData({
            ...formData,
            firstName: user ? user.fname : '',
            lastName: user ? user.lname : '',
            email: user ? user.email : '',
            phone: user ? user.phone : ''
        });
        if (user && !validator.allValid()) {
            validator.showMessages();
        }
    }, [user])

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const [ createdOrder, setCreatedOrder ]= useState(null);
    const [ paymentStatus, setPaymentStatus ] = useState(null);

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        validator.showMessages();
    };

    const handleProvinceChange = (event) => {
        const selectedProvinceId = parseInt(event.target.value, 10);
        setSelectedProvinceId(selectedProvinceId);
        setSelectedDistrictId(null); // Reset selected district when province changes

        //Set the selected Province's name to formData
        const selectedProvince = provinces.find((province) => province.id === selectedProvinceId);
        setFormData({
            ...formData,
            province: (selectedProvince ? selectedProvince.name : ''),
            district: ''
        });
    };

    const handleDistrictChange = (event) => {
        const selectedDistrictId = parseInt(event.target.value, 10);
        setSelectedDistrictId(selectedDistrictId);

        //Set the selected District's name to formData
        const selectedDistrict =
            selectedProvinceId
            ? provinces.find((province) => province.id === selectedProvinceId).districts.find((district) => district.id === selectedDistrictId)
            : null;
        setFormData({ ...formData,
            district: (selectedDistrict ? selectedDistrict.name : '') });
    };

    const handleChangeAddress = (userAddress) => {
        setSelectedProvinceId(userAddress.provinceId);
        setSelectedDistrictId(userAddress.districtId);

        //set formData
        setFormData({
            ...formData,
            address: userAddress.address,
            province: userAddress.provinceName,
            district: userAddress.districtName
        });
    }

    const handlePaymentMethodChange = (e) => {
        const selectedPaymentMethod = e.target.value;
        setFormData({
            ...formData,
            paymentMethod: selectedPaymentMethod,
        });
    };

    //
    const calculateSubtotal = (product) => {
        const subtotal = (product.price - (product.discountAmount || 0)) * product.buy_quantity;
        return parseFloat(subtotal.toFixed(2));
    };

    const calculateTotal = () => {
        const total = cartState.cartItems.reduce((total, product) => total + calculateSubtotal(product), 0);
        return parseFloat(total.toFixed(2));
    };

    const calculateGrandTotal = () => {
        const grandTotal = calculateTotal() + deliveryFee - discountAmount;
        return parseFloat(grandTotal.toFixed(2));
    };

    const canCheckout = () => {
        // Check if the cart is not empty and if all buy_quantity values are less than or equal to quantity for each product
        return (
            cartState.cartItems.length > 0 &&
            cartState.cartItems.every((product) => product.buy_quantity <= product.quantity)
        );
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                const orderData = {
                    name: formData.firstName + ' ' + formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    district: formData.district,
                    province: formData.province,
                    country: "Vietnam",
                    note: formData.note.trim() === '' ? null : formData.note,
                    subtotal: calculateTotal(),
                    deliveryFee: deliveryFee,
                    couponCode: discountAmount > 0 ? coupon.code : null,
                    couponAmount: discountAmount > 0 ? discountAmount : null,
                    grandTotal: calculateGrandTotal(),
                    paymentMethod: formData.paymentMethod,
                    userId: user ? user.id : null,
                    orderProducts: cartState.cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.buy_quantity,
                        price: item.price - item.discountAmount,
                    })),
                };
                console.log("orderData", orderData);
                const postResult = await postOrder(orderData);
                console.log("postResult",postResult);
                setCreatedOrder(postResult);
                console.log("paymentStatus",postResult.status);
                // If payment method is COD then set paymentStatus to true
                postResult.status === 1 &&
                    setPaymentStatus(true);
                    console.log("paymentStatus",paymentStatus);


            } catch (error) {
                console.error('Error creating order:', error);
                toast.error('Can not create order!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            validator.showMessages();
            // toast.error('Empty field is not allowed!');
        }
    };
    const location = useLocation();
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Checkout" />               
                <section className="content-inner-1">
				{/* <!-- Product --> */}
                    {(createdOrder == null && paymentStatus == null) &&
                        <div className="container">
                            <form className="shop-form">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            <h4 className="widget-title">Billing & Shipping Address</h4>
                                            <div className="row">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        className="form-control"
                                                        placeholder="First Name"
                                                        value={formData.firstName}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('firstName', formData.firstName, 'required')}
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        className="form-control"
                                                        placeholder="Last Name"
                                                        value={formData.lastName}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('lastName', formData.lastName, 'required')}
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Email"
                                                        value={formData.email}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('email', formData.email, 'required|email')}
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        className="form-control"
                                                        placeholder="Phone"
                                                        value={formData.phone}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('phone', formData.phone, 'required|phone')}
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        className="form-control"
                                                        placeholder="Address"
                                                        value={formData.address}
                                                        onChange={(e) => changeHandler(e)}
                                                    />
                                                    {validator.message('address', formData.address, 'required')}
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <Form.Select
                                                        aria-label="Credit Card Type"
                                                        onChange={handleProvinceChange}
                                                        value={selectedProvinceId}
                                                    >
                                                        <option value="">Province</option>
                                                        {provinces.map(province =>
                                                            <option key={province.id} value={province.id}>
                                                                {province.name}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                    {validator.message('province', formData.province, 'required')}
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <Form.Select
                                                        aria-label="Credit Card Type"
                                                        onChange={handleDistrictChange}
                                                        value={selectedDistrictId}
                                                    >
                                                        <option value="">District</option>
                                                        {selectedProvinceId &&
                                                            provinces.find((province) => province.id === selectedProvinceId).districts.map(district =>
                                                                <option key={district.id} value={district.id}>
                                                                    {district.name}
                                                                </option>
                                                            )
                                                        }
                                                    </Form.Select>
                                                    {validator.message('district', formData.district, 'required')}
                                                </div>
                                                <div className="form-group">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Notes about your order"
                                                    value={formData.note}
                                                    onChange={(e) => changeHandler(e)}
                                                ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            <h4 className="widget-title">Your Addresses</h4>
                                            {user == null ?
                                                <>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <Link
                                                            to={{
                                                                pathname: "shop-login",
                                                                state: { from: location }
                                                                // dang nhap xong se quay lai trang checkout luon
                                                            }}
                                                            className="btn btn-primary btnhover"
                                                            type="button"
                                                        >
                                                            Login
                                                        </Link>
                                                        <span className="mx-2">or</span>
                                                        <Link to="shop-registration" className="btn btn-primary btnhover" type="button">Register</Link>
                                                    </div>
                                                    <p>You need an account to save and manage your addresses. If you don't have an account, click on Register button above.</p>
                                                </>
                                                :
                                                <>
                                                    {user.userAddresses.length > 0 ? user.userAddresses.map(address =>
                                                            <div
                                                                className="d-flex justify-content-between align-items-center rounded-2 px-3 py-3 border mb-3"
                                                                key={address.id}
                                                            >
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <i className="fas fa-map-marker-alt text-primary"></i>
                                                                    <div className="ps-3">
                                                                        <div className="text-secondary fw-bold">{address.address}</div>
                                                                        <div className="text-secondary">
                                                                            {address.districtName}, {address.provinceName}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    type="button"
                                                                    onClick={() => handleChangeAddress(address)}
                                                                >
                                                                    Select
                                                                </button>
                                                            </div>
                                                        )
                                                        :
                                                        <p>You don't have any saved address.</p>
                                                    }
                                                    <button className="btn btn-primary" type="button">
                                                        <i className="fas fa-plus pe-1"></i>
                                                        Add new address
                                                    </button>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="dz-divider bg-gray-dark text-gray-dark icon-center  my-5"><i className="fa fa-circle bg-white text-gray-dark"></i></div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="widget">
                                        <h4 className="widget-title">Your Order</h4>
                                        <table className="table-bordered check-tbl">
                                            <thead className="text-center">
                                            <tr>
                                                <th>IMAGE</th>
                                                <th>PRODUCT NAME</th>
                                                <th>PRICE</th>
                                                <th>TOTAL</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {cartState.cartItems.map((item, ind)=>(
                                                <tr key={ind}>
                                                    <td className="product-item-img"><img src= {item.thumbnail} alt="img" /></td>
                                                    <td className="product-item-name">
                                                        {item.name}
                                                        <span className="fw-normal font-12"> ( x{item.buy_quantity} )</span>
                                                        <div className="font-12">{item.categories.map((c, index) =>
                                                            <Link key={c.id} to={"#"} className="me-1 text-uppercase">{c.name}{index < item.categories.length-1 ? ", " : " "}</Link>
                                                        )}</div>
                                                    </td>
                                                    <td className="product-price">{formatCurrency(item.price - (item.discountAmount ? item.discountAmount : 0))}</td>
                                                    <td className="product-item-totle text-center" style={{minWidth: "unset"}}>{formatCurrency(calculateSubtotal(item))}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <form className="shop-form widget" onSubmit={submitForm}>
                                        <h4 className="widget-title">Order Total</h4>
                                        <table className="table-bordered check-tbl mb-4">
                                            <tbody>
                                            <tr>
                                                <td style={{width: "46%"}}>Order Subtotal</td>
                                                <td className="product-price">{formatCurrency(calculateTotal())}</td>
                                            </tr>
                                            <tr>
                                                <td>Shipping</td>
                                                <td>
                                                    {deliveryFee != null ? formatCurrency(deliveryFee) : "(Not calculated)"}
                                                    {selectedDistrictId &&
                                                        ` (${provinces.find((province) => province.id === selectedProvinceId).districts.find((district) => district.id === selectedDistrictId).deliveryType})`
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Coupon {coupon?.code}</td>
                                                <td>
                                                    {discountAmount > 0
                                                        ? `- ${formatCurrency(discountAmount)} (${coupon.code})`
                                                        : "(Not applied)"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td className="fw-bold">{formatCurrency(calculateGrandTotal())}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <h4 className="widget-title">Payment Method</h4>
                                        <div className="mb-4">
                                            <Form.Check
                                                type="radio"
                                                name="paymentMethod"
                                                className="mb-2"
                                                id="radio-paypal"
                                                label="PAYPAL"
                                                value="PAYPAL"
                                                checked={formData.paymentMethod === 'PAYPAL'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            {/*<Form.Check*/}
                                            {/*    type="radio"*/}
                                            {/*    name="paymentMethod"*/}
                                            {/*    className="mb-2"*/}
                                            {/*    id="radio-vnpay"*/}
                                            {/*    label="VNPAY"*/}
                                            {/*    value="VNPAY"*/}
                                            {/*    checked={formData.paymentMethod === 'VNPAY'}*/}
                                            {/*    onChange={handlePaymentMethodChange}*/}
                                            {/*/>*/}
                                            <Form.Check
                                                type="radio"
                                                name="paymentMethod"
                                                className="mb-2"
                                                id="radio-cod"
                                                label="COD"
                                                value="COD"
                                                checked={formData.paymentMethod === 'COD'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            {validator.message('paymentMethod', formData.paymentMethod, 'required')}
                                        </div>
                                        {canCheckout() &&
                                            <div className="form-group">
                                                <button className="btn btn-primary btnhover" type="submit">Place Order Now
                                                </button>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    }


                    {(createdOrder && paymentStatus == null) &&
                        <div className="container">
                            <form className="shop-form">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            <h4 className="widget-title">Billing & Shipping Address</h4>
                                            <div className="row">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.name}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.email}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.phone}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.address}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.province}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.district}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-group">
                                                <textarea
                                                    className="form-control"
                                                    value={createdOrder.note ? createdOrder.note : "(No note)"}
                                                    disabled
                                                ></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={createdOrder.paymentMethod}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="widget">
                                            <h4 className="widget-title">Your Order</h4>
                                            <table className="table-bordered check-tbl">
                                                <thead className="text-center">
                                                <tr>
                                                    <th>IMAGE</th>
                                                    <th>PRODUCT NAME</th>
                                                    <th>PRICE</th>
                                                    <th>TOTAL</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {createdOrder.orderProducts.map((item)=>(
                                                    <tr key={item.productId}>
                                                        <td className="product-item-img"><img src={item.thumbnail} alt="" /></td>
                                                        <td className="product-item-name">
                                                            <div className="fw-bold">
                                                                {item.productName}
                                                                <span className="fw-normal font-12"> (x{item.quantity})</span>
                                                            </div>
                                                        </td>
                                                        <td className="product-price text-center">{formatCurrency(item.price)}</td>
                                                        <td className="product-item-totle text-center" style={{minWidth: "unset"}}>{formatCurrency(item.price * item.quantity)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <form className="shop-form widget">
                                            <h4 className="widget-title">Order Total</h4>
                                            <table className="table-bordered check-tbl mb-5">
                                                <tbody>
                                                <tr>
                                                    <td style={{width: "46%"}}>Order Subtotal</td>
                                                    <td className="product-price">{formatCurrency(createdOrder.subtotal)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td>
                                                        {createdOrder.deliveryFee != null ? formatCurrency(createdOrder.deliveryFee) : "(Not calculated)"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Coupon</td>
                                                    <td>{createdOrder.discountAmount > 0
                                                        ? `- ${formatCurrency(createdOrder.discountAmount)} (${createdOrder.coupon.code})`
                                                        : "(Not applied)"}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total</td>
                                                    <td className="fw-bold">{formatCurrency(createdOrder.grandTotal)}</td>
                                                </tr>
                                                </tbody>
                                            </table>

                                            <PaypalCheckoutButton
                                                description={"Payment for Order " + createdOrder.code}
                                                value={createdOrder.grandTotal}
                                                orderCode={createdOrder.code}
                                                setPaymentStatus={setPaymentStatus}
                                            />
                                        </form>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                    {paymentStatus != null &&
                        <OrderPaymentStatus
                            paymentSuccess={paymentStatus}
                            setPaymentStatus={setPaymentStatus}
                            createdOrder={createdOrder}
                        />
                    }

                    {/* <!-- Product END --> */}
                </section>
                
            </div>
        </>
    )
}
export default ShopCheckout;