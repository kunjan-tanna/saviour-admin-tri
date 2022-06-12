/**
 * Line chart widget
 */
import React, { Component } from "react";
import { Line } from "react-chartjs-2";

// rct card box
import { RctCard, RctCardContent } from 'Components/RctCard';

export default class LineChart extends Component {

   render() {
      const { data, options, bgColor, icon, title, total, trade } = this.props.data;
      return (
         <div className={`bg-color ${bgColor}`}>
            <RctCard >
               <RctCardContent>
                  <div className="colorBoxBlock">                     
                     {/* <div className="chart-wrap">
                        <Line ref="chart" data={data} options={options} height={35} />
                     </div> */}
                     <div className="d-flex justify-content-center">
                        <h1 className='dashboard-count'>{total}</h1>
                     </div>
                     <div className="chart-title d-flex justify-content-center align-items-center">
                        <span className="material-icons mr-10">{icon}</span>
                        <span className="text-capitalize">{title}</span>
                     </div>
                  </div>
               </RctCardContent>
            </RctCard>
         </div>
      );
   }
}
