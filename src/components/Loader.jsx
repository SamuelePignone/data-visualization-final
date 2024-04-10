import React from 'react'
import { Rings } from 'react-loader-spinner';
import { colorScheme } from './Config';

function Loader() {
    return (
        <div className='w-screen h-[500px] flex justify-center items-center'>
            <Rings
                visible={true}
                height="80"
                width="80"
                color={colorScheme[0]}
                ariaLabel="rings-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}

export default Loader