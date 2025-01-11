import './Carrossel.css';
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';



import carouselLogo from '../../../assets/carroussel_logo.png';
import shop from '../../../assets/shop.png';
import entrega from '../../../assets/entrega_imgg.png';



register();

function Carrossel() {

  const data = [carouselLogo, shop, entrega];

  return (
    <div className="container">
      <Swiper
        navigation={true}
        
       
        slidesPerView={1}
        autoplay={{
          delay: 2500,  
          disableOnInteraction: false, 
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item} alt={`Slide ${index}`} className="slide-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carrossel;
