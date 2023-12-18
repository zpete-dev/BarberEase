import React, { useState } from 'react';
import { serviceCategories, providers } from '../data/data';

const ServiceAndProviderForm = ({ nextStep }) => {

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);
    const [currentFilter, setCurrentFilter] = useState("all");

    const toggleService = (serviceId) => {
        setSelectedServices(prevSelected =>
            prevSelected.includes(serviceId)
                ? prevSelected.filter(id => id !== serviceId)
                : [...prevSelected, serviceId]
        );
    };

    const toggleProvider = (providerId) => {
        setSelectedProviders(prevSelected =>
            prevSelected.includes(providerId)
                ? prevSelected.filter(id => id !== providerId)
                : [...prevSelected, providerId]
        );
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
        const buttonStyle = isSelected ? 'bg-gray-400' : 'bg-gray-200';
        const iconStyle = isSelected ? 'bg-red-500' : 'bg-gray-500';
        const icon = isSelected ? '✓' : '+';
        const hideButton = (currentFilter === "all" || currentFilter === categoryId || selectedServices.includes(service._id)) ? '' : 'hidden';

        return (
            <button
                className={`${hideButton} ${buttonStyle} w-full flex flex-row p-2 rounded mb-2`}
                onClick={() => toggleService(service._id)}>
                <div className='flex flex-col w-2/3 justify-start'>
                    <p className='font-bold truncate break-words text-left hover:overflow-visible hover:whitespace-normal'>{name}</p>
                    <p className='text-sm truncate break-words text-left hover:overflow-visible hover:whitespace-normal'>{description}</p>
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
        const buttonStyle = isSelected ? 'bg-gray-400' : 'bg-gray-200';

        return (
            <div
                className={`${buttonStyle} flex flex-col p-2 rounded mb-2 w-full h-full place-content-between`}
                onClick={() => toggleProvider(provider._id)}>
                <h3 className='text-sm break-words w-[60px] text-center'>{provider.name}</h3>
                <img src={profilePicture} alt={name} className='rounded-[50px] w-[50px] h-[50px] object-cover' />
            </div>
        );
    };
    return (
        <div className='grid grid-cols-2 grid-rows-2 space-y-6 gap-2 w-full'>
            {/* Select Services Section*/}
            <div className='order-1 w-full'>
                <h2 className='text-2xl text-center font-bold underline'>Select Service(s)</h2>
                {/* Filter Bar with Buttons*/}
                <div className='flex flex-wrap rounded space-x-2 py-1 px-1 bg-licorice'>
                    <button
                        className={`rounded-full px-3 py-1 ${currentFilter === "all" ? 'bg-carrotOrange text-black' : 'text-white'}`}
                        onClick={() => setCurrentFilter("all")}>
                        <p className='text-xs'>Show All</p>
                    </button>
                    {serviceCategories.map(category => (
                        <button
                            key={category._id}
                            className={`rounded-full px-3 py-1 ${currentFilter === category._id ? 'bg-carrotOrange text-black' : 'text-white'}`}
                            onClick={() => setCurrentFilter(category._id)}>
                            <p className='text-xs'>{category.name}</p>
                        </button>
                    ))}
                </div>

                <div className='border w-full border-gray-300 rounded p-4'>
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
            <div className='order-3 w-full h-fit'>
                <h2 className='text-2xl font-bold underline text-center'>Select Provider(s)</h2>
                <div className='flex flex-col border w-full border-gray-300 rounded p-4'>
                    <h3 className='text-xl font-bold underline text-center mb-2'>Provider(s)</h3>
                    <div className='flex flex-wrap gap-2'>
                        {providers.map(provider => (
                            <div key={provider._id} className=''>
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

            {/* Summary Section*/}
            <div className='order-2 border border-gray-300 rounded p-4 row-span-2 h-fit w-full'>
                <h2 className='text-2xl text-center font-bold underline mb-2'>Summary</h2>
                <div >
                    <h3 className='text-lg font-bold mb-2'>Service(s)</h3>
                    <hr className='border-gray-400 mb-3' />
                    {selectedServices.length > 0 ? (
                        <ul>
                            {selectedServices.map(serviceId => (
                                <li key={serviceId} className="mb-2">+ {getServiceNameById(serviceId)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No services selected</p>
                    )}
                </div>

                <div >
                    <h3 className='text-lg font-bold mb-2'>Provider(s)</h3>
                    <hr className='border-gray-400 mb-3' />
                    {selectedProviders.length > 0 ? (
                        <ul>
                            {selectedProviders.map(providerId => (
                                <li key={providerId} className="mb-2">+ {getProviderNameById(providerId)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No providers selected</p>
                    )}
                </div>

                <button onClick={nextStep} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>Next</button>
            </div>
        </div>
    );
};

export default ServiceAndProviderForm;