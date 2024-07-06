import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useUtils from '../../../Utils/useUtils';
import { useGlobalCtx } from '../../../Contexts/GlobalProvider';
import Routing from '../../Routing/Routing';
import Loader from '../../../Components/Shared/Loader/Loader';

const intData = ['amount', 'orderLevel', 'pointsAway', 'atPrice', 'limitPointsAway', 'limitAtPrice'];

const ammounts = [
  {
    name: '100%',
    value: 100,
  },
  {
    name: '75%',
    value: 75,
  },
  {
    name: '50%',
    value: 50,
  },
  {
    name: '25%',
    value: 25,
  },
];

export default function TradeForm({
  marketData = {},
}) {
  const [tradeType, setTradeType] = useState('trade');
  const [orderType, setOrderType] = useState('');
  const [stopLimit, setStopLimit] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);  // Add loading state
  const { handleSubmit, register, reset, watch  } = useForm();
  const { hitToast } = useUtils();
  const { createOrder, createTrade } = useGlobalCtx();

  const onsubmit = (data) => {
    setLoading(true);  
    let orderLevels = watch("orderLevel");
  
    data.amount = orderLevels;
    if (!data.percentage) data.percentage = 100;
    data.side = orderType;
    data.marketData = marketData;
    
    // Remove empty, undefined, null, or zero values
    Object.keys(data).forEach((key) => {
      if (
        data[key] === "" ||
        data[key] === undefined ||
        data[key] === null ||
        data[key] === 0
      ) {
        delete data[key];
      }
    });
  
    // Convert integer fields to numbers
    Object.keys(data).forEach((key) => {
      if (intData.includes(key)) {
        data[key] = Number(data[key]);
      }
    });
  
    data.stopLimit = expanded;
    if (stopLimit !== "") data.stopTrailing = stopLimit;
  
    // Validation checks
    if (tradeType === "order" && !data.amount) {
      setLoading(false);  // Stop loading
      hitToast("Order level is required", "info");
      return;
    }    
    if (!data.percentage){
      setLoading(false);  // Stop loading
      hitToast("Amount is required", "info");
      return;
    }
    if (!data.side){
      setLoading(false);  // Stop loading
      hitToast("Side is required", "info");
      return;
    }
  
    // Determine action
    const action = tradeType === "order" ? createTrade : createOrder;
  
    // Execute action
    action(data).finally(() => setLoading(false));
    
    console.log(data);
    setExpanded(false);
    reset();
    orderLevels = null;
    setOrderType("");
    setStopLimit("");
    setIsVisible(false);
  };
  

  const toggleOrderType = (type) => {
    if (orderType === type) {
      setOrderType("");
    } else {
      setOrderType(type);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <section
        className={`w-[100%] ${
          isVisible ? "max-h-max" : "h-[100%]"
        } border border-grey-700 rounded bg-grey`}
      >
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="p-3">
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                setTradeType("trade");
                reset();
              }}
              className={`uppercase font-bold tracking-wide px-8 py-[2px] rounded ${
                tradeType === "trade" ? "bg-primary" : "bg-black"
              } text-regular text-sm`}
            >
              Trade
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setTradeType("order");
                reset();
              }}
              className={`uppercase font-bold tracking-wide px-8 py-[2px] rounded ${
                tradeType === "order" ? "bg-primary" : "bg-black"
              } text-regular text-sm`}
            >
              Order
            </button>
          </div>
          <p className="text-sm tracking-normal font-medium pt-2 px-1 pb-3 border-b text-center border-b-grey-400">
            {marketData.marketName}
          </p>
          <div className="pt-1 flex items-end border-b border-b-grey-400 pb-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setOrderType("sell");
                toggleOrderType("sell");
              }}
              className={`rounded-r-none rounded capitalize font-bold h-10 text-sm text-regular w-20 text-center   ${
                orderType === "buy" ? "bg-grey-400" : "bg-warning"
              }`}
            >
              Sell
            </button>
            <div>
              <p className="text-sm text-center tracking-wide">Amount</p>
              {/* <input placeholder='Eg:100/75/50/25' {...register('amount')} className="w-28 outline-none px-1 h-7 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider" /> */}
              <select
                {...register("percentage")}
                className="w-28 outline-none text-xs tracking-wider appearance-none text-center px-1 h-10 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider "
              >
                {/* <option value="" selected disabled>Select Amount</option> */}
                {ammounts.map((amount) => (
                  <option key={amount.value} value={amount.value}>
                    {amount.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setOrderType("buy");
                toggleOrderType("buy");
              }}
              className={`rounded-l-none rounded capitalize font-bold h-10 text-sm text-regular w-20 text-center  ${
                orderType === "sell" ? "bg-grey-400" : "bg-primary"
              }`}
            >
              Buy
            </button>
          </div>
          <div className={`flex items-end justify-center gap-1 px-1 mt-1`}>
            {/* <div className="flex gap-2">
              <input type="checkbox" {...register('hedging')} />
              <label htmlFor='heding' className="text-sm font-extralight tracking-wide select-none">Hedging</label>
            </div> */}
            {tradeType === "order" ? (
              <div>
                <p className="text-sm text-center tracking-wide">Order Level</p>
                <input
                  type="number"
                  step="any"
                  {...register("orderLevel")}
                  className="w-28 outline-none border border-grey-400 px-1 text-center"
                />
              </div>
            ) : (
              <></>
            )}
            {/* {tradeType === "order" ? (
              <div className="self-center">
                <button
                  onClick={handleStopLimit}
                  className="border outline-none border-grey-400 rounded-sm font-thin text-xs tracking-wider px-1 py-[2px]"
                >
                  Stop/Limit
                </button>
              </div>
            ) : (
              <></>
            )} */}
          </div>
          {isVisible ? (
            <div>
              <div className="mt-3 border border-grey-400 p-1">
                <div className="flex gap-3">
                  <input
                    id="stop/trailing"
                    type="checkbox"
                    {...register("stopTrailing")}
                  />
                  <label
                    htmlFor="stop/trailing"
                    className="text-xs font-thin tracking-wide select-none"
                  >
                    Stop / Trailing
                  </label>
                </div>
                <div className="mt-1 flex gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setStopLimit("stop");
                    }}
                    className={`outline-none font-bold text-sm tracking-wider border px-1 rounded-sm border-grey-400 ${
                      stopLimit === "stop" && "bg-grey-400"
                    }`}
                  >
                    STOP
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setStopLimit("trailing");
                    }}
                    className={`outline-none font-bold text-sm tracking-wider border px-1 rounded-sm border-grey-400 ${
                      stopLimit === "trailing" && "bg-grey-400"
                    }`}
                  >
                    TRAILING
                  </button>
                </div>
                <div className="mt-2 flex gap-5 pb-1">
                  <div>
                    <p className="text-xs font-thin tracking-wide">
                      Points Away
                    </p>
                    <input
                      type="number"
                      {...register("pointsAway")}
                      className="outline-none border border-grey-400 px-1 w-28"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-thin tracking-wide">At Price</p>
                    <input
                      type="number"
                      {...register("atPrice")}
                      className="outline-none border border-grey-400 px-1 w-28"
                    />
                  </div>
                </div>
                {/* {
                  stopLimit !== 'trailing' ? (
                    <div className='flex mt-2'>
                      <label className="text-xs font-thin w-24 select-none" htmlFor="guarantee">Guarantee:</label>
                      <input type="checkbox" {...register('guarantee')} />
                    </div>
                  ) : <></>
                } */}
              </div>
              {/* <div className="mt-3 border border-grey-400 rouned-sm p-1">
                <div className="flex items-center gap-3">
                  <input id='limit' disabled={stopLimit === 'trailing'} type="checkbox" {...register('limit')} />
                  <label className="text-sm font-medium tracking-wide select-none" htmlFor="limit">Limit</label>
                </div>
                <div className="mt-2 flex gap-5">
                  <div>
                    <p className="text-xs font-thin tracking-wide">Points Away</p>
                    <input disabled={stopLimit === 'trailing'} type="number" {...register('limitPointsAway')} className="outline-none border border-grey-400 px-1 w-28" />
                  </div>
                  <div>
                    <p className="text-xs font-thin tracking-wide">At Price</p>
                    <input disabled={stopLimit === 'trailing'} type="number" {...register('limitAtPrice')} className="outline-none border border-grey-400 px-1 w-28" />
                  </div>
                </div>
              </div> */}
            </div>
          ) : (
            <></>
          )}
          <div className="mt-4 pb-2 flex ">
            <input
              type="submit"
              value="SUBMIT"
              className="bg-primary h-12 cursor-pointer rounded-sm font-semibold tracking-wider text-regular px-3 py-1 mx-auto"
            />
          </div>
        </div>
      </form>
    </section>
    </>
  );
}
