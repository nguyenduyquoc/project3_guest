import React from 'react';
import Index from './pages/Index';

//Css
import "./assets/css/style.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";
import {CategoryProvider} from "./context/CategoryContext";
import {AuthProvider} from "./context/AuthContext";
import {UserProvider} from "./context/UserContext";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {LoadingProvider} from "./context/LoadingContext";
import Loading from "./layouts/Loading";
import {ProvinceProvider} from "./context/ProvinceContext";
import {CouponProvider} from "./context/CouponContext";
import {CartProvider} from "./context/CartContext";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import {CLIENT_ID} from "./config"

function App() {
	return (
		<LoadingProvider>
			<AuthProvider>
				<UserProvider>
					<CartProvider>
						<CategoryProvider>
							<ProvinceProvider>
								<CouponProvider>
									<PayPalScriptProvider options={{ "client-id": CLIENT_ID }}>
										<Loading />
										<div className="App">
											<Index />
											<ToastContainer />
										</div>
									</PayPalScriptProvider>
								</CouponProvider>
							</ProvinceProvider>
						</CategoryProvider>
					</CartProvider>
				</UserProvider>
			</AuthProvider>
		</LoadingProvider>

	);
}

export default App;
