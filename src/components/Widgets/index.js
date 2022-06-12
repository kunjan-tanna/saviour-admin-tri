/**
 * App Widgets
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
   <PreloadWidget />
)


const LineChart = Loadable({
   loader: () => import("./LineChart"),
   loading: MyLoadingComponent
})


export {
   LineChart
}