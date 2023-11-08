import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { Nav, Tab } from 'react-bootstrap';
//import {Collapse, Dropdown} from 'react-bootstrap';

//Component
import ClientsSlider from '../components/Home/ClientsSlider';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';

//Images
import book15 from './../assets/images/books/grid/book15.jpg';
import book3 from './../assets/images/books/grid/book3.jpg';
import book5 from './../assets/images/books/grid/book5.jpg';
import {useLoading} from "../context/LoadingContext";
import {getProductDetail, getRelatedProducts} from "../services/product.service";
import {getAuthor} from "../services/author.servive";
import {formatCurrency} from "../utils/currencyFormatter";
import formatDate from "../utils/datetimeFormatter";
import {useCart} from "../context/CartContext";
import {addAutoWidthTransformation} from "../utils/cloudinaryUtils";
import {useUser} from "../context/UserContext";
import {toast} from "react-toastify";
import {likeOrUnlikeProduct} from "../services/user.service";


const relatedBook = [
    {image:book15, title:'Terrible Madness' },
    {image:book3,  title:'Battle Drive' },
    {image:book5,  title:'Terrible Madness' },
];

function CommentBlog({review}){
    return(
        <>
            {review &&
                <div className="comment-body" id="div-comment-3">
                    <div className="comment-author vcard">
                        <img src={review.avatar} alt="" className="avatar"/>
                        <cite className="fn mb-1">
                            {review.fname} {review.lname}
                            <span className="font-12 text-primary fw-normal m-l10">at {formatDate(review.createdAt).formattedDate}</span>
                        </cite>
                    </div>
                    <div className="comment-content dlab-page-text">
                        <p>{review.comment}.</p>
                    </div>
                </div>
            }
        </>
    )
}

