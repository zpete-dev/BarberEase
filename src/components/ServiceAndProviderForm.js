import React, { useState } from 'react';
import { serviceCategories } from '../data/data';

const ServiceAndProviderForm = ({ providers, selectedServices, setSelectedServices, selectedProviders, setSelectedProviders, setSubtotal }) => {

    const [currentFilter, setCurrentFilter] = useState("all");

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

    // Function to parse price string and return numeric value
    const parsePrice = (priceString) => {
        return Number(priceString.replace(/[^0-9.-]+/g, ""));
    };

    const toggleProvider = (providerId) => {
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
        const buttonStyle = isSelected ? 'bg-gray-400' : 'bg-gray-200 hover:bg-gray-300';
        const iconStyle = isSelected ? 'bg-barberRed' : 'bg-gray-500';
        const icon = isSelected ? '✓' : '+';
        const hideButton = (currentFilter === "all" || currentFilter === categoryId || selectedServices.includes(service._id)) ? '' : 'hidden';

        return (
            <button
                className={`${hideButton} ${buttonStyle} w-full flex flex-row p-2 rounded mb-2`}
                onClick={() => toggleService(service._id)}>
                <div className='flex flex-col w-2/3 justify-start '>
                    <p className='font-bold text-left truncate hover:overflow-visible hover:whitespace-normal'>{name}</p>
                    <p className='text-sm text-left truncate hover:overflow-visible hover:whitespace-normal'>{description}</p>
                </div>
                <div className='flex flex-col w-1/3'>
                    <p className='flex text-base self-center'>{price}</p>
                    <div className='flex self-center text-sm'>
                        <div className={`flex ${iconStyle} w-5 h-5 rounded-full justify-center text-white`}>
                            {icon}
                        </div>
                    </div>
                </div>
            </button>
        );
    };

    const ProviderButton = ({ provider, toggleProvider, isSelected }) => {
        const { name, profilePicture } = provider;
        const buttonStyle = isSelected ? 'bg-gray-400' : 'bg-gray-200 hover:bg-gray-300';

        return (
            <div
                className={`${buttonStyle} flex flex-col items-center p-2 rounded mb-2 w-full h-full place-content-between border-2 border-opacity-0 hover:border-opacity-100 hover:border-gray-800`}
                onClick={() => toggleProvider(provider._id)}>
                <h3 className='text-sm break-words w-[60px] text-center'>{provider.name}</h3>
                <img src={profilePicture} alt={name} className='rounded-[50px] w-[50px] h-[50px] object-cover' />
            </div>
        );
    };

    return (
        <div className='flex flex-col w-full'>
            {/* Select Services Section*/}
            <div className='w-full'>
                <h2 className='text-2xl text-center font-bold underline mb-3'>Select Service(s)</h2>
                {/* Filter Bar with Buttons*/}
                <div className='flex flex-wrap rounded-[28px] justify-around py-1 px-1 bg-licorice mb-2'>
                    <button
                        className={`rounded-full px-1 py-1 ${currentFilter === "all" ? 'bg-carrotOrange text-black' : 'text-white'}`}
                        onClick={() => setCurrentFilter("all")}>
                        <p className='text-xs'>Show All</p>
                    </button>
                    {serviceCategories.map(category => (
                        <button
                            key={category._id}
                            className={`rounded-full px-1 py-1 ${currentFilter === category._id ? 'bg-carrotOrange text-black' : 'text-white'}`}
                            onClick={() => setCurrentFilter(category._id)}>
                            <p className='text-xs'>{category.name}</p>
                        </button>
                    ))}
                </div>
                {/* Service Select Buttons*/}
                <div className='border w-full border-gray-300 rounded p-2'>
                    {serviceCategories.map(category => (
                        <div key={category._id} className={`${currentFilter === "all" || currentFilter === category._id || selectedServices.some(id => category.services.some(service => service._id === id)) ? '' : 'hidden'}`}>
                            <h3 className='text-lg font-bold'>{category.name}</h3>
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
            <div className='w-full h-fit'>
                <h2 className='text-2xl font-bold underline text-center mb-3'>Select Provider(s)</h2>
                <div className='flex flex-col border w-full border-gray-300 rounded p-4'>
                    <h3 className='text-xl font-bold underline text-center mb-2'>Provider(s)</h3>
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