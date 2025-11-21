"use client";

import CompanyServices from "../components/Home/AboutService/AboutService";
import AccountPromotion from "../components/Home/AccountPromotion/AccountPromotion";
import Slider from "../components/Home/Slider/Slider";
import TradingFeatures from "../components/Home/TrandingFeature/TrandingFeature";

export default function Home() {
  
  return (
    <div>
        <Slider />
        <TradingFeatures/>
        <AccountPromotion/>
        <CompanyServices/>
    </div>
  );
}