function ShopDetail(){
    const [buy_quantity, setBuy_quantity] = useState(1);

    const { slug } = useParams();
    const [ product, setProduct ] = useState({});
    const { loadingDispatch } = useLoading();
    const { cartDispatch } = useCart();

    // product lien quan
    const [ relatedProducts, setRelatedProducts ] = useState([]);

    // like ---- unlike product
    const { likedProductIds, fetchLikedProducts  } = useUser();

    useEffect(() => {
        fetchProductBySlug();
    }, [slug]);

    useEffect(() => {
        fetch3RelatedProducts();
    }, [product]);

    useEffect(() => {
        fetchLikedProducts();
    }, [])

    const fetchProductBySlug = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getProductDetail(slug);
            setProduct(response);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    function calculateStarRating(rating) {
        const roundedRating = Math.round(rating * 2) / 2; // Round to the nearest 0.5
        const starRating = [];

        for (let i = 1; i <= 5; i++) {
            if (roundedRating >= i) {
                starRating.push(<li key={i}><i className="fas fa-star text-yellow"></i></li>);
            } else if (roundedRating === i - 0.5) {
                starRating.push(<li key={i}><i className="fas fa-star-half-alt text-yellow"></i></li>);
            } else {
                starRating.push(<li key={i}><i className="far fa-star text-yellow"></i></li>);
            }
        }

        return starRating;
    }

    const handleAddToCart = (product, buy_quantity) => {
        if (buy_quantity <= 0 || buy_quantity > product.quantity) {
            toast.error('Not enough quantity!');
            return;
        }

        loadingDispatch({type: 'START_LOADING'});
        // Create a new product object with the selectedGift and buy_quantity
        const productToAdd = {
            ...product,
            buy_quantity: buy_quantity,
        };
        // Dispatch the ADD_TO_CART action with the product
        cartDispatch({ type: 'ADD_TO_CART', payload: { product: productToAdd } });
        toast.success('Add to Cart!');
        loadingDispatch({type: 'STOP_LOADING'});
    }

    // like or unlike product
    const handleLikeButton = async (id) => {
        try {
            loadingDispatch ({ type : 'START_LOADING'});
            await likeOrUnlikeProduct(id);
            await fetchLikedProducts();
            toast.success("Like/Unlike successfully")
        } catch (error) {
            toast.error("You need to login")
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }
    // tim product lien quan
    const fetch3RelatedProducts = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getRelatedProducts(product.id, 3);
            setRelatedProducts(response);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    return(
        <>
            <div className="page-content bg-grey">
                <section className="content-inner-1">
                    <div className="container">
                        <div className="row book-grid-row style-4 m-b60">
                            <div className="col">
                                {product &&
                                    <div className="dz-box">
                                        <div className="dz-media">
                                            <img src={product.thumbnail} alt="book"/>
                                        </div>
                                        <div className="dz-content">
                                            <div className="dz-header">
                                                <h3 className="title">{product.name}</h3>
                                                <div className="shop-item-rating">
                                                    {product.rating &&
                                                        <div
                                                            className="d-lg-flex d-sm-inline-flex d-flex align-items-center">
                                                            <ul className="dz-rating">
                                                                {calculateStarRating(parseFloat(product.rating.toFixed(1)))}
                                                            </ul>
                                                            <h6 className="m-b0">{product.rating.toFixed(1)}</h6>
                                                        </div>
                                                    }
                                                    <div className="social-area">
                                                        <ul className="dz-social-icon style-3">
                                                            <li className="me-2"><a
                                                                href="https://www.facebook.com/dexignzone"
                                                                target="_blank" rel="noreferrer"><i
                                                                className="fa-brands fa-facebook-f"></i></a></li>
                                                            <li className="me-2"><a
                                                                href="https://twitter.com/dexignzones" target="_blank"
                                                                rel="noreferrer"><i
                                                                className="fa-brands fa-twitter"></i></a></li>
                                                            <li className="me-2"><a href="https://www.whatsapp.com/"
                                                                                    target="_blank" rel="noreferrer"><i
                                                                className="fa-brands fa-whatsapp"></i></a></li>
                                                            <li><a href="https://www.google.com/intl/en-GB/gmail/about/"
                                                                   target="_blank" rel="noreferrer"><i
                                                                className="fa-solid fa-envelope"></i></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="dz-body">
                                                <div className="book-detail">
                                                    <ul className="book-info">
                                                        <li>
                                                            {product.author &&
                                                                <div className="writer-info">
                                                                    <img src={addAutoWidthTransformation(product.author.avatar)} alt="book"/>
                                                                    <div>
                                                                        <span>Written by</span>{product.author.name}
                                                                    </div>
                                                                </div>
                                                            }
                                                        </li>
                                                        {product.publisher &&
                                                            <li><span>Publisher</span>{product.publisher.name}</li>
                                                        }
                                                        <li><span>Year</span>{product.publishYear}</li>
                                                    </ul>
                                                </div>
                                                <p className="text-1">{product.description}.</p>
                                                <div className="book-footer">
                                                    <div className="price">
                                                        {product.discountAmount ?
                                                            <div className="price">
                                                                <h5>{formatCurrency(product.price - product.discountAmount)}</h5>
                                                                <p className="p-lr10">{formatCurrency(product.price)}</p>
                                                            </div>
                                                            :
                                                            <div className="price">
                                                                <h5>{formatCurrency(product.price)}</h5>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="product-num">
                                                        {product.quantity > 0 &&
                                                            <>
                                                                <div className="quantity btn-quantity style-1 me-3">
                                                                    <button
                                                                        className="btn btn-plus"
                                                                        type="button"
                                                                        onClick={() => {
                                                                                if (buy_quantity < product.quantity) {
                                                                                    setBuy_quantity((buy_quantity + 1));
                                                                                }
                                                                            }
                                                                        }
                                                                    >
                                                                        <i className="ti-plus"></i>
                                                                    </button>
                                                                    <input
                                                                        className="quantity-input"
                                                                        type="text"
                                                                        value={buy_quantity}
                                                                        onChange={() => {}}
                                                                        name="demo_vertical2"
                                                                    />
                                                                    <button
                                                                        className="btn btn-minus"
                                                                        type="button"
                                                                        onClick={() => {
                                                                                setBuy_quantity((buy_quantity > 1) ? (buy_quantity - 1) : 1);
                                                                            }
                                                                        }
                                                                    >
                                                                        <i className="ti-minus"></i>
                                                                    </button>

                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleAddToCart(product, buy_quantity)}
                                                                    className="btn btn-primary btnhover btnhover2"
                                                                >
                                                                    <i className="flaticon-shopping-cart-1"></i>
                                                                    <span>Add to cart</span>
                                                                </button>
                                                            </>
                                                        }
                                                        <div className="bookmark-btn style-1 d-none d-sm-block">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="flexCheckDefault1"
                                                                checked={likedProductIds.includes(product.id)}
                                                                onClick={() => handleLikeButton(product.id)}
                                                                onChange={() => {}}
                                                            />
                                                            <label className="form-check-label"
                                                                   htmlFor="flexCheckDefault1">
                                                                <i className="flaticon-heart"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <table className="table table-borderless mt-5" style={{fontSize: "0.9rem"}}>
                                                    <tbody>
                                                    <tr className="tags border-0" >
                                                        <th className="px-0 py-1 fw-normal">Categories: </th>
                                                        <td className="px-0 py-1">
                                                            {product.categories && product.categories.map((c, index) =>
                                                                <Link to="" key={c.id} to={"#"} className="me-1 text-uppercase">{c.name}{index < product.categories.length-1 ? ", " : " "}</Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr className="tags border-0" >
                                                        <th className="px-0 py-1 fw-normal">Stock: </th>
                                                        <td className="px-0 py-1">
                                                            {product.quantity} products
                                                        </td>
                                                    </tr>
                                                    <tr className="tags border-0" >
                                                        <th className="px-0 py-1 fw-normal">VAT: </th>
                                                        <td className="px-0 py-1">
                                                            {product.vatRate} %
                                                        </td>
                                                    </tr>
                                                    <tr className="tags border-0" >
                                                        <th className="px-0 py-1 fw-normal">Tags: </th>
                                                        <td className="px-0 py-1">
                                                            {product.tags && product.tags.map((tag, index) =>
                                                                <Link key={index} to="" className="badge me-1">{tag.name}</Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-8">
                                <Tab.Container defaultActiveKey="details">
                                    <div className="product-description tabs-site-button">
                                        <Nav as="ul" className="nav nav-tabs">
                                            <Nav.Item as="li"><Nav.Link to="" eventKey="details">Details Product</Nav.Link></Nav.Item>
                                            <Nav.Item as="li"><Nav.Link to="" eventKey="review">Customer Reviews</Nav.Link></Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="details">
                                                <table className="table border book-overview">
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan="2">
                                                                <div dangerouslySetInnerHTML={{ __html: product.detail }} />
                                                            </td>
                                                        </tr>
                                                        <tr className="tags">
                                                            <th>Tags</th>
                                                            <td>
                                                                {product.tags && Array.isArray(product.tags) && product.tags.map((tag, i) => (
                                                                    <Link  to="" key={i} className="badge me-1">
                                                                        {tag.name}
                                                                    </Link>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="review">
                                                <div className="clear" id="comment-list">
                                                    <div className="post-comments comments-area style-1 clearfix">
                                                        <h4 className="comments-title">{product.reviews && product.reviews.length} COMMENTS</h4>
                                                        <div id="comment">
                                                            <ol className="comment-list">
                                                                {product.reviews && Array.isArray(product.reviews) && product.reviews.map((review, i) => (
                                                                    <li key={i} className="comment odd alt thread-even depth-1 comment" id={`comment-${i}`}>
                                                                        <CommentBlog review={review} />
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                        <div className="default-form comment-respond style-1" id="respond">
                                                            <h4 className="comment-reply-title" id="reply-title">LEAVE A REPLY 
                                                                <small> 
                                                                    <Link to="" rel="nofollow" id="cancel-comment-reply-link" style={{display:"none"}}>Cancel reply</Link>
                                                                </small>
                                                            </h4>
                                                            <div className="clearfix">
                                                                <form method="post" id="comments_form" className="comment-form" noValidate>
                                                                    <p className="comment-form-author"><input id="name" placeholder="Author" name="author" type="text" onChange={() => {}} value="" /></p>
                                                                    <p className="comment-form-email">
                                                                        <input id="email" required="required" placeholder="Email" name="email" type="email" value="" onChange={() => {}} />
                                                                    </p>
                                                                    <p className="comment-form-comment">
                                                                        <textarea id="comments" placeholder="Type Comment Here" className="form-control4" name="comment" cols="45" rows="3" required="required"></textarea>
                                                                    </p>
                                                                    <p className="col-md-12 col-sm-12 col-xs-12 form-submit">
                                                                        <button id="submit" type="submit" className="submit btn btn-primary filled">
                                                                        Submit Now <i className="fa fa-angle-right m-l10"></i>
                                                                        </button>
                                                                    </p>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </Tab.Container>   
                            </div>
                            <div className="col-xl-4 mt-5 mt-xl-0">
                                <div className="widget">
                                    <h4 className="widget-title">Related Books</h4>
                                    <div className="row">
                                        {relatedProducts.length > 0 && relatedProducts.map((data, index)=>(
                                            <div className="col-xl-12 col-lg-6" key={index}>
                                                <div className="dz-shop-card style-5">
                                                    <div className="dz-media">
                                                        <img src={addAutoWidthTransformation(data.thumbnail)} alt="" />
                                                    </div>
                                                    <div className="dz-content">
                                                        <h5 className="subtitle">{data.name}</h5>
                                                        <ul className="dz-tags">
                                                            {
                                                                data.categories.map((cate, index) =>
                                                                    <li key={index}>{cate.name}</li>
                                                                )
                                                            }
                                                        </ul>
                                                        <div className="price">
                                                            {data.discountAmount ?
                                                                <div className="price">
                                                                    <span className="price-num">{formatCurrency(data.price - product.discountAmount)}</span>
                                                                    <del>{formatCurrency(data.price)}</del>
                                                                </div>
                                                                :
                                                                <div className="price">
                                                                    <span className="price-num">{formatCurrency(data.price)}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm btnhover btnhover2"
                                                            onClick={() => handleAddToCart(data, 1)}
                                                        >
                                                            <i className="flaticon-shopping-cart-1 me-2"></i> Add to cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>   
                                        ))}

                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>        
                <div className="bg-white py-5">
			        <div className="container">              
                        <ClientsSlider />            
                    </div>    
                </div>                
                <section className="content-inner">
                    <div className="container">
                        <div className="row sp15">
                            <CounterSection />      
                        </div>   
                    </div>
                </section>  
                <NewsLetter />      
            </div>
        </>
    )
}
export default ShopDetail;