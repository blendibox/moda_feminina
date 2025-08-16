
"use client"
   import Image from 'next/image';
   import { useState, useEffect } from 'react';

   const images = [
       { src: '/images/natflix/1.png', alt: 'Imagem 1' },
       { src: '/images/natflix/2.png', alt: 'Imagem 1' },
       { src: '/images/natflix/3.png', alt: 'Imagem 1' },
	   { src: '/images/natflix/4.png', alt: 'Imagem 1' },
       { src: '/images/natflix/5.png', alt: 'Imagem 1' },
       { src: '/images/natflix/6.png', alt: 'Imagem 1' },
	   { src: '/images/natflix/7.png', alt: 'Imagem 1' },
       { src: '/images/natflix/8.png', alt: 'Imagem 1' },
       { src: '/images/natflix/9.png', alt: 'Imagem 1' },
	   { src: '/images/natflix/10.png', alt: 'Imagem 1' },
       { src: '/images/natflix/10.png', alt: 'Imagem 1' },
       { src: '/images/natflix/12.png', alt: 'Imagem 1' },
	   
	   
   ];
   
   /*
    <div className="flex min-w-full">
               <button onClick={prevImage} className=" relative m-10 bg-pink-500 rounded text-white  p-3 hover:p-4 ml-3">Anterior</button>
               <button onClick={nextImage} className=" relative m-10 bg-pink-500 rounded text-white p-3 hover:p-4 mr-3">Próximo</button>
			   </div> 
   */

export default function Carousel({ time }) {
  
  const delay = time || 2000; // Altera a cada 2 segundos
       const [currentImage, setCurrentImage] = useState(0);
	   
       const nextImage = () => {
           setCurrentImage((prev) => (prev + 1) % images.length);
       };

       const prevImage = () => {
           setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
       };
	   
	   
	       

		  useEffect(() => {
			const intervalId = setInterval(() => {
			  setCurrentImage((prev) => (prev + 1) % images.length);
			}, delay); 

			return () => clearInterval(intervalId);
		  }, []);
	   
	   

       return (
           <div className="">
               <Image className="responsive"
                   src={images[currentImage].src}
                   alt={images[currentImage].alt}
                   width={500}
                   height={300}

               /> 
			 
           </div>
       );
   };

