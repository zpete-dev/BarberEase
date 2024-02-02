// BookingFormHelper.js

import { serviceCategories } from '../data/data';

export const BookingFormHelper = (providers) => {

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

    // A function to get service price by id
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

    // A function to get provider name by id
    const getProviderNameById = (providerId) => {
        for (const provider of providers) {
            if (provider._id === providerId) {
                return provider.name;
            }
        }
        return null;
    };

    // A function to get provider name by id
    const getProviderPictureById = (providerId) => {
        for (const provider of providers) {
            if (provider._id === providerId) {
                return provider.profilePicture;
            }
        }
        return null;
    };

    // A function to get provider by id
    const getProviderById = (providerId) => {
        for (const provider of providers) {
            if (provider._id === providerId) {
                return provider;
            }
        }
        return null;
    };
    return { getServiceNameById, getServicePriceById, getProviderNameById, getProviderPictureById, getProviderById };
};
