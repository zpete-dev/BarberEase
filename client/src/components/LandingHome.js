import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import '../skeleton.css';
const LandingHome = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [homeBackgroundImg, sethomeBackgroundImg] = useState('');

    const skeletonTimeout = 500; // timeout in ms

    useEffect(() => {
        const loadImage = (path) => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });

        async function preloadBackgroundImage() {
            const myBackgroundImage = await loadImage('/images/LandingBackgroundDesat.jpg');
            sethomeBackgroundImg(myBackgroundImage);
        }

        const loadData = async () => {
            setIsLoading(true);

            const fetchBackgroundImage = preloadBackgroundImage();
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, skeletonTimeout));


            await Promise.all([timeoutPromise, fetchBackgroundImage]);
            setIsLoading(false);
        };

        loadData();
    }, []);

    const renderLandingHome = () => {
        if (isLoading) {
            return (
                <div className='bg-cover bg-center h-[900px] font-serif relative'>
                    <div className='absolute inset-0'>
                        <Skeleton className='h-full w-full animate-pulse z-0 opacity-10' />
                    </div>
                    <div className='flex flex-col w-full h-1/3 p-5 place-items-center'>
                        <div className='flex flex-row gap-8 md:gap-12 items-center mb-4 text-gray-200 text-xl drop-shadow-md'>
                            <div className='w-[52px] h-[28px] lg:w-[64px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[52px] h-[28px] lg:w-[64px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='hidden lg:flex items-center mb-3 mx-3'>
                                <div className='h-[200px] w-[200px] mr-1'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </div>
                                <div className='w-[100px] h-[40px] mr-1'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </div>
                                <div className='w-[64px] h-[40px]'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </div>
                            </div>
                            <div className='w-[52px] h-[28px] lg:w-[64px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[52px] h-[28px] lg:w-[64px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                        </div>
                        <div className='lg:hidden flex items-center mb-4 text-white text-xl'>
                            <div className='h-[125px] w-[125px] mr-1'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[100px] h-[40px] mr-1'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[64px] h-[40px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                        </div>
                    </div>
                    <div className='flex max-w-screen-xl mx-auto h-1/3 py-5 px-10 items-center justify-center sm:justify-start'>
                        <div className='flex flex-col gap-3 text-5xl'>
                            <h1 className='w-[260px] h-[48px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </h1>
                            <h2 className='w-[260px] h-[48px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </h2>
                            <h1 className='w-[260px] h-[48px]'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </h1>
                        </div>
                    </div>
                    <div className='flex w-full h-1/3 p-5 place-content-center justify-center items-center'>
                        <div className='text-4xl rounded-lg w-[220px] h-[68px]'>
                            <Skeleton className='h-full animate-pulse z-0' />
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className='bg-cover bg-center h-[900px] font-serif' style={{ backgroundImage: `url(${homeBackgroundImg.src})` }}>
                <div className='flex flex-col w-full h-1/3 p-5 place-items-center'>
                    <div className='flex flex-row gap-8 md:gap-12 items-center mb-4 text-gray-200 text-xl'>
                        <a href="#home" className='text-gray-300 hover:text-white hover:text-shadow-sm hover:shadow-white hover:scale-105 transition-all duration-100'>Home</a>
                        <a href="#services" className='text-gray-300 hover:text-white hover:text-shadow-sm hover:shadow-white hover:scale-105 transition-all duration-100'>Services</a>
                        <a href="/" className='hidden lg:flex items-center mb-3 mx-3'>
                            <img src='/images/BarberDemo.png' alt='BarberDemo Logo' className='h-[180px] w-[200px] mr-2' />
                            <span className='text-white text-6xl'>Barber</span>

                            <span className='text-barberRed text-6xl'>Demo</span>
                        </a>
                        <a href="#gallery" className='text-gray-300 hover:text-white hover:text-shadow-sm hover:shadow-white hover:scale-105 transition-all duration-100'>Gallery</a>
                        <a href="#contact" className='text-gray-300 hover:text-white hover:text-shadow-sm hover:shadow-white hover:scale-105 transition-all duration-100'>Contact</a>
                    </div>
                    <div className='lg:hidden flex items-center mb-4 text-white text-xl'>
                        <a href="/" className='flex items-center mb-3 mx-3'>
                            <img src='/images/BarberDemo.png' alt='BarberDemo Logo' className='h-[125px] w-[125px] mr-2' />
                            <span className='text-white text-4xl'>Barber</span>
                            <span className='text-barberRed text-4xl'>Demo</span>
                        </a>
                    </div>
                </div>
                <div className='flex max-w-screen-xl mx-auto h-1/3 py-5 px-10 items-center justify-center sm:justify-start'>
                    <div className='flex flex-col gap-3 text-5xl'>
                        <h1 className='text-white font-bold'>
                            HAIR CARE.
                        </h1>
                        <h2 className='text-white font-bold'>
                            FOR YOU,
                        </h2>
                        <h1 className='text-barberRed font-bold'>
                            BY US.
                        </h1>
                    </div>
                </div>
                <div className='flex w-full h-1/3 p-5 place-content-center justify-center items-center'>
                    <a href="/book-appointment" className='border-barberRed text-gray-300 text-4xl py-3 px-7 rounded-lg border-2
                    transition-all ease-in-out duration-200 hover:bg-barberRed hover:scale-105 hover:text-white'>
                        Book Now
                    </a>
                </div>
            </div>
        );
    };

    return (
        renderLandingHome()
    );
};

export default LandingHome;
