import React from 'react';
import Index from './pages/Index';	

//Css 
import "./assets/css/style.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";
import {CategoryProvider} from "./context/CategoryContext";
import {AuthProvider} from "./context/AuthContext";
import {UserProvider} from "./context/UserContext";
import {ToastContainer} from "react-toastify";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<CategoryProvider>
					<div className="App">
						<Index />
						<ToastContainer />
					</div>
				</CategoryProvider>
			</UserProvider>
		</AuthProvider>

	);
}

export default App;
