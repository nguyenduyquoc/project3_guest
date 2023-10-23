import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { Nav, Tab } from 'react-bootstrap';
//import {Collapse, Dropdown} from 'react-bootstrap';

//Component
import ClientsSlider from '../components/Home/ClientsSlider';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';

//Images
import book16 from './../assets/images/books/book16.png';
import profile2 from './../assets/images/profile2.jpg';
import profile4 from './../assets/images/profile4.jpg';
import profile3 from './../assets/images/profile3.jpg';
import profile1 from './../assets/images/profile1.jpg';
import book15 from './../assets/images/books/grid/book15.jpg';
import book3 from './../assets/images/books/grid/book3.jpg';
import book5 from './../assets/images/books/grid/book5.jpg';
import {useLoading} from "../context/LoadingContext";
import {getProductDetail} from "../services/product.service";
import {getAuthor} from "../services/author.servive";
import {formatCurrency} from "../utils/currencyFormatter";
import formatDate from "../utils/datetimeFormatter";

const tableDetail = [
    {tablehead:'Book Title', tabledata:'Think and Grow Rich'},
    {tablehead:'Author', tabledata:'Napoleon Rich'},
    {tablehead:'ISBN', tabledata:'121341381648 (ISBN13: 121341381648)'},
    {tablehead:'Ediiton Language', tabledata:'English'},
    {tablehead:'Book Format', tabledata:'Paperback, 450 Pages'},
    {tablehead:'Date Published', tabledata:'August 10th 2019'},
    {tablehead:'Publisher', tabledata:'Wepress Inc.'},
    {tablehead:'Pages', tabledata:'520'},    
    {tablehead:'Lesson', tabledata:'7'},
    {tablehead:'Topic', tabledata:'360'},
];

const relatedBook = [
    {image:book15, title:'Terrible Madness' },
    {image:book3,  title:'Battle Drive' },
    {image:book5,  title:'Terrible Madness' },
];

function CommentBlog({reviewInfor}){
    return(
        <>
            {/*<div className="comment-body" id="div-comment-3">
                <div className="comment-author vcard">
                    <img src={image} alt="" className="avatar"/>
                    <cite className="fn">{title}</cite> <span className="says">says:</span>
                    <div className="comment-meta">
                        <p>{formatDate(reviewInfor.createdAt)}</p>
                    </div>
                </div>
                <div className="comment-content dlab-page-text">
                    <p>{reviewInfor.comment}.</p>
                </div>
                <div className="reply">
                    <Link to={"#"} className="comment-reply-link"><i className="fa fa-reply"></i> Reply</Link>
                </div>
            </div>*/}
        </>
    )
}

