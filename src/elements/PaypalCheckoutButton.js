import {useLoading} from "../context/LoadingContext";
import {useCart} from "../context/CartContext";
import {PayPalButtons} from "@paypal/react-paypal-js";
import {toast} from "react-toastify";
import {patchConfirmOrderPayment} from "../services/order.service";

const PaypalCheckoutButton = ({description, value, orderCode, setPaymentStatus}) => {
    const { loadingDispatch } = useLoading();
    const { cartDispatch} = useCart();

    // 1 - creates a paypal order
    const createOrder = (data, actions) => {
         return actions.order.create({
              purchase_units: [
                   {
                        description: description,
                        amount: {
                             currency_code: "USD",
                             value: value,
                        },
                   },
              ],
         });
    };

 // 2 - Check Approval
    const onApprove = async (data, actions) => {
         const order = await actions.order.capture();
         try {
              loadingDispatch({type: 'START_LOADING'});
              await patchConfirmOrderPayment(orderCode);
              setPaymentStatus(true);
              cartDispatch({type: "CLEAR_CART"});
         } catch (err) {
              console.log("Paypal check approval error: ", err);
              toast.error("Confirm order payment error!");
         } finally {
              loadingDispatch({type: 'STOP_LOADING'});
         }
    };

    // 3 - Capture likely error
    const onError = (err) => {
         setPaymentStatus(false);
         console.log("Paypal checkout onError:" + err);
    };

    // 4 - User cancel payment
    const onCancel = () => {
         setPaymentStatus(false);
         console.log("Cancel checkout");
    }

    return (
        <>
            <PayPalButtons
            style={{
                layout: "vertical",
                height: 48,
                tagline: false
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            />
        </>

    )
}

 export default PaypalCheckoutButton;