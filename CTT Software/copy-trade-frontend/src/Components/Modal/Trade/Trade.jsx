import React, { useRef, useState } from 'react';
import './Trade.css';
import { useForm } from 'react-hook-form';
import useUtils from '../../../Utils/useUtils';
import { useGlobalCtx } from '../../../Contexts/GlobalProvider';

const intData = ['amount', 'orderLevel', 'pointsAway', 'atPrice', 'limitPointsAway', 'limitAtPrice'];

export default function Trade({ marketData }) {
    const modalRef = useRef();
    const tradeRef = useRef();
    const [type, setType] = useState('');
    const [formType, setFormType] = useState('trade');
    const [tradeType, setTradeType] = useState('');
    const [orderType, setOrderType] = useState('');
    const { handleSubmit, register, reset } = useForm();
    const { hitToast } = useUtils();
    const { createOrder } = useGlobalCtx();

    /**
     * Toggles the visibility of a modal element and performs additional actions.
     * - Sets the form type to 'trade'.
     * - Resets the form.
     * - Clears the type value.
     * @returns {void} - This function does not return a value.
     */
    const handleModal = () => {
        modalRef.current.classList.toggle('hidden');
        setFormType('trade');
        setType('');
        reset();
    };


    /**
     * Handles the selection of an order type.
     * Prevents the default form submission behavior.
     * Sets the order type based on the provided data.
     * @param {Object} e - The event object.
     * @param {string} data - The order type to be set.
     * @returns {void} - This function does not return a value.
     */
    const handleOrdertype = (e, data) => {
        e.preventDefault();
        setOrderType(data);
    };


    /**
     * Handles the selection of a form type.
     * Prevents the default form submission behavior.
     * Sets the form type based on the provided type.
     * Clears the type value and resets the form.
     * @param {Object} e - The event object.
     * @param {string} type - The form type to be set.
     * @returns {void} - This function does not return a value.
     */
    const handleFormType = (e, type) => {
        e.preventDefault();
        setFormType(type);
        setType('');
        reset();
    };

    /**
    * Toggles the visibility of a modal element.
    * @returns {void} - This function does not return a value.
    */
    const handleTradeform = () => {
        tradeRef.current.classList.toggle('hidden');
    };


    /**
     * Handles the selection of a trade type.
     * If the current trade type is empty, sets the trade type based on the provided data.
     * If the current trade type is not empty, clears the trade type.
     * @param {string} data - The trade type to be set or cleared.
     * @returns {void} - This function does not return a value.
     */
    const handleTradeType = (data) => {
        if (tradeType === '') {
            setTradeType(data);
        } else {
            setTradeType('');
        }
    };


    /**
     * Handles the submission of a limit order form.
     * Prevents the default form submission behavior.
     * Checks if a trade type is selected. If not, displays an informational toast message.
     * If a trade type is selected, sets the trade type to 'StopLimit' and handles the trade form.
     * @param {Object} e - The event object.
     * @returns {void} - This function does not return a value.
     */
    const handleLimitOrder = (e) => {
        e.preventDefault();
        if (type === '') return hitToast('Please Select Buy or Sell', 'info');
        if (type !== '') {
            handleTradeType('StopLimit');
            handleTradeform();
        }
    };


    /**
     * Handles the submission of a form for creating an order.
     * Modifies the data object with additional properties.
     * Checks if the required fields (amount and side) are provided. If not, displays an informational toast message.
     * Calls the createOrder function with the modified data.
     * Handles the modal, resets form and state values.
     * @param {Object} data - The data object containing the form inputs.
     * @returns {void} - This function does not return a value.
     */
    const onsubmit = (data) => {
        data.side = type;
        data.type = formType;
        data.limit = data.limit ? data.limit : false;
        data.marketData = marketData;
        data.stopTrailing = orderType;
        if (data.stopTrailing === '') delete data.stopTrailing;
        if (tradeType !== '') data.stopLimit = true;
        Object.keys(data).forEach((key) => {
            if (intData.includes(key)) {
                data[key] = Number(data[key]);
            }
        });
        if (!data.amount || !data.side) return hitToast('Amount and Side is required', 'info');
        // return console.log(data);
        createOrder(data);
        handleModal();
        reset();
        setType('');
        setFormType('trade');
        setTradeType('');
        setOrderType('');
    };
    return (
        <>
            {/* <div className="flex gap-5">
                <button onClick={handleModal} className="font-semibold text-regular py-1 px-10 inline-block rounded-md bg-primary">Trade</button>
                <button onClick={handleModal} className="font-semibold text-regular py-1 px-10 inline-block rounded-md bg-black">Order</button>
            </div> */}
            <section ref={modalRef} className="trade h-max">
                <div className="w-[33rem]">
                    {/* heading */}
                    <h2 className="text-black font-bold text-xl text-center pb-2">Create a new Trade</h2>
                    <hr />

                    {/* form switching  */}
                    <div className="flex justify-center w-[35rem] my-3 gap-28">
                        <div>
                            <button onClick={(e) => handleFormType(e, 'trade')} className={`font-semibold text-regular py-1 px-14 rounded-md ${formType === 'trade' ? 'bg-primary' : 'bg-black'}`}>Trade</button>
                        </div>
                        <div>
                            <button onClick={(e) => handleFormType(e, 'order')} className={`font-semibold text-regular py-1 px-14 rounded-md ${formType === 'order' ? 'bg-primary' : 'bg-black'}`}>Order</button>
                        </div>
                    </div>
                    {/* form  */}
                    <div className="flex justify-center pl-4">
                        <form onSubmit={handleSubmit(onsubmit)} className="w-[28rem]">
                            <div className="flex justify-center items-center mt-3">
                                {/* buy button */}
                                <div className="pt-4 cursor-pointer"><button onClick={(e) => {
                                    e.preventDefault();
                                    setType('buy')
                                }} className={`px-4 py-3 ${type === 'sell' ? 'bg-grey text-grey-400' : 'text-regular bg-warning'}`}>Buy</button></div>
                                {/* ammount input */}
                                <div>
                                    <label htmlFor="amount" className="text-xs block text-center">Amount</label>
                                    <input type="number" {...register('amount')} className="block border border-grey-400 focus:outline-none focus:border-grey-400 pl-1 h-12" />
                                </div>
                                {/* sell button */}
                                <div className="pt-4 cursor-pointer"><button onClick={(e) => {
                                    e.preventDefault();
                                    setType('sell');
                                }} className={`px-4 py-3 ${type === 'buy' ? 'bg-grey text-grey-400' : 'text-regular bg-primary'}`}>Sell</button></div>
                            </div>
                            {/* horizontal line */}
                            <div className="flex justify-center">
                                <p className="py-2 border-b border-b-grey-400 w-96" />
                            </div>
                            <div className="mt-5 flex justify-evenly gap-5 items-center">
                                {/* select for hedging */}
                                <div className="flex gap-3 items-center pt-3">
                                    <input {...register('hedging')} id='hedging' className="block" type="checkbox" />
                                    <label className="block select-none" htmlFor="hedging">Hedging</label>
                                </div>
                                {/* order level */}
                                {
                                    formType === 'order' ? <div>
                                        <div>
                                            <label htmlFor="amount" className="text-xs block text-center">Order Level</label>
                                            <input type="number" {...register('orderLevel')} className="block border border-grey-400 focus:outline-none focus:border-grey-400 w-24" />
                                        </div>
                                    </div> : <></>
                                }
                                {/* trade type select button */}
                                <div className="pt-3">
                                    <button onClick={handleLimitOrder} className="text-sm bg-grey px-3 rounded-md border border-grey-400"><span className={`text-sm ${tradeType === '' ? 'hidden' : 'inline-block'}`}>&#171;</span> Stop / Limit <span className={`text-sm ${tradeType !== '' ? 'hidden' : 'inline-block'}`}>&raquo;</span></button>
                                </div>
                            </div>
                            {/* stopt and trailing section */}
                            {
                                type !== '' ? <div ref={tradeRef} className="hidden">
                                    <div className="flex justify-center">
                                        <div className="border border-grey-400 mt-5 w-[24rem] py-2">
                                            {/* stop /limit selection checkbox */}
                                            <div className="flex gap-3 items-center pl-[2.3rem]">
                                                <input checked={orderType ? true : false} type="checkbox" {...register('stopTrailing')} id="stoplimit" className="block" />
                                                <label htmlFor="stoplimit" className="block text-sm select-none">Stop / Trailing</label>
                                            </div>
                                            {/* stop trail selection buttion */}
                                            <div className="mt-4 flex gap-3 pl-[2.3rem]">
                                                <div>
                                                    <button onClick={(e) => handleOrdertype(e, 'stop')} className="uppercase text-xs px-2 border-grey-400 border focus:bg-grey-400 font-semibold">Stop</button>
                                                </div>
                                                <div>
                                                    <button onClick={(e) => handleOrdertype(e, 'trailing')} className="uppercase text-xs px-2 border-grey-400 border focus:bg-grey-400 font-semibold">Trailing</button>
                                                </div>
                                            </div>
                                            {/* input for stop order */}
                                            <div>
                                                <div className="flex gap-4 pl-[2.3rem] mt-3">
                                                    <div>
                                                        <label htmlFor="" className="text-xs block">Points Away</label>
                                                        <input onFocus={() => setOrderType('stop')} type="number" {...register('pointsAway')} className="border border-grey-400 focus:outline-none focus:border-grey-400 w-36" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="" className="text-xs block">At Price</label>
                                                        <input onFocus={() => setOrderType('stop')} type="number" {...register('atPrice')} className="border border-grey-400 focus:outline-none focus:border-grey-400 w-36" />
                                                    </div>
                                                </div>
                                                {/* checkbox for guarantee selection */}
                                                {
                                                    orderType === 'stop' ? <div className='flex gap-28 pl-[2.3rem] mt-2'>
                                                        <label htmlFor="" className="block text-xs">Guarantee :</label>
                                                        <input {...register('guarantee')} type="checkbox" className="block" />
                                                    </div> : <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="border border-grey-400 mt-5 w-[24rem] py-2 pb-3">
                                            {/* stop /limit selection checkbox */}
                                            <div className="flex gap-3 items-center pl-[2.3rem]">
                                                <input type="checkbox" {...register('limit')} id="stoplimit" className="block" disabled={orderType === 'trailing' ? true : false} />
                                                <label htmlFor="stoplimit" className="block text-sm select-none">Limit</label>
                                            </div>
                                            {/* input for stop order */}
                                            <div>
                                                <div className="flex gap-4 pl-[2.3rem] mt-3">
                                                    <div>
                                                        <label htmlFor="" className="text-xs block">Points Away</label>
                                                        <input {...register('limitPointsAway')} type="number" className="border border-grey-400 focus:outline-none focus:border-grey-400 w-36" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="" className="text-xs block">At Price</label>
                                                        <input {...register('limitAtPrice')} type="number" className="border border-grey-400 focus:outline-none focus:border-grey-400 w-36" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <></>
                            }
                            <div className="mt-3 pl-6">
                                <input type="submit" value='SUBMIT' className="cursor-pointer px-8 bg-primary py-3 text-regular rounded-3xl" />
                            </div>
                        </form>
                    </div>
                </div>
            </section >
        </>
    );
};
