import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import '../App.css';


function ImageSlider({ imageIds }) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 2000, stopOnInteraction: false })]);

    return (
        <div className="card-image-contaner">
            <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                    {imageIds.map((id) => (
                        <div key={id} className="embla__slide">
                            <img key={id} src={`https://booklink.pro/tb/tours/photo?id=${id}`} alt="house image" />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default ImageSlider;