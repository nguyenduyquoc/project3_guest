import React from 'react';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

class SlideDragable extends React.Component {
   render() {
      return (
         <div className="slider" id="SlideDragable">
            {/*<Nouislider
               connect
               tooltips={true}
               start={[40, 80]}
               behaviour="tap"
               snap
               range={{
                  min: [0],
                  "10%": 10,
                  "20%": 20,
                  "30%": 30,
                  "40%": 40,
                  "50%": 50,
                  "60%": 60,
                  "70%": 70,
                  "80%": 80,
                  "90%": 90,
                  max: [100],
               }}
            />*/}
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
