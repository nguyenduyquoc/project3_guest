import React, {useState} from 'react';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import {Link} from "react-router-dom";

const SlideDragable = ({filterCriteria, setFilterCriteria}) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(200);
      return (
         <div className="slider" id="SlideDragable">
             <Nouislider
                 connect
                 tooltips={true}
                 start={[
                     filterCriteria.minPrice == null ? 0 : filterCriteria.minPrice,
                     filterCriteria.maxPrice == null ? 200 : filterCriteria.maxPrice
                 ]}
                 behaviour="tap"
                 range={{
                     min: 0,
                     max: 200
                 }}
                 onUpdate={(values) => {
                     setMinPrice(values[0] === 0 ? null : values[0]);
                     setMaxPrice(values[1] === 200 ? null : values[1]);
                 }}
             />
             <Link
                 className="btn btn-secondary btnhover d-block m-t60"
                 onClick={() => setFilterCriteria({
                     ...filterCriteria,
                     minPrice: minPrice,
                     maxPrice: maxPrice
                 })}
             >Filter
             </Link>
         </div>
      );

}

export default SlideDragable;
