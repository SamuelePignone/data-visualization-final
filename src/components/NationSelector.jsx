import React, { useState } from 'react'
import { FaCaretDown, FaXmark } from "react-icons/fa6";
import { mapstate } from './MapState';

function NationSelector({ nationsList, currentNation, setCurrentNation }) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="relative inline-block text-left z-[9999999]">
                <div>
                    <button type="button" className=" border border-gray-300 bg-white shadow-sm flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500" onClick={() => setIsOpen(!isOpen)}>
                        <span className='mr-2'>{mapstate(currentNation)}</span>
                        {
                            isOpen ? <FaXmark /> : <FaCaretDown />
                        }
                    </button>
                </div>
                {
                    isOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 h-[200px] overflow-y-scroll w-fit mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                                {
                                    nationsList.map((nation, index) => (
                                        <div key={index} className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                            onClick={() => {
                                                setCurrentNation(nation)
                                                setIsOpen(false)
                                            }}>
                                            <span className="flex flex-col">
                                                <span>
                                                    {mapstate(nation)}
                                                </span>
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default NationSelector