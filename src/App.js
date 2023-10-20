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

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<LoadingProvider>
					<CategoryProvider>
						<ProvinceProvider>
							<CouponProvider>
								<Loading />
								<div className="App">
									<Index />
									<ToastContainer />
								</div>
							</CouponProvider>
						</ProvinceProvider>
					</CategoryProvider>
				</LoadingProvider>
			</UserProvider>
		</AuthProvider>

	);
}

export default App;
