import React from 'react';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

class SlideDragable extends React.Component {
   render() {
      return (
         <div className="slider" id="SlideDragable">
             <Nouislider
                 connect
                 tooltips={true}
                 start={[0, 200]}
                 behaviour="tap"
                 range={{
                     min: 0,
                     max: 200
                 }}
             />
         </div>
      );
   }
}

export default SlideDragable;
