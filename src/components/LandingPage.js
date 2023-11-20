import React from 'react';

const LandingPage = () => {
    return (
        <div className='max-w-[1240px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6'>
            {<button className="bg-blue-500 text-white py-2 px-4 rounded">Click me</button>}
            {<button className="btn-red">Click me 2</button>}
        </div>
    );
};

export default LandingPage;
