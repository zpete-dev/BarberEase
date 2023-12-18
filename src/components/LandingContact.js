const LandingContact = () => {
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
                        <p className='text-xl mt-1 mb-5'>(123) 456-7890</p>
                        <h3 className='text-lg font-semibold text-[#4B4B4B]'>Address</h3>
                        <p className='text-xl mt-1 mb-5'>1234 W Main St. Denver, CO 80123</p>
                    </div>
                    {/* Right Column - Google Maps */}
                    <div>
                        <iframe
                            title='BarberDog Location'
                            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.768647708823!2d-104.93952468462147!3d39.69449897945412!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x876c7e5c3f4b43f5%3A0x11f6b6dfc8a48265!2s1150%20S%20Cherry%20St%2C%20Denver%2C%20CO%2080246%2C%20USA!5e0!3m2!1sen!2s!4v1658493710582!5m2!1sen!2s'
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

export default LandingContact;
