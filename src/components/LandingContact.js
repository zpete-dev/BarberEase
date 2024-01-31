import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

const LandingContact = () => {
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

    const renderLandingContact = () => {
        if (isLoading) {
            return (
                <div className='bg-white py-12 h-auto font-serif'>
                    <div className='max-w-screen-xl mx-auto px-4'>
                        <h2 className='text-4xl font-bold text-center underline mb-8 w-[200px] h-[40px] mx-auto'>
                            <Skeleton className='h-full animate-pulse z-0' />
                        </h2>
                        <div className='grid md:grid-cols-2 gap-4'>
                            {/* Left Column - Store Information */}
                            <div className='flex text-black flex-col items-center'>
                                <h3 className='text-2xl font-semibold text-[#4B4B4B] mb-4 w-[64px] h-[32px]'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </h3>
                                <div className='w-1/2 grid grid-cols-2 grid-rows-3 gap-1 mb-5'>
                                    <p className='w-[84px] h-[24px]'>
                                        <Skeleton className='h-full animate-pulse z-0' />
                                    </p>
                                    <p className='w-[84px] h-[24px]'>
                                        <Skeleton className='h-full animate-pulse z-0' />
                                    </p>
                                    <p className='w-[84px] h-[24px]'>
                                        <Skeleton className='h-full animate-pulse z-0' />
                                    </p>
                                    <p className='w-[84px] h-[24px]'>
                                        <Skeleton className='h-full animate-pulse z-0' />
                                    </p>
                                    <p className='w-[84px] h-[24px]'>
                                        <Skeleton className='h-full animate-pulse z-0' />
                                    </p>
                                    <p className='w-[84px] h-[24px]'>
                                        <Skeleton className='h-full animate-pulse z-0' />
                                    </p>
                                </div>
                                <h3 className='text-lg font-semibold text-[#4B4B4B] w-[64px] h-[28px]'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </h3>
                                <p className='text-xl mt-1 mb-5 w-[132px] h-[28px]'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </p>
                                <h3 className='text-lg font-semibold text-[#4B4B4B] w-[64px] h-[28px]'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </h3>
                                <p className='text-xl mt-1 mb-5 w-[300px] h-[28px]'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </p>
                            </div>
                            <div>
                                <div className='w-full h-[450px] mx-auto mb-8'>
                                    <Skeleton className='h-full animate-pulse z-0' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className='bg-white py-12 h-auto font-serif'>
                <div className='max-w-screen-xl mx-auto px-4'>
                    <h2 className='text-4xl font-bold text-center underline mb-8'>Contact Us</h2>
                    <div className='grid md:grid-cols-2 gap-4'>
                        {/* Left Column - Store Information */}
                        <div className='flex text-black flex-col items-center'>
                            <h3 className='text-2xl font-semibold text-[#4B4B4B] mb-4'>Hours</h3>
                            <div className='w-1/2 grid grid-cols-2 grid-rows-3 gap-1 mb-5'>
                                <p className=''>Mon - Thu</p>
                                <p className='justify-self-end'>9am - 5pm</p>
                                <p className=''>Fri & Sat</p>
                                <p className='justify-self-end'>8am - 6pm</p>
                                <p className=''>Sun</p>
                                <p className='justify-self-end'>8am - 5pm</p>
                            </div>
                            <h3 className='text-lg font-semibold text-[#4B4B4B]'>Phone</h3>
                            <p className='text-xl mt-1 mb-5'>(555) 555-5555</p>
                            <h3 className='text-lg font-semibold text-[#4B4B4B]'>Address</h3>
                            <p className='text-xl mt-1 mb-5'>1234 W Main St. Denver, CO 80123</p>
                        </div>
                        {/* Right Column - Google Maps */}
                        <div>
                            <iframe
                                async
                                title='BarberDog Location'
                                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12271.352271222568!2d-104.99775260216704!3d39.743288172302194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c78d5472cf5a3%3A0x40482bfb29562d8c!2sCivic%20Center%20Park!5e0!3m2!1sen!2sus!4v1706732855675!5m2!1sen!2sus'
                                width='100%'
                                height='450'
                                style={{ border: 0 }}
                                allowFullScreen=''
                                loading='lazy'
                                referrerPolicy='no-referrer-when-downgrade'
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        renderLandingContact()
    );
};

export default LandingContact;
