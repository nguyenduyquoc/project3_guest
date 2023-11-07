import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Form from 'react-bootstrap/Form';

//Images
import checkIcon from './../assets/images/check-icon.png';
import cancelIcon from './../assets/images/cancel-icon.png';

//Components 
import PageTitle from './../layouts/PageTitle';
import {useLoading} from "../context/LoadingContext";
import {useCart} from "../context/CartContext";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {useProvinces} from "../context/ProvinceContext";
import {useCouponContext} from "../context/CouponContext";
import {getCouponByCode} from "../services/coupon.service";
import formatDate from "../utils/datetimeFormatter";
import SimpleReactValidator from "simple-react-validator";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";



function ShopCart(){

    const {loadingDispatch} = useLoading();
    const { cartState, cartDispatch } = useCart();


    // ----------------- States for calculate delivery fee ---------------
    const {
        provinces,
        address, setAddress,
        selectedProvinceId, selectedDistrictId,
        setSelectedProvinceId, setSelectedDistrictId,
        selectedDeliveryServiceId, setSelectedDeliveryServiceId,
        selectedService
    } = useProvinces();

    const [calculateDeliveryStep, setCalculateDeliveryStep] = useState(1);

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const handleProvinceChange = (event) => {
        const selectedProvinceId = parseInt(event.target.value, 10);
        if (isNaN(selectedProvinceId)) {
            setSelectedProvinceId(null);
        } else {
            setSelectedProvinceId(selectedProvinceId);
        }
        setSelectedDistrictId(null); // Reset selected district when province changes
        setSelectedDeliveryServiceId(null); // Reset selected delivery service when province changes
        validator.showMessages();
    };

    const handleDistrictChange = (event) => {
        const selectedDistrictId = parseInt(event.target.value, 10);
        if (isNaN(selectedDistrictId)) {
            setSelectedDistrictId(null);
        } else {
            setSelectedDistrictId(selectedDistrictId);
            setSelectedDeliveryServiceId(null);
            validator.showMessages();
        }
    };

    const handleDeliveryServiceChange = (event) => {
        const selectedDeliveryServiceId = parseInt(event.target.value, 10);
        setSelectedDeliveryServiceId(selectedDeliveryServiceId);
    }

    const handleNextStepClick = () => {
        if (validator.allValid()) {
            loadingDispatch({type: 'START_LOADING'});
            setTimeout(() => {
                setCalculateDeliveryStep(2);
                loadingDispatch({ type: 'STOP_LOADING' });
            }, 1000);
        } else {
            toast.error("Empty field is no allowed")
        }
    };

    // ----------------------- Calculate coupon ---------------------------
    const [couponCode, setCouponCode] = useState('');
    const {
        coupon, setCoupon,
        discountAmount,
        couponErrorMsg, setCouponErrorMsg,
        applyCoupon,
        handleRemoveCoupon,
    } = useCouponContext();

    useEffect(() => {
        if (coupon) {
            applyCoupon(coupon, calculateTotal());
        }
    }, [cartState.cartItems, coupon]);

    const submitCouponForm = async (e) => {
        e.preventDefault();
        try {
            loadingDispatch({type: 'START_LOADING'});
            const data = await getCouponByCode(couponCode);
            setCoupon(data);
        } catch (error) {
            console.log(error);
            setCouponErrorMsg("No coupon found.")
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    };

    // ----------------- Handle item and Calculate products in cart ---------------------
    const handleQuantityChange = (product, newQuantity) => {
        // Ensure newQuantity is within the valid range (1 to max of product.quantity)
        newQuantity = Math.min(Math.max(newQuantity, 1), product.quantity);

        cartDispatch({
            type: 'UPDATE_CART_ITEM',
            payload: {
                productId: product.id,
                buy_quantity: newQuantity,
            },
        });
    };


    const handleRemoveItem = (productId) => {
        cartDispatch({ type: 'REMOVE_CART_ITEM', payload: { productId } });
    };

    const calculateSubtotal = (product) => {
        return (product.price - (product.discountAmount ? product.discountAmount : 0)) * product.buy_quantity;
    };

    const calculateTotal = () => {
        return cartState.cartItems.reduce((total, product) => total + calculateSubtotal(product), 0);
    };

    const calculateVat = () => {
        return cartState.cartItems.reduce((total, product) => total + calculateSubtotal(product) * product.vatRate / 100, 0);
    };

    const calculateGrandTotal = () => {
        return calculateTotal() + calculateVat() + (selectedService ? selectedService.fee : 0) - discountAmount;
    };

    const canCheckout = () => {
        // Check if the cart is not empty and if all buy_quantity values are less than or equal to quantity for each product
        return (
            cartState.cartItems.length > 0 &&
            cartState.cartItems.every((product) => product.buy_quantity <= product.quantity)
        );
    };

    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Cart" />
                <section className="content-inner shop-account">
                    {/* <!-- Product --> */}
                    <div className="container">
                        <div className="row mb-5">
                            {cartState.cartItems.length !== 0 ?
                                  <div className="col-lg-12">
                                        <div className="table-responsive">
                                            <table className="table check-tbl">
                                                <thead>
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Product name</th>
                                                        <th>Unit Price</th>
                                                        <th>Quantity</th>
                                                        <th>Total</th>
                                                        <th>VAT</th>
                                                        <th className="text-end">Close</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {cartState.cartItems.map((item,index)=>(
                                                    <tr key={index}>
                                                        <td className="product-item-img"><img src={addAutoWidthTransformation(item.thumbnail)} alt="img" /></td>
                                                        <td className="product-item-name">{item.name}</td>
                                                        <td className="product-item-price">{formatCurrency(item.price - (item.discountAmount ? item.discountAmount : 0))}</td>
                                                        <td className="product-item-quantity">
                                                            <div className="quantity btn-quantity style-1 me-3">
                                                                <button className="btn btn-plus" type="button"
                                                                        onClick={()=> {handleQuantityChange(item, item.buy_quantity + 1)}}>
                                                                >
                                                                    <i className="ti-plus"></i>
                                                                </button>
                                                                <input type="text" className="quantity-input" value={item.buy_quantity} onChange={() => {}}/>
                                                                <button className="btn btn-minus " type="button"
                                                                        onClick={()=> {handleQuantityChange(item, item.buy_quantity - 1)}}>
                                                                >
                                                                    <i className="ti-minus"></i>
                                                                </button>
                                                            </div>
                                                            {item.buy_quantity > item.quantity &&
                                                                <span className="text-danger font-14">Not enough quantity</span>
                                                            }
                                                        </td>
                                                        <td className="product-item-totle">{formatCurrency(calculateSubtotal(item))}</td>
                                                        <td>{item.vatRate}%</td>
                                                        <td className="product-item-close">
                                                            <Link to="" className="ti-close" onClick={()=>handleRemoveItem(item.id)}></Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                </div>
                                :
                                <span className="text-center text-danger font-18">There are currently no products in the shopping cart</span>
                            }
                            
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="widget">
                                    <form className="shop-form"> 
                                        <h4 className="widget-title">Calculate Shipping</h4>
                                        {calculateDeliveryStep === 1 ?
                                            <>
                                                <div className="row">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            className="form-control"
                                                            placeholder="Address"
                                                            value={address}
                                                            onChange={(e) => {
                                                                setAddress(e.target.value);
                                                                validator.showMessages()
                                                            }}
                                                        />
                                                        {validator.message('address', address, 'required')}
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <Form.Select
                                                            aria-label="Province"
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
                                                        {validator.message('province', selectedProvinceId, 'required')}
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <Form.Select
                                                            aria-label="District"
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
                                                        {validator.message('district', selectedDistrictId, 'required')}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <Button
                                                        className="btn btn-primary btnhover"
                                                        type="button"
                                                        onClick={handleNextStepClick}
                                                    >Next <i className="flaticon-right-arrow m-l10"></i>
                                                    </Button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="mb-3 text-secondary">
                                                    {`There are
                                                    ${selectedDistrictId &&
                                                    provinces.find((province) => province.id === selectedProvinceId)
                                                        .districts.find((district) => district.id === selectedDistrictId)
                                                        .deliveryServices.length}
                                                    shipping services for this location`}
                                                </div>
                                                <div className="mb-4">
                                                    {selectedDistrictId &&
                                                        provinces.find((province) => province.id === selectedProvinceId)
                                                            .districts.find((district) => district.id === selectedDistrictId)
                                                            .deliveryServices.map(deliveryService =>
                                                            <Form.Check
                                                                type="radio"
                                                                name="deliveryService"
                                                                className="mb-2"
                                                                id={`service-${deliveryService.id}`}
                                                                label={`${deliveryService.name} (${deliveryService.estimatedTime}) ${deliveryService.fee}`}
                                                                value={deliveryService.id}
                                                                checked={selectedDeliveryServiceId === deliveryService.id}
                                                                onChange={handleDeliveryServiceChange}
                                                            />
                                                        )
                                                    }
                                                    {validator.message('deliveryService', setSelectedDeliveryServiceId, 'required')}
                                                </div>
                                                <div className="form-group">
                                                    <Link to=""
                                                        className="btn btn-primary btnhover"
                                                        type="button"
                                                        onClick={() => setCalculateDeliveryStep(1)}
                                                    >Back <i className="flaticon-left-arrow m-l10"></i>
                                                    </Link>
                                                </div>
                                            </>
                                        }
                                    </form>
                                    <form className="shop-form" onSubmit={submitCouponForm}>
                                        <h4 className="widget-title">Apply Coupon</h4>
                                        {coupon == null ?
                                            <>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Coupon Code"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                        required
                                                    />
                                                    <span className="text-danger">{couponErrorMsg}</span>
                                                </div>
                                                <div className="form-group">
                                                    <button className="btn btn-primary btnhover" type="submit">Apply</button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div
                                                    className="d-flex justify-content-between align-items-center rounded-3 px-3 py-3"
                                                    style={{
                                                        border: discountAmount > 0 ? '1px solid #68A27E' : '1px solid #F78F8F',
                                                    }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <img
                                                            src={
                                                                discountAmount > 0 ? checkIcon : cancelIcon
                                                            }
                                                            style={{width: "50px"}}
                                                        />
                                                        <div className="ps-3">
                                                            <div className="text-secondary fw-bold">{coupon.code}</div>
                                                            <div className="font-14 text-secondary">
                                                                {coupon.discountType === 'fixed' &&
                                                                    `${formatCurrency(coupon.discount)} off `
                                                                }
                                                                {coupon.discountType === 'percentage' &&
                                                                    `${coupon.discount}% off (Max of ${formatCurrency(coupon.maxReduction)}) `
                                                                }
                                                                -
                                                                Minimum order {formatCurrency(coupon.minimumRequire)}
                                                            </div>
                                                            <div className="font-13">Valid from {formatDate(coupon.startDate).formattedDate} to {formatDate(coupon.endDate).formattedDate}</div>
                                                        </div>
                                                    </div>
                                                    <Link to=""
                                                        className="fw-bold text-danger"
                                                        onClick={handleRemoveCoupon}
                                                    >
                                                        Remove
                                                    </Link>
                                                </div>
                                                {discountAmount > 0 ?
                                                    <span className="text-success fw-bold">Coupon code applied.</span>
                                                    :
                                                    <span className="text-danger fw-bold">{couponErrorMsg}</span>
                                                }
                                            </>
                                        }
                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="widget">
                                    <h4 className="widget-title">Cart Subtotal</h4>
                                    <table className="table-bordered check-tbl m-b25">
                                        <tbody>
                                            <tr>
                                                <td>Order Subtotal</td>
                                                <td>{formatCurrency(calculateTotal())}</td>
                                            </tr>
                                            <tr>
                                                <td>VAT</td>
                                                <td>{formatCurrency(calculateVat())}</td>
                                            </tr>
                                            <tr>
                                                <td>Shipping</td>
                                                <td>
                                                    {selectedService != null ? formatCurrency(selectedService.fee) : "(Not calculated)"}
                                                    <div className="text-primary">
                                                        {selectedService &&
                                                            ` (${selectedService.name} | ${selectedService.type})`
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Coupon</td>
                                                <td>
                                                    {discountAmount > 0
                                                        ? `- ${formatCurrency(discountAmount)} `
                                                        : "(Not applied)"}
                                                    <span className="text-primary">
                                                        {discountAmount > 0 && ` (${coupon.code})`}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td>
                                                    {formatCurrency(calculateGrandTotal())}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {canCheckout() &&
                                        <div className="form-group m-b25">
                                            <Link to={"shop-checkout"} className="btn btn-primary btnhover" type="button">Proceed to Checkout</Link>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Product END --> */}
                </section>
            
            </div>
        </>
    )
}
export default ShopCart;