import React, { useState, useEffect } from 'react';
import { serviceCategories } from '../data/data';

const ServiceAndProviderForm = ({ nextStep, providers, selectedServices, setSelectedServices, selectedProviders, setSelectedProviders }) => {

    const [currentFilter, setCurrentFilter] = useState("all");

    const toggleService = (serviceId) => {
        setSelectedServices(prevSelected =>
            prevSelected.includes(serviceId)
                ? prevSelected.filter(id => id !== serviceId)
                : [...prevSelected, serviceId]
        );
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

    // A function to get service name by id
    const getServiceNameById = (serviceId) => {
        for (const category of serviceCategories) {
            for (const service of category.services) {
                if (service._id === serviceId) {
                    return service.name;
                }
            }
        }
        return null;
    };

    const getServicePriceById = (serviceId) => {
        for (const category of serviceCategories) {
            for (const service of category.services) {
                if (service._id === serviceId) {
                    return service.price;
                }
            }
        }
        return null;
    };

    const getProviderNameById = (providerId) => {
        for (const provider of providers) {
            if (provider._id === providerId) {
                return provider.name;
            }
        }
        return null;
    };

    const ServiceButton = ({ service, toggleService, isSelected, categoryId }) => {
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

    // Function to parse price string and return numeric value
    const parsePrice = (priceString) => {
        return Number(priceString.replace(/[^0-9.-]+/g, ""));
    };

    // Function to calculate subtotal
    const calculateSubtotal = () => {
        return selectedServices.reduce((total, serviceId) => {
            const service = serviceCategories.flatMap(category => category.services).find(service => service._id === serviceId);
            return total + parsePrice(service?.price || '0');
        }, 0);
    };

    const subtotal = calculateSubtotal();

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
                                    toggleService={toggleService}
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

            <div className='fixed bottom-0 left-0 right-0 bg-white h-[60px] flex items-center justify-between px-1 border-t-2 border-black'>
                <div className='flex items-center'>
                    {/* Back Button */}
                    <button className='bg-licorice text-carrotOrange px-2 py-1 rounded' onClick={null}>Back</button>
                    {/* Service and Provider Count */}
                    <div className='text-sm ml-1'>
                        {/* Validation Messages */}
                        {selectedServices.length === 0 ? (
                            <p className="text-red-500">
                                {"Select 1 or more services"}
                            </p>
                        ) : <p className='text-black'>Service(s) - {selectedServices.length} Selected</p>}
                        {selectedProviders.length === 0 ? (
                            <p className="text-red-500">
                                {"Select 1 or more providers"}
                            </p>
                        ) : selectedProviders.includes("Any") ?
                            <p className='text-black'>Provider(s) - Any Provider Available</p> :
                            <p className='text-black'>Provider(s) - {selectedProviders.length} Selected</p>
                        }
                    </div>
                </div>

                <div className='flex items-center'>
                    {/* Subtotal Display */}
                    <p className='text-black font-bold mr-1'>Subtotal: ${subtotal.toFixed(2)}</p>

                    {/* Continue Button */}
                    <button
                        onClick={nextStep}
                        disabled={selectedServices.length === 0 || selectedProviders.length === 0}
                        className={`px-2 py-1 rounded text-white
                    ${selectedServices.length > 0 && selectedProviders.length > 0 ? 'bg-barberRed hover:bg-hoverRed' : 'bg-gray-500 hover:bg-gray-400 cursor-not-allowed'}`}>
                        Continue</button>
                </div>
            </div>
        </div>
    );
};

export default ServiceAndProviderForm;