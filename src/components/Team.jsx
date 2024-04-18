import React from 'react'

function Team() {
    return (
        <>
            <section className="pb-20" id='team'>
                <div className="h-[15rem] bg-[#3c70aa] rounded-b-[60px] shadow-lg">
                    <div className="container px-6 py-10 mx-auto">
                        <h1 className="text-2xl font-semibold text-center text-white capitalize lg:text-3xl">The Team</h1>

                        <div className="hidden flex justify-center mx-auto mt-6">
                            <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
                            <span className="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
                            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
                        </div>

                        <p className="max-w-2xl mx-auto text-center text-gray-500">
                            
                        </p>
                    </div>
                </div>

                <div className="w-full -mt-24">
                    <div className="w-full flex justify-center items-center">
                        <div className="flex flex-col items-center p-4 border sm:p-6 rounded-xl bg-white shadow-xl mx-4">
                            <img className="shadow-lg object-cover w-20 rounded-xl aspect-square" src="https://avatars.githubusercontent.com/u/45742466?s=48&v=4" alt="Samuele Pignone" />

                                <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize">Samuele Pignone</h1>

                                <p className="mt-2 text-gray-500 capitalize"></p>

                                <div className="flex mt-3 -mx-2">
                                    <a href="https://github.com/SamuelePignone" className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-500" aria-label="Github">
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z">
                                            </path>
                                        </svg>
                                    </a>
                                </div>
                        </div>

                        <div className="flex flex-col items-center p-4 border sm:p-6 rounded-xl bg-white shadow-md mx-4">
                            <img className="shadow-lg object-cover w-20 rounded-xl aspect-square" src="https://avatars.githubusercontent.com/u/33516344?v=4" alt="Nicolò Guainazzo" />

                                <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize">Nicolò Guainazzo</h1>

                                <p className="mt-2 text-gray-500 capitalize"></p>

                                <div className="flex mt-3 -mx-2">
                                    <a href="https://github.com/Nicogs43" className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-500" aria-label="Github">
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z">
                                            </path>
                                        </svg>
                                    </a>
                                </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Team