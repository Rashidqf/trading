import React, { useEffect, useRef } from 'react';
import Input from '../../Shared/Input/Input';
import { useForm } from 'react-hook-form';
import { useGlobalCtx } from '../../../Contexts/GlobalProvider';
import './UpdateAccount.css';
import { shallowEqual, useSelector } from 'react-redux';

export default function UpdateAccount({ id }) {
    const account = useSelector((state) => state.acountStore.accounts.find((a) => a.id === id), shallowEqual) || {};
    const { register, reset, handleSubmit, setValue } = useForm();
    const modalRef = useRef();
    const { updateAccount } = useGlobalCtx();

    /**
     * Toggles the visibility of a modal element.
     * @returns {void} - This function does not return a value.
     */
    const handleModal = () => {
        modalRef.current.classList.toggle('hidden');
    };

    useEffect(() => {
        Object.keys(account).forEach((key) => setValue(key, account[key]));
    }, [id]);


    /**
     * Handles the submission of account data.
     * Calls the addAccount function, resets the form, and handles the modal.
     * @param {Object} data - The account data to be submitted.
     * @returns {void} - This function does not return a value.
     */
    const onsubmit = (data) => {
        delete data.id;
        updateAccount(account.id, data);
        handleModal();
    };

    return (
        <>
            <h1 onClick={handleModal} className="p-2 hover:bg-secondary rounded-md block mb-1">Edit Account</h1>
            <section ref={modalRef} className='top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 fixed hidden drop-shadow-lg bg-regular p-5 rounded-md'>
                <p onClick={handleModal} className="text-4xl absolute top-4 right-8 cursor-pointer">&#215;</p>
                <div className="w-[33rem]">
                    <h2 className="text-black font-bold text-xl text-center py-4">Update Account</h2>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <div>
                            <Input register={{ ...register('email') }} requiredt={true} label='Email' type='email' />
                        </div>
                        <div>
                            <Input register={{ ...register('password') }} requiredt={true} label='Password' type='password' />
                        </div>
                        <div>
                            <Input register={{ ...register('accountId') }} requiredt={true} label='Account Id' type='text' />
                        </div>
                        <div>
                            {/* <Input register={{ ...register('percentage') }} requiredt={true} label='Percentage' type='number' /> */}
                        </div>
                        <div className="text-right py-5">
                            <input type="submit" value="Update Account" className="cursor-pointer px-8 bg-primary py-3 text-regular rounded-3xl" />
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}