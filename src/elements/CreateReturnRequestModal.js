import React, {useState} from "react";
import {useLoading} from "../context/LoadingContext";

function CreateReturnRequestModal ({ show, order, fetchOrderDetail, onHide}) {
    const returnReasons = [
        { name: "Did not receive the order ", desc: "(e.g. parcel lost in transit)" },
        { name: "Received an incomplete product ", desc: "(e.g. missing parts of product, missing products from order)" },
        { name: "Received the wrong product(s) ", desc: "(e.g. wrong size/colour, different product)" },
        { name: "Received a product with physical damage", desc: "(e.g. dents, scratches, cracks)" },
        { name: "Received a faulty product ", desc: "(e.g. malfunction, does not work as intended)" },
        { name: "Received a counterfeit product", desc: "" },
    ];

    const { loadingDispatch } = useLoading();
    const [ step , setStep ] = useState(1);
    const [formData, setFormData] = useState({
        returnReason: '',
        returnProducts: order.orderProducts.map(orderProduct => ({
            ...orderProduct,
            orderProductId: orderProduct.id,
            returnQuantity: 1,
            checked: false
        })),
    });

    const handleCheckAllChange = (e) => {
        if (e.target.checked) {
            // Update the checked property for all returnProducts
            const updatedReturnProducts = formData.returnProducts.map((returnProduct) => ({
                ...returnProduct,
                checked: true,
            }));

            setFormData({
                ...formData,
                returnProducts: updatedReturnProducts,
            });
        } else {
            const updatedReturnProducts = formData.returnProducts.map((returnProduct) => ({
                ...returnProduct,
                checked: false,
            }));

            setFormData({
                ...formData,
                returnProducts: updatedReturnProducts,
            });
        }
    };

    const isAllChecked = formData.returnProducts.every((returnProduct) => returnProduct.checked);

    const handleQuantityChange = (orderProductId, newQuantity) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            returnProducts: prevFormData.returnProducts.map((returnProduct) => {
                if (returnProduct.orderProductId === orderProductId) {
                    return {
                        ...returnProduct,
                        returnQuantity: Math.min(
                            Math.max(1, newQuantity),
                            returnProduct.quantity
                        ),
                    };
                }
                return returnProduct;
            }),
        }));
    };

    const calculateMinusCoupon = () => {
        const couponPercentage = order.couponAmount
            ? (order.couponAmount / order.subtotal) * 100
            : 0;

        const minusCouponAmount = calculateSubtotalRefund() * couponPercentage / 100;

        return {couponPercentage, minusCouponAmount}
    };

    const calculateTotalRefund = () => {
        const total = calculateSubtotalRefund() - calculateMinusCoupon().minusCouponAmount
        return Number(total.toFixed(2));
    }

    const calculateSubtotalRefund = () => {
        const selectedReturnProducts = formData.returnProducts.filter((returnProduct) => returnProduct.checked);
        const subtotal = selectedReturnProducts.reduce((total, returnProduct) => {
            return total + (returnProduct.price) * returnProduct.returnQuantity;
        }, 0);

        return subtotal;
    };

    // ------ Validate data -------
    const [errorMessages, setErrorMessages] = useState({
        returnProductsError: null,
        returnReasonError: null
    })
}

export default CreateReturnRequestModal;