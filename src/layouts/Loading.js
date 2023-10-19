import React from "react";
import loading from "../assets/images/book-loading.gif";
import {useLoading} from "../context/LoadingContext";

const Loading = () => {
    const { loadingState} = useLoading();
    const { isLoading } = loadingState;

    const style = {
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#000",
        opacity: 0.8,
        zIndex: 99999,
    }

    return (
        isLoading &&
        <div style={style} className="d-flex justify-content-center align-items-center">
            <img src={loading} style={{scale: "1.2"}}/>
        </div>
    );
}

export default Loading;