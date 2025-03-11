import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CloudinaryImage from "./CloudinaryImage";

interface DrawingsProps {
  images: string[];
}

const Drawings: React.FC<DrawingsProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="p-4">
            <CloudinaryImage cloudinaryUrl={image} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Drawings;