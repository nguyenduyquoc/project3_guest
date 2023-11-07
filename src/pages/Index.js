import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop2 from "react-scroll-to-top";

//layouts
import Header from './../layouts/Header';
import Footer from './../layouts/Footer';
import ScrollToTop from './../layouts/ScrollToTop';
import Main from '../layouts/Main';

//Pages
import Home from './Home';
import AboutUs from './AboutUs';
import MyProfile from './MyProfile';
import Services from './Services';
import Faq from './Faq';
import HelpDesk from './HelpDesk';
import Pricing from './Pricing';
import PrivacyPolicy from './PrivacyPolicy';
import BooksGridView from './BooksGridView';
import ShopList from './ShopList';
import BooksGridViewSidebar from './BooksGridViewSidebar';
import BooksListViewSidebar from './BooksListViewSidebar';
import ShopCart from './ShopCart';
import Wishlist from './Wishlist';
import Login from './Login';
import Registration from './Registration';
import ShopCheckout from './ShopCheckout';
import ShopDetail from './ShopDetail';
import BlogGrid from './BlogGrid';
import BlogLargeSidebar from './BlogLargeSidebar';
import BlogListSidebar from './BlogListSidebar';
import BlogDetail from './BlogDetail';
import ContactUs from './ContactUs';

import ErrorPage from './ErrorPage';
import UnderConstruction from './UnderConstruction';
import ComingSoon from './ComingSoon';
import OrderHistory from "./OrderHistory";
import OrderHistoryDetail from "./OrderHistoryDetail";
import ReturnRequestHistory from "./ReturnRequestHistory";
import ReturnRequestHistoryDetail from "./ReturnRequestHistoryDetail";

//images
import logo from './../assets/images/logo.png';


function Index(props){
	var baseName = '';
	return(
		<BrowserRouter basename={baseName}>
			<div className="page-wraper">
				<Switch>
					<Route path='/error-404' component={ErrorPage} />
					<Route path='/under-construction' component={UnderConstruction} />
					<Route path='/coming-soon' component={ComingSoon} />

					<Route>
						<Header />
						<Main>
							<Switch>
								<Route path='/' exact component={Home} />
								<Route path='/about-us' exact component={AboutUs} />
								<Route path='/my-profile' exact component={MyProfile} />
								<Route path='/services' exact component={Services} />
								<Route path='/faq' exact component={Faq} />
								<Route path='/help-desk' exact component={HelpDesk} />
								<Route path='/pricing' exact component={Pricing} />
								<Route path='/privacy-policy' exact component={PrivacyPolicy} />
								<Route path='/books-grid-view' exact component={BooksGridView} />
								<Route path='/books-list' exact component={ShopList} />
								<Route path='/books-grid-view-sidebar' exact component={BooksGridViewSidebar} />
								<Route path='/books-list-view-sidebar' exact component={BooksListViewSidebar} />
								<Route path='/shop-cart' exact component={ShopCart} />
								<Route path='/wishlist' exact component={Wishlist} />
								<Route path='/shop-login' exact component={Login} />
								<Route path='/shop-registration' exact component={Registration} />
								<Route path='/shop-checkout' exact component={ShopCheckout} />
								<Route path='/shop-detail/:slug' exact component={ShopDetail} />
								<Route path='/blog-grid' exact component={BlogGrid} />
								<Route path='/blog-large-sidebar' exact component={BlogLargeSidebar} />
								<Route path='/blog-list-sidebar' exact component={BlogListSidebar} />
								<Route path='/blog-detail' exact component={BlogDetail} />
								<Route path='/contact-us' exact component={ContactUs} />
								<Route path='/order-history' exact component={OrderHistory} />
								<Route path='/order-history-detail/:code' exact component={OrderHistoryDetail} />
								<Route path='/return_request_history' exact component={ReturnRequestHistory} />
								<Route path='/return_request_history/:code' exact component={ReturnRequestHistoryDetail} />
							</Switch>
						</Main>
						<Footer  footerChange="style-1" logoImage={logo}/>
					</Route>
				</Switch>
				<ScrollToTop />
				<ScrollToTop2 className="styles_scroll-to-top__2A70v  fas fa-arrow-up scroltop" smooth />							
			</div>
		</BrowserRouter>			
	)
} 
export default Index;