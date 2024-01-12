import logo from "./logo.svg";
import "./App.css";
import { Switch } from "@chakra-ui/switch";
import { useState } from "react";
import FiveDayData from "./FiveDayData/FiveDayData";
import CityNameSearch from "./CityName/CityNameSearch.jsx";
import React, { useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Button, Input } from "@chakra-ui/react";

// import required modules
import { EffectFlip, Pagination, Navigation } from "swiper/modules";
function App() {
  const [searchValue, setSearchValue] = useState("kolkata");

  const [value,setValue]=useState('')

  function handleSubmit(value){
    try {
    setSearchValue(value);
      
    } catch (error) {
      console.log(error);
    }
   }

   function handleValue(e){
    try {
    setValue(e.target.value);
      
    } catch (error) {
      console.log(error);
    }
   }
 

  return (
    <div className={`App `}>
      <h2>Weather App</h2>
       <form onSubmit={(e) => {e.preventDefault()
        handleSubmit(value)
      }}>
         <Input w={"300px"} type="text" value={value} onChange={handleValue} />
        <Button ml={"10px"} type="submit">Search</Button>
       </form>
      <Swiper
        effect={"flip"}
        grabCursor={true}
        pagination={true}
        navigation={true}
        modules={[EffectFlip, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="weather-container">{<FiveDayData searchValue={searchValue} />}</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="weather-container">{<CityNameSearch searchValue={searchValue} />}</div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default App;
