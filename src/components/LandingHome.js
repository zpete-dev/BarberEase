const LandingHome = () => {
    return (
        <div className='bg-cover bg-center h-[900px] font-serif' style={{ backgroundImage: 'url(/images/DogInAChair-desat.jpg)' }}>
            <div className='flex flex-col w-full h-1/3 p-5 place-items-center'>
                <div className='flex flex-row gap-8 md:gap-12 items-center mb-4 text-gray-200 text-xl drop-shadow-md'>
                    <a href="#home" className='underline hover:text-hoverRed'>Home</a>
                    <a href="#services" className='underline hover:text-hoverRed'>Services</a>
                    <a href="/" className='hidden lg:flex items-center mb-3 mx-3'>
                        <img src='/images/BarberDogSymbol.png' alt='BarberDog Logo' className='h-[200px] w-[200px]' />
                        <span className='text-white text-6xl'>Barber</span>
                        <span className='text-barberRed text-6xl'>Dog</span>
                    </a>
                    <a href="#gallery" className='underline hover:text-hoverRed'>Gallery</a>
                    <a href="#contact" className='underline hover:text-hoverRed'>Contact</a>
                </div>
                <div className='lg:hidden flex items-center mb-4 text-white text-xl'>
                    <a href="/" className='flex items-center mb-3 mx-3'>
                        <img src='/images/BarberDogSymbol.png' alt='BarberDog Logo' className='h-[125px] w-[125px]' />
                        <span className='text-white text-4xl'>Barber</span>
                        <span className='text-barberRed text-4xl'>Dog</span>
                    </a>
                </div>
            </div>
            <div className='flex max-w-screen-xl mx-auto h-1/3 py-5 px-10 items-center justify-center sm:justify-start'>
                <div className='flex flex-col gap-3 text-5xl'>
                    <h1 className='text-white font-bold'>
                        HAIR CARE.
                    </h1>
                    <h2 className='text-white font-bold'>
                        FOR DOGS,
                    </h2>
                    <h1 className='text-barberRed font-bold'>
                        BY DOGS.
                    </h1>
                </div>
            </div>
            <div className='flex w-full h-1/3 p-5 place-content-center justify-center items-center'>
                <a href="/book-appointment" className='border-barberRed text-white hover:text-hoverRed text-4xl py-3 px-7 rounded-lg border-2'>
                    Book Now
                </a>
            </div>
        </div>
    );
};

export default LandingHome;
