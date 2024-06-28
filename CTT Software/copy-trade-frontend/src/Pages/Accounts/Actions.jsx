import React, { useEffect, useRef } from 'react';
import { useGlobalCtx } from '../../Contexts/GlobalProvider';
import UpdateAccount from '../../Components/Modal/UpdateAccount/UpdateAccount';

export default function Actions({ data, editorRef }) {
    const actionRef = useRef();
    const btnRef = useRef();
    const { removeAccount } = useGlobalCtx();

    /**
     * Toggles the visibility of a modal element.
     * @returns {void} - This function does not return a value.
     */
    const handleModal = () => {
        actionRef.current.classList.toggle('hidden');
    };

    /**
     * Click away listener that hides the action element when a click occurs outside of it.
     * @param {object} e - The click event object.
     * @returns {void} - This function does not return a value.
     */
    const clickAwayListenr = (e) => {
        if (actionRef.current && !actionRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
            actionRef.current.classList.add('hidden');
        }
    };

    useEffect(() => {
        document.addEventListener('click', clickAwayListenr);
        return () => {
            document.removeEventListener('click', clickAwayListenr);
        };
    }, []);

    return (
        <div className="relative">
            <div ref={btnRef} className="select-none" onClick={handleModal}>
                <p>&#8230;</p>
            </div>
            <div ref={actionRef} className="hidden shadow-md bg-regular absolute w-max p-3 rounded-md z-50 -left-16">
                {/* <button
                    onClick={() => {
                        updateAccount(data.id, { accountType: 'Primary' });
                        handleModal();
                    }}
                    disabled={data.accountType === 'Primary' ? true : false}
                    className="p-2 hover:bg-secondary disabled:bg-grey disabled:cursor-not-allowed rounded-md block disabled:text-grey-400 mb-1"
                >
                    Set As Primary
                </button>
                <button
                    onClick={() => {
                        updateAccount(data.id, { accountType: 'Secondary' });
                        handleModal();
                    }}
                    disabled={data.accountType === 'Secondary' ? true : false}
                    className="p-2 hover:bg-secondary rounded-md block disabled:bg-grey disabled:cursor-not-allowed disabled:text-grey-400 mb-1"
                >
                    Set As Secondary
                </button> */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // handleModal();
                    }}
                >
                    <div className="relative">
                        <div>
                            <UpdateAccount id={data.id} />
                        </div>
                    </div>
                </button>
                {/* <button
                    onClick={() => {
                        handleEditPercentage(editorRef);
                    }}
                    className="p-2 hover:bg-secondary rounded-md block mb-1"
                >
                    Edit Percentage
                </button> */}
                <button
                    onClick={() => {
                        removeAccount(data.id);
                        handleModal();
                    }}
                    disabled={data.accountType === 'Primary' ? true : false}
                    className="p-2 hover:bg-secondary rounded-md block mb-1"
                >
                    Remove Account
                </button>
            </div>
        </div>
    );
};

