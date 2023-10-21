import React from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Navigation, Pagination } from "swiper";

//Images

import book1 from './../../assets/images/books/large/bigbook1.jpg';
import book2 from './../../assets/images/books/large/bigbook2.jpg';





// import Swiper core and required modules

const dataBlog = [
	{ image: book1, title:'A Heavy LIft'},
	{ image: book2, title:'Pushing Clouds'},
	{ image: book1, title:'A Heavy LIft'},
	{ image: book2, title:'Pushing Clouds'},
	{ image: book1, title:'A Heavy LIft'},
	{ image: book2, title:'Pushing Clouds'},
]; 

function FeaturedSlider() {
	const navigationPrevRef = React.useRef(null)
	const navigationNextRef = React.useRef(null)
    const paginationRef = React.useRef(null)
	return (
		<>			
            <Swiper className="swiper-container books-wrapper-2 swiper-three"						
                
                //parallax= {true}
                centeredSlides={true}
                slidesPerView={"auto"}
                spaceBetween= {90}
                loop={true}
				speed={1000}
                pagination= {{
                    el: ".swiper-pagination-three",
                    clickable: true,
                }}
                //autoplay= {{
                //    delay: 4500,
                //}}								
				onSwiper={(swiper) => {
					setTimeout(() => {
						swiper.params.navigation.prevEl = navigationPrevRef.current
						swiper.params.navigation.nextEl = navigationNextRef.current
						swiper.navigation.destroy()
						swiper.navigation.init()
						swiper.navigation.update()
					})
				}}
                modules={[Navigation, Pagination]}
                breakpoints = {{
                    320: {
                        slidesPerView: 1,
                    },
                    1200: {
                        slidesPerView: 1,
                    },
                    1680: {
                        slidesPerView: 1,
                    },
                }}						
            >	
            
                {dataBlog.map((item,ind)=>(
                    <SwiperSlide key={ind}>                       
                        <div className="books-card style-2">
                            <div className="dz-media">
                                <img src={item.image} alt="book" />									
                            </div>
                            <div className="dz-content">
                                <h6 className="sub-title">BEST SELLER</h6>
                                <h2 className="title">{item.title}</h2>
                                <ul className="dz-tags">
                                    <li>Napoleon Hill</li>
                                    <li>Business & Strategy</li>
                                </ul>
                                <p className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </p>
                                <div className="price">
                                    <span className="price-num">${ind+7}.5</span>
                                    <del>${ind+11}.0</del>
                                    <span className="badge">20% OFF</span>
                                </div>
                                <div className="bookcard-footer">
                                    <Link to={"shop-cart"} className="btn btn-primary btnhover m-t15 m-r10">Buy Now</Link>
                                    <Link to={"shops-detail"} className="btn btn-outline-secondary btnhover m-t15">See Details</Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    
                ))}	
                <div className="pagination-align style-2">
                    <div className="swiper-button-prev" ref={navigationPrevRef}><i className="fa-solid fa-angle-left"></i></div>
                    <div className="swiper-pagination-three" ref={paginationRef}></div>
                    <div className="swiper-button-next"  ref={navigationNextRef}><i className="fa-solid fa-angle-right"></i></div>
                </div>									
            </Swiper>			
		</>
	)
}
export default FeaturedSlider;