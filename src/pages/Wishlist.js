import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

//Components 
import PageTitle from './../layouts/PageTitle';
import {useLoading} from "../context/LoadingContext";
import {useUser} from "../context/UserContext";
import {useCart} from "../context/CartContext";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {formatCurrency} from "../utils/currencyFormatter";
import {toast} from "react-toastify";
import {likeOrUnlikeProduct} from "../services/user.service";



function Wishlist(){

    const {loadingDispatch} = useLoading();
    const {
        user,
        likedProducts,
        setLikedProducts,
        fetchLikedProducts
    } = useUser();
    const { cartDispatch } = useCart();

    useEffect(() => {
        fetchLikedProducts();
    }, [])
	
	const decreaseQuantity = (product) =>{
		if (product.buy_quantity > 1) {
            setLikedProducts((prevLikeProducts) =>
                prevLikeProducts.map((item) =>
                    item.id === product.id ? {...item, buy_quantity: item.buy_quantity - 1 } : item
                )
            );
        }
	}

    const increaseQuantity = (product) =>{
        if (product.buy_quantity < product.quantity) {
            setLikedProducts((prevLikeProducts) =>
                prevLikeProducts.map((item) =>
                    item.id === product.id ? {...item, buy_quantity: item.buy_quantity + 1 } : item
                )
            );
        }
    }

    const handleAddToCart = (product) => {
        if (product.quantity === 0) {
            toast.error('Out of Stock!');
            return;
        }

        loadingDispatch({type: 'START_LOADING'});
        // Create a new product object with the selectedGift and buy_quantity
        const productToAdd = {
            ...product,
            buy_quantity: product.buy_quantity,
        };
        // Dispatch the ADD_TO_CART action with the product
        cartDispatch({ type: 'ADD_TO_CART', payload: { product: productToAdd } });
        toast.success('Add to Cart!');
        loadingDispatch({type: 'STOP_LOADING'});
    };

    const handleDeleteClick = async (id) => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            await likeOrUnlikeProduct(id);
            await fetchLikedProducts();
            toast.success("Remove from wishlist")
        } catch (error) {
            toast.error("Can not remove product")
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }


    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Wishlist" />
                <section className="content-inner-1">
                    {/* <!-- Product --> */}
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="table-responsive">
                                    {user && likedProducts.length > 0 &&
                                        <table className="table check-tbl">
                                            <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Product name</th>
                                                <th>Unit Price</th>
                                                <th>Quantity</th>
                                                <th>Add to cart</th>
                                                <th>Close</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {likedProducts.map((data, index) => (
                                                <tr key={index}>
                                                    <td className="product-item-img"><img src={addAutoWidthTransformation(data.thumbnail)} alt="img"/></td>
                                                    <td className="product-item-name">{data.name}</td>
                                                    {data.discountAmount ?
                                                        <td className="product-item-price">
                                                            {formatCurrency(data.price - data.discountAmount)}
                                                            <del className="text-primary m-l10">{formatCurrency(data.price)}</del>
                                                        </td>
                                                        :
                                                        <del className="text-primary m-l10">{formatCurrency(data.price)}</del>
                                                    }
                                                    <td className="product-item-quantity">
                                                        {data.quantity > 0 ?
                                                        <div className="quantity btn-quantity style-1 me-3">
                                                            <button className="btn btn-plus" type="button"
                                                                    onClick={() => {
                                                                        increaseQuantity(data)
                                                                    }}>
                                                                <i className="ti-plus"></i>
                                                            </button>
                                                            <input type="text" className="quantity-input"
                                                                   value={data.buy_quantity}/>
                                                            <button className="btn btn-minus " type="button"
                                                                    onClick={() => {
                                                                        decreaseQuantity(data)
                                                                    }}
                                                            >
                                                                <i className="ti-minus"></i>
                                                            </button>
                                                        </div>
                                                        :
                                                            <div>Out of stock</div>
                                                        }
                                                    </td>
                                                    <td className="product-item-totle">
                                                        {data.quantity > 0 ?
                                                            <Link
                                                                className="btn btn-primary btnhover"
                                                                onClick={() => handleAddToCart(data)}
                                                            >
                                                                Add To Cart
                                                            </Link>
                                                            :
                                                            <div>Can not add to cart</div>
                                                        }
                                                    </td>
                                                    <td className="product-item-close">
                                                        <Link to={"#"} className="ti-close"
                                                              onClick={() => handleDeleteClick(data.id)}>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    }

                                    {user && likedProducts.length === 0 &&
                                            <span className="text-center text-danger font-18">Wishlist is empty</span>

                                    }

                                    {user == null &&

                                            <td colSpan="6" className="text-center">
                                                Have a account?
                                                <Link to={"/shop-login"}> Login </Link>
                                                or
                                                <Link to={"/shop-registration"}> Register </Link>
                                            </td>
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
export default Wishlist;