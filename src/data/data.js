// Define service categories with their respective services
export const serviceCategories = [
    {
        _id: "0000",
        name: 'Haircut',
        categoryImage: '/images/Memphis.jpg',
        services: [
            {
                _id: "0001",
                name: 'Buzz Cut',
                price: '$20',
                description: 'Clipper cut, 1 length',
            },
            {
                _id: "0002",
                name: 'Classic Fade',
                price: '$30',
                description: 'Fade where you want + 1 length everywhere else',
            },
            {
                _id: "0003",
                name: 'Classic Haircut',
                price: '$50',
                description: 'Tell us how you want it',
            },
        ],
    },
    {
        _id: "0004",
        name: 'Beard Trim',
        categoryImage: '/images/Memphis.jpg',
        services: [
            {
                _id: "0005",
                name: 'Close Shave',
                price: '$15',
                description: 'Straight razor, hot towel, baby face',
            },
            {
                _id: "0006",
                name: 'Shape Up',
                price: '$13',
                description: 'We shape up your beard just how you like it',
            },
        ],
    },
];


export const providers = [
    {
        _id: "0007",
        name: 'Any Provider',
        profilePicture: '/images/Memphis.jpg',
        instagramLink: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJ1cmdlcnN8ZW58MHx8MHx8&auto=format&fit=crop&w=1400&q=60',
    },
    {
        _id: "0008",
        name: 'Memphis',
        profilePicture: '/images/Memphis.jpg',
        instagramLink: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJ1cmdlcnN8ZW58MHx8MHx8&auto=format&fit=crop&w=1400&q=60',
    },
    {
        _id: "0009",
        name: 'Emy',
        profilePicture: '/images/Emy.png',
        instagramLink: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJ1cmdlcnN8ZW58MHx8MHx8&auto=format&fit=crop&w=1400&q=60',
    },
];
