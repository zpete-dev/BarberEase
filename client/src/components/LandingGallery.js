import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import '../skeleton.css';

const images = Array(12).fill('/images/Emy.png');
const LandingGallery = () => {
    const [isLoading, setIsLoading] = useState(true);

    const skeletonTimeout = 500; // timeout in ms
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, skeletonTimeout));
            setIsLoading(false);
        };

        loadData();
    }, []);

    const renderLandingGallery = () => {
        if (isLoading) {
            return (
                <div className='bg-[#E8E8E8] py-16'>
                    <div className='w-[350px] h-[30px] drop-shadow-md mx-auto'>
                        <Skeleton className='h-full animate-pulse z-0' />
                    </div>
                    <div className='flex justify-center mt-8'>
                        <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7'>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[200px] h-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <Skeleton className='h-full animate-pulse z-0' />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
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
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                                key={index} className='h-[200px] w-[200px] md:h-[225px] md:w-[225px] drop-shadow-md'>
                                <img src={image} alt={`Gallery ${index + 1}`} className='w-full h-auto object-cover hover:scale-105 transition-all duration-150 ease-in-out' />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        renderLandingGallery()
    );
};

export default LandingGallery;
