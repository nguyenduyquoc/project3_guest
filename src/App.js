import React from 'react';
import Index from './pages/Index';	

//Css 
import "./assets/css/style.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";
import {CategoryProvider} from "./context/CategoryContext";

function App() {
	return (
		<CategoryProvider>
			<div className="App">
				<Index />
			</div>
		</CategoryProvider>
	);
}

export default App;
