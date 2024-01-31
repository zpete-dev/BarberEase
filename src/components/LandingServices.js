import React, { useState, useEffect } from 'react';

import Skeleton from 'react-loading-skeleton';
import '../skeleton.css';
const LandingServices = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [dialogInfo, setdialogInfo] = useState(<p>null</p>);
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

    const renderLandingServices = () => {
        if (isLoading) {
            return (
                <div className='bg-white py-16 font-serif'>
                    <div className='max-w-screen-xl mx-auto px-4 drop-shadow-md'>
                        <div className='w-[200px] h-[40px] mx-auto mb-2'>
                            <Skeleton className='h-full animate-pulse z-0' />
                        </div>
                        <div className='w-[320px] h-[24px] mx-auto mb-8'>
                            <Skeleton className='h-full animate-pulse z-0' />
                        </div>
                    </div>
                    <div className='grid grid-rows-2 gap-10 w-full drop-shadow-md'>
                        {/* First Row */}
                        <div className='flex gap-4 md:gap-10 justify-center'>
                            <div className='w-[85px] h-[85px]'>
                                <Skeleton circle className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[85px] h-[85px]'>
                                <Skeleton circle className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[85px] h-[85px]'>
                                <Skeleton circle className='h-full animate-pulse z-0' />
                            </div>
                        </div>
                        {/* Second Row */}
                        <div className='flex justify-center gap-10'>
                            <div className='w-[85px] h-[85px]'>
                                <Skeleton circle className='h-full animate-pulse z-0' />
                            </div>
                            <div className='w-[85px] h-[85px]'>
                                <Skeleton circle className='h-full animate-pulse z-0' />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className='bg-white py-16 font-serif'>
                <div className='max-w-screen-xl mx-auto px-4 drop-shadow-md'>
                    <h2 className='text-4xl font-bold text-center underline mb-2'>Services</h2>
                    <p className='text-center mb-8'>Click for more info on services and pricing.</p>
                </div>
                <div className='grid grid-rows-2 gap-10 w-full drop-shadow-md'>
                    {/* First Row */}
                    <div className='flex gap-4 md:gap-10 justify-center'>
                        {Object.entries(services).slice(0, 3).map(([key, service]) => (
                            <div key={key} className='cursor-pointer hover:brightness-75 hover:text-hoverRed hover:underline' onClick={() => handleDivClick(service)}>
                                <img src={service.imgSrc} alt={service.altText} className='rounded-[85px] w-[85px] h-[85px] xs:rounded-[120px] xs:w-[120px] xs:h-[120px] sm:rounded-[160px] sm:w-[160px] sm:h-[160px] md:rounded-[160px] md:w-[300px] md:h-[150px] object-cover hover:border hover:border-hoverRed' />
                                <p className='text-sm md:text-xl text-center font-bold hover:underline'>{service.name}</p>
                            </div>
                        ))}
                    </div>
                    {/* Second Row */}
                    <div className='flex justify-center gap-10'>
                        {Object.entries(services).slice(3, servicesLength).map(([key, service]) => (
                            <div key={key} className='cursor-pointer hover:brightness-75 hover:text-hoverRed' onClick={() => handleDivClick(service)}>
                                <img src={service.imgSrc} alt={service.altText} className='rounded-[85px] w-[85px] h-[85px] xs:rounded-[120px] xs:w-[120px] xs:h-[120px] sm:rounded-[160px] sm:w-[160px] sm:h-[160px] md:rounded-[160px] md:w-[300px] md:h-[150px] object-cover hover:border hover:border-hoverRed' />
                                <p className='text-sm md:text-xl text-center font-bold hover:underline'>{service.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dialog Box */}
                {showDialog && (
                    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50'>
                        <div className='bg-white rounded-lg flex flex-col items-center p-8 relative'>
                            <button onClick={closeDialog} className='absolute top-0.5 left-2 text-lg bg-transparent text-gray-500 hover:text-gray-300 rounded-full p-1'>
                                x
                            </button>
                            {dialogInfo}
                            <div className='flex gap-4 mt-8'>
                                <button onClick={closeDialog} className='bg-barberRed text-white hover:bg-hoverRed px-5 py-2 rounded text-xl'>
                                    Book Now
                                </button>
                                <button onClick={closeDialog} className='bg-gray-600 text-white hover:bg-gray-900 px-5 py-2 rounded text-xl'>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    //console.log(serviceCategories.find(service => service._id === '0000').name);
    //console.log(barbers);

    const handleDivClick = (selectedService) => {
        setdialogInfo(selectedService.dialogInfo);
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
    };

    const services = {
        1: {
            name: 'Haircut',
            imgSrc: '/images/Memphis.jpg',
            altText: 'Placeholder',
            dialogInfo:
                <div className='flex flex-col w-full'>
                    <h2 className='mb-4 text-3xl font-bold self-center border-b-2 border-black'>Haircuts</h2>
                    <div className='flex flex-row mb-4 justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-lg xs:text-xl font-bold'>Buzz Cut - $20</span>
                            <span className='text-xs xs:text-sm'>Clipper cut, 1 length</span>
                        </div>
                        <div className='hidden xs:flex flex-col'>
                            <span className='self-center italic text-sm'>*All Haircuts come with a</span>
                            <span className='italic underline text-sm'>straight razor lineup & hot towel finish.</span>
                        </div>
                    </div>
                    <div className='flex flex-col mb-4'>
                        <span className='text-lg xs:text-xl font-bold'>Classic Fade - $30</span>
                        <span className='text-xs xs:text-sm'>Fade where you want + 1 length everywhere else</span>
                    </div>
                    <div className='flex flex-col mb-4'>
                        <span className='text-lg xs:text-xl font-bold'>Classic Haircut - $50</span>
                        <span className='text-xs xs:text-sm'>Try one of our shop’s specialties, or tell us how you want it</span>
                    </div>
                    <div className='xs:hidden'>
                        <span className='italic text-sm'>*All Haircuts come with a </span>
                        <span className='italic underline text-sm'>straight razor lineup & hot towel finish.</span>
                    </div>
                    <h2 className='hidden xs:flex mb-4 mt-4 text-2xl font-bold self-center border-b-2 border-black'>Specialty Styles</h2>
                    <div className='hidden xs:grid grid-cols-3 gap-1 items-start'>
                        <div className='text-base sm:text-xl mb-1 place-self-center'>Fades</div>
                        <div className='text-base sm:text-xl mb-1 place-self-center'>Short Styles</div>
                        <div className='text-base sm:text-xl mb-1 place-self-center'>Long Styles</div>
                        <div className='text-xs sm:text-base mx-0.5'>
                            <li>Bald Fade</li>
                            <li>Burst Fade</li>
                            <li>High/Low Top Fade</li>
                            <li>Temple Fade</li>
                            <li>Taper Fade</li>
                        </div>
                        <div className='text-xs sm:text-base mx-0.5'>
                            <li>Pompadour</li>
                            <li>High & Tight</li>
                            <li>Crew Cut</li>
                            <li>Undercut</li>
                            <li>Bob Cut</li>
                            <li>Pixie Cut</li>
                        </div>
                        <div className='text-xs sm:text-base mx-0.5'>
                            <li>Wolf Cut</li>
                            <li>Long Bob</li>
                            <li>Layered Haircuts</li>
                        </div>
                    </div>
                </div>,
        },
        2: {
            name: 'Color',
            imgSrc: '/images/Memphis.jpg',
            altText: 'Placeholder',
            dialogInfo: 'Placeholder',
        },
        3: {
            name: 'Beard Trim',
            imgSrc: '/images/Memphis.jpg',
            altText: 'Placeholder',
            dialogInfo: 'Placeholder',
        },
        4: {
            name: 'Nails',
            imgSrc: '/images/Memphis.jpg',
            altText: 'Placeholder',
            dialogInfo: 'Placeholder',
        },
        5: {
            name: 'Braids',
            imgSrc: '/images/Memphis.jpg',
            altText: 'Placeholder',
            dialogInfo: 'Placeholder',
        },
    };


    const servicesLength = Object.entries(services).length;

    return (
        renderLandingServices()
    );
};

export default LandingServices;
