const images = Array(12).fill('/images/Emy.png');

const LandingGallery = () => {
    return (
        <div className='bg-[#E8E8E8] py-16'>
            <div className='max-w-screen-xl mx-auto px-4'>
                <h2 className='text-black text-center mb-2 text-xl' >
                    <span>Check out </span>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className='font-serif font-bold'>
                        Barber
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className='text-barberRed font-serif font-bold'>
                        Dog
                    </a>
                    <span> on </span>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className=''>
                        Instagram
                    </a>
                    <span>.</span>
                </h2>
            </div>
            <div className='flex justify-center mt-8'>
                <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7'>
                    {images.map((image, index) => (
                        <div key={index} className='h-[225px] w-[225px] drop-shadow-md'>
                            <img src={image} alt={`Gallery ${index + 1}`} className='w-full h-auto object-cover' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingGallery;
