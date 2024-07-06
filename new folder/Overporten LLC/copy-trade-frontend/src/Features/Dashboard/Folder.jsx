import React, { useRef } from 'react';
import { useGlobalCtx } from '../../Contexts/GlobalProvider';

export default function Folder({ data }) {
    const iconRef = useRef();
    const groupRef = useRef();
    const { getMarketData } = useGlobalCtx();


    /**
     * Handles the click event on a folder element.
     * Toggles the visibility of the associated group element.
     * Updates the folder icon based on its current state.
     * @param {object} e - The click event object.
     * @returns {void} - This function does not return a value.
     */
    const handleFolderClick = (e) => {
        e.preventDefault();
        groupRef.current.classList.toggle('hidden');
        if (iconRef?.current?.classList?.contains('fa-plus-square')) {
            iconRef.current.classList.remove('fa-plus-square');
            iconRef.current.classList.add('fa-minus-square');
        }
        else {
            iconRef.current.classList.remove('fa-minus-square');
            iconRef.current.classList.add('fa-plus-square');
        }
    };

    return (
        <>
            <div onClick={(e) => handleFolderClick(e)} tabIndex={-1} className="flex max-w-max items-center gap-4 cursor-pointer focus:text-primary  focus:font-extrabold">
                <div>
                    <i ref={iconRef} className="fas fa-plus-square"></i>
                </div>
                <p onClick={() => getMarketData(data)} className="text-xs">{data.disPlayName || '---'}</p>
            </div>

            <div ref={groupRef} className="hidden pl-4">
                {
                    data?.groups ? data.groups.map((d) => <Folder data={d} key={d.disPlayName} />) : <></>
                }
            </div>
        </>
    );
};