function ShopDetail(){
    const [count, setCount] = useState(1);

    const {slug} = useParams();
    const [product, setProduct] = useState({});
    const {loadingDispatch} = useLoading();
    const find = async () => {
        loadingDispatch({type : "START_LOADING"});
        const product = await getProductDetail(slug);
        setProduct(product);
        loadingDispatch({type : "STOP_LOADING"});
    }


    useEffect(() => {
        find();
    }, []);
    
    return(
        <>
            <div className="page-content bg-grey">
                <section className="content-inner-1">
                    <div className="container">
                        <div className="row book-grid-row style-4 m-b60">
                            <div className="col">
                                <div className="dz-box">
                                    <div className="dz-media">
                                        <img src={product.thumbnail} alt="book" />
                                    </div>
                                    <div className="dz-content">
                                        <div className="dz-header">
                                            <h3 className="title">{product.name}</h3>
                                            <div className="shop-item-rating">
                                                <div className="d-lg-flex d-sm-inline-flex d-flex align-items-center">
                                                    <ul className="dz-rating">
                                                        <li><i className="flaticon-star text-yellow"></i></li>	
                                                        <li><i className="flaticon-star text-yellow"></i></li>	
                                                        <li><i className="flaticon-star text-yellow"></i></li>	
                                                        <li><i className="flaticon-star text-yellow"></i></li>		
                                                        <li><i className="flaticon-star text-muted"></i></li>		
                                                    </ul>
                                                    <h6 className="m-b0">{product.rating}</h6>
                                                </div>
                                                <div className="social-area">
                                                    <ul className="dz-social-icon style-3">
                                                        <li className="me-2"><a  href="https://www.facebook.com/dexignzone" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                                                        <li className="me-2"><a  href="https://twitter.com/dexignzones" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter"></i></a></li>
                                                        <li className="me-2"><a  href="https://www.whatsapp.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i></a></li>
                                                        <li><a href="https://www.google.com/intl/en-GB/gmail/about/" target="_blank" rel="noreferrer"><i className="fa-solid fa-envelope"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dz-body">
                                            <div className="book-detail">
                                                <ul className="book-info">
                                                    <li>
                                                        <div className="writer-info">
                                                            <img src={product.authorAvatar} alt="book" />
                                                            <div>
                                                                <span>Writen by</span>{product.authorName}
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li><span>Publisher</span>{product.publisherName}</li>
                                                    <li><span>Year</span>{product.publishYear}</li>
                                                </ul>
                                            </div>
                                            <p className="text-1">{product.description}.</p>
                                            <p className="text-2">{product.description}.</p>
                                            <div className="book-footer">
                                                <div className="price">
                                                    {product.discountAmount ?
                                                        <div className="price">
                                                            <span className="price-num">{formatCurrency(product.price - product.discountAmount)}</span>
                                                            <del>{formatCurrency(product.price)}</del>
                                                        </div>
                                                        :
                                                        <div className="price">
                                                            <span className="price-num">{formatCurrency(product.price)}</span>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="product-num">
                                                    <div className="quantity btn-quantity style-1 me-3">
                                                            <button className="btn btn-plus" type="button"                                                                 
                                                                onClick={() => setCount(count + 1)}
                                                            >
                                                                <i className="ti-plus"></i>
                                                            </button>
                                                            <input className="quantity-input" type="text" value={count} name="demo_vertical2" />
                                                            <button className="btn btn-minus " type="button"                                                             
                                                                onClick={() => setCount(count - 1)}
                                                            >
                                                                <i className="ti-minus"></i>
                                                            </button> 
                                                        
                                                    </div>
                                                    <Link to={"shop-cart"} className="btn btn-primary btnhover btnhover2"><i className="flaticon-shopping-cart-1"></i> <span>Add to cart</span></Link>
                                                    <div className="bookmark-btn style-1 d-none d-sm-block">
                                                        <input className="form-check-input" type="checkbox" id="flexCheckDefault1" />
                                                        <label className="form-check-label" for="flexCheckDefault1">
                                                            <i className="flaticon-heart"></i>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-8">
                                <Tab.Container defaultActiveKey="details">
                                    <div className="product-description tabs-site-button">
                                        <Nav as="ul" className="nav nav-tabs">
                                            <Nav.Item as="li"><Nav.Link  eventKey="details">Details Product</Nav.Link></Nav.Item>
                                            <Nav.Item as="li"><Nav.Link  eventKey="review">Customer Reviews</Nav.Link></Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="details">
                                                <table className="table border book-overview">
                                                    <tbody>
                                                    <div>
                                                        <div dangerouslySetInnerHTML={{ __html: product.detail }} />
                                                    </div>
                                                        <tr className="tags">
                                                            <th>Tags</th>
                                                            <td>
                                                                {product.tags && Array.isArray(product.tags) && product.tags.map((tag, i) => (
                                                                    <Link key={i} to={"#"} className="badge me-1">
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
                                                        <h4 className="comments-title">COMMENTS</h4>
                                                        <div id="comment">
                                                            {/*<ol className="comment-list">
                                                                {product.reviews && Array.isArray(product.reviews) && product.reviews.map((review, i) => (
                                                                    <li key={i} className="comment odd alt thread-even depth-1 comment" id={`comment-${i}`}>
                                                                        <CommentBlog  reviewInfor = {review} />
                                                                    </li>
                                                                ))}
                                                            </ol>*/}
                                                            <ol className="comment-list">
                                                                {product.reviews && Array.isArray(product.reviews) && product.reviews.map((review, i) => (
                                                                    <li key={i} className="comment odd alt thread-even depth-1 comment" id={`comment-${i}`}>
                                                                        <p>{review.comment}</p>
                                                                        <p>{review.orderId}</p>
                                                                        <p>{review.rating}</p>
                                                                        <p>{review.editAble}</p>
                                                                        <p>{formatDate(review.createdAt)}</p>
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                        <div className="default-form comment-respond style-1" id="respond">
                                                            <h4 className="comment-reply-title" id="reply-title">LEAVE A REPLY 
                                                                <small> 
                                                                    <Link to={"#"} rel="nofollow" id="cancel-comment-reply-link" style={{display:"none"}}>Cancel reply</Link> 
                                                                </small>
                                                            </h4>
                                                            <div className="clearfix">
                                                                <form method="post" id="comments_form" className="comment-form" novalidate>
                                                                    <p className="comment-form-author"><input id="name" placeholder="Author" name="author" type="text" value="" /></p>
                                                                    <p className="comment-form-email">
                                                                        <input id="email" required="required" placeholder="Email" name="email" type="email" value="" />
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
                                        {relatedBook.map((data, index)=>(
                                            <div className="col-xl-12 col-lg-6" key={index}>
                                                <div className="dz-shop-card style-5">
                                                    <div className="dz-media">
                                                        <img src={data.image} alt="" /> 
                                                    </div>
                                                    <div className="dz-content">
                                                        <h5 className="subtitle">{data.title}</h5>
                                                        <ul className="dz-tags">
                                                            <li>THRILLE,</li>
                                                            <li>DRAMA,</li>
                                                            <li>HORROR</li>
                                                        </ul>
                                                        <div className="price">
                                                            <span className="price-num">$45.4</span>
                                                            <del>$98.4</del>
                                                        </div>
                                                        <Link to={"shop-cart"} className="btn btn-outline-primary btn-sm btnhover btnhover2"><i className="flaticon-shopping-cart-1 me-2"></i> Add to cart</Link>
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