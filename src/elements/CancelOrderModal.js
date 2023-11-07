import React, {useState} from 'react';
import {useLoading} from "../context/LoadingContext";
import SimpleReactValidator from "simple-react-validator";
import {cancelOrder} from "../services/order.service";
import {toast} from "react-toastify";
import {Button, Form, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";


function CancelOrderModal({ show, onHide, order, fetchOrderDetail }) {
    const cancelReasons = [
        "Customer changed their mind",
        "Customer found a better deal",
        "Customer order by mistake",
        "Customer encounter payment issues",
        "Change shipping address",
        "Other reason"
    ];

    const { loadingDispatch } = useLoading();
    const [cancelReason, setCancelReason] = useState('');

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const handleReasonChange = (e) => {
        setCancelReason(e.target.value);
        validator.showMessages();
    }

    const submitCancelForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                await cancelOrder({
                    code: order.code,
                    email: order.email,
                    cancelReason: cancelReason
                });
                fetchOrderDetail();
                toast.success("Cancel order successful");
            } catch (error) {
                console.log(error);
                toast.error("Fail to cancel order");
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            toast.error("Please select cancel reason");
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            contentClassName="border-0 rounded-2 shadow"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Are you sure to cancel this order?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Reason to cancel order</h4>
                {cancelReasons.map((reason, index) =>
                    <Form.Check
                        key={index}
                        type="radio"
                        name="deliveryService"
                        className="mb-2"
                        id={`reason-${index}`}
                        label={reason}
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={handleReasonChange}
                    />
                )}
                {validator.message('cancelReason', cancelReason, 'required')}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
                <Link
                    className="btn btn-danger"
                    onClick={submitCancelForm}
                >Submit</Link>
            </Modal.Footer>
        </Modal>
    );
}

export default CancelOrderModal;