import { createContext, useContext, useState, useCallback } from 'react';

const CouponContext = createContext();

export function CouponProvider({ children }) {
    const [coupon, setCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponErrorMsg, setCouponErrorMsg] = useState(null);

    const applyCoupon = useCallback((coupon, grandTotal) => {
        let couponErrorMsg = null;
        let newDiscountAmount = 0;

        const now = new Date();

        if (now < new Date(coupon.startDate)) {
            couponErrorMsg = "Coupon is not yet valid.";
        } else if (now > new Date(coupon.endDate)) {
            couponErrorMsg = "Coupon has expired.";
        } else if (coupon.quantity <= 0) {
            couponErrorMsg = "Coupon has no available uses.";
        } else if (grandTotal < coupon.minimumRequire) {
            couponErrorMsg = "Minimum order total not met.";
        } else {
            // The coupon is valid
            if (coupon.discountType === 'fixed') {
                newDiscountAmount = coupon.discount;
            } else if (coupon.discountType === 'percentage') {
                newDiscountAmount = (grandTotal * (coupon.discount / 100)) <= coupon.maxReduction
                    ? grandTotal * (coupon.discount / 100)
                    : coupon.maxReduction;
            }

            // Round discountAmount to 2 decimal points
            newDiscountAmount = parseFloat(newDiscountAmount.toFixed(2));
        }

        setDiscountAmount(newDiscountAmount);
        setCouponErrorMsg(couponErrorMsg)
    }, []);

    const handleRemoveCoupon = useCallback(() => {
        setCoupon(null);
        setCouponErrorMsg(null);
        setDiscountAmount(0);
    }, []);

    const contextValue = {
        coupon, setCoupon,
        discountAmount,setDiscountAmount,
        couponErrorMsg, setCouponErrorMsg,
        applyCoupon,
        handleRemoveCoupon,
    };

    return (
        <CouponContext.Provider value={contextValue}>
            {children}
        </CouponContext.Provider>
    );
}


export function useCouponContext() {
    return useContext(CouponContext);
}