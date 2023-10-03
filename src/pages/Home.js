import React from 'react';
//import {Link} from 'react-router-dom';

//import Header from './../layouts/Header';
//import Footer from './../layouts/Footer';

//Components 
import HomeMainSlider from '../components/Home/HomeMainSlider';
import ClientsSlider from './../components/Home/ClientsSlider';
import RecomendedSlider from './../components/Home/RecomendedSlider';
import BookSaleSlider from './../components/Home/BookSaleSlider';
import FeaturedSlider from './../components/Home/FeaturedSlider';
import OfferSlider from './../components/Home/OfferSlider';
import TestimonialSlider from './../components/Home/TestimonialSlider';
import LatestNewsSlider from './../components/Home/LatestNewsSlider';
import NewsLetter from './../components/NewsLetter';

//element
import CounterSection from './../elements/CounterSection';

const iconBlog = [
    {title:'Quick Delivery', iconClass:'flaticon-power'}, 
    {title:'Secure Payment', iconClass:'flaticon-shield '}, 
    {title:'Best Quality', iconClass:'flaticon-like'}, 
    {title:'Return Guarantee', iconClass:'flaticon-star'}, 
];

function Index1(){	
	return(
		<>
				
			<div className="page-content bg-white">		
				<div className="main-slider style-1"> 
					<HomeMainSlider />
				</div>
				<div className="bg-white py-5">
					<div className="container">
						<ClientsSlider />
					</div>
				</div>	
				<section className="content-inner-1 bg-grey reccomend">
					<div className="container">
						<div className="section-head text-center">
							<h2 className="title">Recomended For You</h2>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris</p>
						</div>
						<RecomendedSlider />
					</div>
				</section>		

				<section className="content-inner-2">
					<div className="container">
						<div className="row">
							{iconBlog.map((data, ind)=>(
                                <div className="col-lg-3 col-sm-6" key={ind}>
                                    <div className="icon-bx-wraper style-1 m-b30 text-center">
                                        <div className="icon-bx-sm m-b10">
                                            <i className={`icon-cell ${data.iconClass}`} />
                                        </div>
                                        <div className="icon-content">
                                            <h5 className="dz-title m-b10">{data.title}</h5>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
						</div>
					</div>
				</section>
				<section className="content-inner-1">
					<div className="container">
						<BookSaleSlider />
					</div>
				</section>
				<section className="content-inner-1 bg-grey reccomend">
					<div className="container">
						<div className="section-head text-center">
							<div className="circle style-1"></div>
							<h2 className="title">Featured Product</h2>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </p>
						</div>
					</div>
					<div className="container">		
						<FeaturedSlider />
					</div>
				</section>
				<section className="content-inner-2">
					<div className="container">
						<OfferSlider />
					</div>
				</section>	
				<section className="content-inner-2 testimonial-wrapper">
					<TestimonialSlider />	
				</section>	
				<section className="content-inner-2">
					<div className="container">
						<div className="section-head text-center">
							<h2 className="title">Latest News</h2>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
						</div>
						<LatestNewsSlider />	
					</div>
				</section>	
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
export default Index1;