import React, { useState, useEffect, useRef } from 'react';
import { serviceCategories } from '../data/data';
import { DateTime } from 'luxon';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const ServiceAndProviderForm = ({ providers, selectedServices, setSelectedServices, selectedProviders, setSelectedProviders, setSubtotal, setSelectedTime, setSelectedDate }) => {

    const [currentFilter, setCurrentFilter] = useState("all");
    const [showInfo, setShowInfo] = useState({}); // State to track which service info to show
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

    const toggleService = (serviceId) => {
        //Set the list of Selected Services
        const currentServices = selectedServices.includes(serviceId)
            ? selectedServices.filter(id => id !== serviceId)
            : [...selectedServices, serviceId];
        setSelectedServices(currentServices);


        //Calculate Subtotal
        let mySubtotal = 0;
        if (currentServices.length > 0) {
            mySubtotal = currentServices.reduce((total, aServiceId) => {
                const service = serviceCategories.flatMap(category => category.services).find(service => service._id === aServiceId);
                return total + parsePrice(service?.price || '0');
            }, 0);
        }
        setSubtotal(mySubtotal);
    };

    const toggleInfo = (event, serviceId) => {
        event.stopPropagation();
        setShowInfo(prevInfo => ({ ...prevInfo, [serviceId]: !prevInfo[serviceId] }));
    };

    // Function to parse price string and return numeric value
    const parsePrice = (priceString) => {
        return Number(priceString.replace(/[^0-9.-]+/g, ""));
    };

    const toggleProvider = (providerId) => {
        setSelectedTime(null);
        setSelectedDate(DateTime.now().setZone('America/Denver').toJSDate());
        if (providerId === "Any") {
            setSelectedProviders(prevSelected => prevSelected.includes(providerId) ? [] : ["Any"]);
        } else {
            // If selecting any other provider, unselect "Any Provider"
            setSelectedProviders(prevSelected => {
                const isAnyProviderSelected = prevSelected.includes("Any");
                const newSelection = prevSelected.filter(id => id !== "Any" && id !== providerId);
                if (isAnyProviderSelected || !prevSelected.includes(providerId)) {
                    newSelection.push(providerId);
                }
                return newSelection;
            });
        }
    };



    const ServiceButton = ({ service, isSelected, categoryId, category }) => {
        const { name, description, price } = service;
        const buttonStyle = isSelected ? 'bg-gray-400 border-opacity-50 scale-105' : 'bg-gray-200 hover:bg-gray-300 border-opacity-0 hover:scale-105 hover:border-opacity-50';
        const iconStyle = isSelected ? 'bg-barberRed' : 'bg-gray-400 hover:bg-gray-500';
        const icon = isSelected ? '✓' : '+';

        return (
            <button
                className={`${buttonStyle} transition w-11/12 h-fit flex flex-row rounded mt-1 mb-1 sm:mb-2 items-center justify-between shadow-md mx-auto
                border hover:border-gray-600
                lg:py-3`}
                onClick={() => toggleService(service._id)} >
                <div className='flex flex-col w-2/3 pl-2 sm:pl-4'>
                    <div className='flex flex-row'>
                        <p className='text-left truncate lg:text-lg'><strong>{`${name}`}</strong>{` - ${price}`}</p>
                        <div
                            onClick={(e) => toggleInfo(e, service._id)}
                            className='text-xs rounded-full bg-blue-100 h-4 w-4 flex items-center justify-center self-center ml-2 text-blue-400 font-bold font-sans'>
                            i
                        </div>

                    </div>
                    <p className={`text-sm text-left ${showInfo[service._id] ? 'max-h-12' : 'max-h-0'} transition-[max-height] duration-500 ease-in-out overflow-hidden`}>{description}</p>
                </div>
                <div className='flex flex-row w-1/4 py-3 justify-around'>
                    <div className='flex self-center text-sm'>
                        <div className={`flex ${iconStyle} w-7 h-7 rounded-full items-center justify-center text-white text-[18px]`}>
                            {icon}
                        </div>
                    </div>
                </div>
            </button>
        );
    };

    const ProviderButton = ({ provider, toggleProvider, isSelected }) => {
        const { name, profilePicture } = provider;
        const buttonStyle = isSelected ? 'bg-gray-400 border-opacity-50 scale-105' :
            'bg-gray-200 hover:bg-gray-300 border-opacity-0 hover:scale-105 hover:border-opacity-50';

        //console.log(provider._id);
        //console.log(selectedProviders);
        return (
            <div
                className={`${buttonStyle} flex flex-col items-center py-2 sm:py-4 md:px-5 xl:px-6 px-4 rounded mb-2 w-full h-full place-content-around border shadow-md
                transform transition duration-150 ease-in-out hover:border-gray-600`}
                onClick={() => toggleProvider(provider._id)}>
                <h3 className='text-sm break-normal w-[60px] text-center sm:text-base'>{name}</h3>
                <div className={`${isSelected ? 'flex' : 'hidden'} absolute -right-2 -top-2 h-5 w-5 items-center justify-center
                    bg-barberRed text-white rounded-full sm:text-lg sm:w-6 sm:h-6`}>
                    ✓
                </div>
                <img src={profilePicture} alt={name} className='mt-2 rounded-full w-[60px] h-[60px] object-cover sm:w-[75px] sm:h-[75px] md:w-[80px] md:h-[80px] xl:w-[90px] xl:h-[90px]' />
            </div>
        );

    };
    const renderSelectServices = () => {
        if (isLoading) {
            return (
                <div className='w-full'>
                    <h2 className='text-2xl text-center font-bold underline mb-3
                lg:text-3xl lg:text-left lg:no-underline lg:mb-1'>
                        <Skeleton className='h-8 max-w-[200px] lg:h-[48px] lg:mb-4 animate-pulse' />
                    </h2>
                    {/* Service Select Buttons*/}
                    <div className='border w-full h-fit border-gray-300 rounded-tl-none rounded p-2 shadow-lg'>
                        <div className='mb-8'>
                            <h3 className='font-bold mb-2 self-start lg:my-4 lg:ml-1 w-full'>
                                <Skeleton className='h-full max-w-[200px] lg:h-[40px] animate-pulse' />
                            </h3>
                            <Skeleton count={2} className='h-[44px] w-[52px] lg:h-[72px] z-0 animate-pulse' />
                        </div>
                        <div >
                            <h3 className='mb-2 self-start lg:my-4 lg:ml-1 w-full'>
                                <Skeleton className='h-full max-w-[200px] lg:h-[40px] animate-pulse' />
                            </h3>
                            <Skeleton count={2} className='h-[44px] w-[52px] lg:h-[72px] z-0 animate-pulse' />
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className='w-full'>
                <h2 className='text-2xl text-center font-bold underline mb-3
                lg:text-3xl lg:text-left lg:no-underline lg:mb-1'>
                    Select Service(s)
                </h2>
                <hr className='hidden lg:flex border-black w-7/12 mb-8' />
                {/* Filter Bar with Buttons*/}
                <div className='flex gap-2 relative'>
                    <button
                        className={`rounded-t-lg p-1 sm:p-1.5 -bottom-[1px] relative ${currentFilter === "all" ? 'bg-white text-black border border-b-0 border-gray-300' :
                            'text-white bg-licorice hover:bg-gray-400 transform transition-all duration-100 ease-in-out hover:px-2'}`}
                        onClick={() => setCurrentFilter("all")}>
                        <p className='text-sm sm:text-[15px] lg:text-[16px]'>Show All</p>
                    </button>
                    {serviceCategories.map(category => (
                        <button
                            key={category._id}
                            className={`rounded-t-lg p-1 sm:p-1.5 -bottom-[1px] relative ${currentFilter === category._id ? 'bg-white text-black border border-b-0 border-gray-300' :
                                'text-white bg-licorice hover:bg-gray-400 transform transition-all duration-100 ease-in-out hover:px-2'}`}
                            onClick={() => setCurrentFilter(category._id)}>
                            <p className='text-sm sm:text-[15px] lg:text-[16px]'>{category.name}</p>
                        </button>
                    ))}
                </div>
                {/* Service Select Buttons*/}
                <div className='border w-full h-fit border-gray-300 rounded-tl-none rounded p-2 shadow-lg'>
                    {serviceCategories.map(category => (
                        <div key={category._id} className={`transition-[max-height] duration-500 ease-in-out overflow-hidden h-fit flex flex-col items-center
                        ${currentFilter === "all" || currentFilter === category._id || selectedServices.some(id => category.services.some(service => service._id === id)) ?
                                'max-h-[50em]' : 'max-h-[0em]'}`}>
                            <h3 className='text-xl lg:text-2xl font-bold mb-2 self-start lg:my-4 lg:ml-1 w-full'>
                                {category.name}
                                <hr className='hidden lg:flex border-gray-400 w-5/12' />
                            </h3>
                            {category.services.map(service => (
                                <div className={`w-full transition-[max-height] duration-500 ease-in-out overflow-hidden
                                ${(currentFilter !== "all" && currentFilter !== category._id && (selectedServices.some(id => category.services.some(service => service._id === id)) && !(selectedServices.includes(service._id)))) ?
                                        'max-h-[0em]' : 'max-h-[8em]'}`}>
                                    <ServiceButton
                                        key={service._id}
                                        service={service}
                                        isSelected={selectedServices.includes(service._id)}
                                        categoryId={category._id}
                                        category={category}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSelectProviders = () => {
        if (isLoading) {
            return (
                <div className='w-full h-fit'>
                    <h2 className='text-2xl font-bold underline text-center my-3
                    lg:text-3xl lg:text-left lg:no-underline lg:mb-1 lg:mt-6'>
                        <Skeleton className='h-8 max-w-[200px] lg:h-[48px] lg:mb-4 animate-pulse' />
                    </h2>
                    <div className='flex flex-col border border-gray-300 w-full rounded p-4 shadow-lg xl:py-6'>
                        <h3 className='text-xl font-bold underline text-center mb-4
                        lg:hidden'><Skeleton className='h-6 max-w-[200px] animate-pulse' /></h3>
                        <div className='flex flex-wrap gap-2 justify-around xl:max-w-3xl xl:mx-auto xl:gap-24'>
                            <div className='h-[120px] w-[90px] lg:h-[160px] lg:w-[120px] z-0'>
                                <Skeleton className='h-full w-full animate-pulse' />
                            </div>
                            <div className='h-[120px] w-[90px] lg:h-[160px] lg:w-[120px] z-0'>
                                <Skeleton className='h-full w-full animate-pulse' />
                            </div>
                            <div className='h-[120px] w-[90px] lg:h-[160px] lg:w-[120px] z-0'>
                                <Skeleton className='h-full w-full animate-pulse' />
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
        return (
            <div className='w-full h-fit'>
                <h2 className='text-2xl font-bold underline text-center my-3
                lg:text-3xl lg:text-left lg:no-underline lg:mb-1 lg:mt-6'>
                    Select Provider(s)</h2>
                <hr className='hidden lg:flex border-black w-7/12 mb-8' />
                <div className='flex flex-col border border-gray-300 w-full rounded p-4 shadow-lg xl:py-6'>
                    <h3 className='text-xl font-bold underline text-center mb-4
                    lg:hidden'>Provider(s)</h3>
                    <div className='flex flex-wrap gap-2 justify-around xl:max-w-3xl xl:mx-auto xl:gap-24'>
                        {providers.map(provider => (
                            <div key={provider._id} className='mb-2'>
                                <ProviderButton
                                    key={provider._id}
                                    provider={provider}
                                    toggleProvider={toggleProvider}
                                    isSelected={selectedProviders.includes(provider._id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='flex flex-col mx-auto w-5/6 md:w-[640px] lg:w-full'>
            {/* Select Services Section*/}
            {renderSelectServices()}

            {/* Select Providers Section*/}
            {renderSelectProviders()}
        </div>
    );
};

export default ServiceAndProviderForm;