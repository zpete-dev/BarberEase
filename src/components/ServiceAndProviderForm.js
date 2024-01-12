import React, { useState, useEffect, useRef } from 'react';
import { serviceCategories } from '../data/data';
import { DateTime } from 'luxon';

const ServiceAndProviderForm = ({ providers, selectedServices, setSelectedServices, selectedProviders, setSelectedProviders, setSubtotal, setSelectedTime, setSelectedDate }) => {

    const [currentFilter, setCurrentFilter] = useState("all");
    const [showInfo, setShowInfo] = useState({}); // State to track which service info to show


    const servicesSectionRef = useRef(null); // Ref for the "Select Services" section
    const buttonContainerRef = useRef(null); // Ref for the services button container
    const [topDistance, setTopDistance] = useState(0); // State to store the distance

    useEffect(() => {
        const calculateDistance = () => {
            if (servicesSectionRef.current && buttonContainerRef.current) {
                const servicesSectionTop = servicesSectionRef.current.getBoundingClientRect().bottom;
                const buttonContainerTop = buttonContainerRef.current.getBoundingClientRect().top;
                setTopDistance(buttonContainerTop - servicesSectionTop);
            }
        };

        // Calculate the distance initially and on window resize
        calculateDistance();
        window.addEventListener('resize', calculateDistance);

        return () => {
            window.removeEventListener('resize', calculateDistance);
        };
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



    const ServiceButton = ({ service, isSelected, categoryId }) => {
        const { name, description, price } = service;
        const buttonStyle = isSelected ? 'bg-gray-400 border-opacity-50 scale-105' : 'bg-gray-200 hover:bg-gray-300 border-opacity-0 hover:scale-105 hover:border-opacity-50';
        const iconStyle = isSelected ? 'bg-barberRed' : 'bg-gray-400 hover:bg-gray-500';
        const icon = isSelected ? '✓' : '+';
        const hideButton = (currentFilter === "all" || currentFilter === categoryId || selectedServices.includes(service._id)) ?
            'transform transition duration-150 ease-in-out' :
            'hidden';

        return (
            <button
                className={`${hideButton} ${buttonStyle} w-11/12 h-full flex flex-row rounded mb-2 sm:mb-3 items-center justify-between shadow-md
                 border hover:border-gray-600`}
                onClick={() => toggleService(service._id)} >
                <div className='flex flex-col w-2/3 pl-2 sm:pl-4'>
                    <div className='flex flex-row'>
                        <p className='text-left truncate'><strong>{`${name}`}</strong>{` - ${price}`}</p>
                        <div
                            onClick={(e) => toggleInfo(e, service._id)}
                            className='text-xs rounded-full bg-blue-100 h-4 w-4 flex items-center justify-center self-center ml-2 text-blue-400 font-bold font-sans'>
                            i
                        </div>

                    </div>
                    <p className={`${showInfo[service._id] ? 'block' : 'hidden'} text-sm text-left`}>{description}</p>
                </div>
                <div className='flex flex-row w-1/4 py-3 justify-around'>
                    {/* <p className='flex text-base self-center'>{price}</p> */}
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
                className={`${buttonStyle} flex flex-col items-center py-2 sm:py-4 px-4 rounded mb-2 w-full h-full place-content-between border shadow-md
                transform transition duration-150 ease-in-out hover:border-gray-600`}
                onClick={() => toggleProvider(provider._id)}>
                <h3 className='text-sm break-normal w-[60px] text-center sm:text-base'>{name}</h3>
                <div className={`${isSelected ? 'flex' : 'hidden'} absolute -right-2 -top-2 h-5 w-5 items-center justify-center
                    bg-barberRed text-white rounded-full sm:text-lg sm:w-6 sm:h-6`}>
                    ✓
                </div>
                <img src={profilePicture} alt={name} className='rounded-full w-[60px] h-[60px] object-cover sm:w-[75px] sm:h-[75px]' />
            </div>
        );
    };

    return (
        <div className='flex flex-col mx-auto w-5/6 md:w-[640px] xl:w-[900px] xl:flex-row xl:justify-around'>
            {/* Select Services Section*/}
            <div className='w-full xl:w-[46%]'>
                <h2 className='text-2xl text-center font-bold underline mb-3' ref={servicesSectionRef}>Select Service(s)</h2>
                {/* Filter Bar with Buttons*/}
                <div className='flex flex-wrap rounded-[28px] justify-around py-1 px-1 bg-licorice mb-2'>
                    <button
                        className={`rounded-full p-1 sm:p-1.5 ${currentFilter === "all" ? 'bg-carrotOrange text-black' : 'text-white'}`}
                        onClick={() => setCurrentFilter("all")}>
                        <p className='text-sm sm:text-[15px]'>Show All</p>
                    </button>
                    {serviceCategories.map(category => (
                        <button
                            key={category._id}
                            className={`rounded-full p-1 sm:p-1.5 ${currentFilter === category._id ? 'bg-carrotOrange text-black' : 'text-white'}`}
                            onClick={() => setCurrentFilter(category._id)}>
                            <p className='text-sm sm:text-[15px]'>{category.name}</p>
                        </button>
                    ))}
                </div>
                {/* Service Select Buttons*/}
                <div className='border w-full h-fit border-gray-300 rounded p-2 shadow-lg' ref={buttonContainerRef}>
                    {serviceCategories.map(category => (
                        <div key={category._id} className={`h-fit flex flex-col items-center ${currentFilter === "all" || currentFilter === category._id || selectedServices.some(id => category.services.some(service => service._id === id)) ? ''
                            : 'hidden'}`}>
                            <h3 className='text-xl font-bold mb-2 self-start'>{category.name}</h3>
                            {category.services.map(service => (
                                <ServiceButton
                                    key={service._id}
                                    service={service}
                                    isSelected={selectedServices.includes(service._id)}
                                    categoryId={category._id}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Select Providers Section*/}
            <div className='w-full h-fit xl:w-[46%]'>
                <h2 className={`text-2xl font-bold underline text-center my-3 xl:my-0 xl:mb-[${topDistance}px]`}>Select Provider(s)</h2>
                <div className='flex flex-col border border-gray-300 w-full rounded p-4 shadow-lg'>
                    <h3 className='text-xl font-bold underline text-center mb-4'>Provider(s)</h3>
                    <div className='flex flex-wrap gap-2 justify-around'>
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
        </div>
    );
};

export default ServiceAndProviderForm;