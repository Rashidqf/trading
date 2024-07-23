import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useUtils from '../../../Utils/useUtils';
import { useGlobalCtx } from '../../../Contexts/GlobalProvider';
import Loader from '../../../Components/Shared/Loader/Loader';

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

export default function UpdateTrade({ orderData, handleModal, ordertype  }) {
  const [tradeType, setTradeType] = useState("trade");
  const [Orderside, setOrderside] = useState("");
  const [stopLimit, setStopLimit] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);  // Add loading state
  const { handleSubmit, register, reset, setValue } = useForm();
  const { hitToast } = useUtils();
  const { updateTrade, updateOrderNew } = useGlobalCtx();

  useEffect(() => {
    setTradeType(orderData.type);
    setOrderside(orderData.side);
    setIsVisible(true);
    Object.keys(orderData).forEach((key) => setValue(key, orderData[key]));
  }, [orderData.id]);

  const onsubmit = (data) => {
    const payload = {};
    console.log("loading");
    setLoading(true)
    if (stopLimit !== "") payload.stopTrailing = stopLimit;
    if (data.pointsAway !== "") payload.pointsAway = Number(data.pointsAway);
    if (data.limitPointsAway !== "")
      payload.limitPointsAway = Number(data.limitPointsAway);
    if (data.limit) payload.limit = data.limit;
    if (data.atPrice) payload.atPrice = Number(data.atPrice);
    payload.ammend = true;
    // return console.log(payload);
    // if (data.exit && data.exit === 'Partial Exit') delete data.exit;
    if (ordertype === "order") {
      updateOrderNew(orderData.id, payload)
        .then(data => {
        })
        .catch(error => {
        })
        .finally(() => {
          console.log("false");
          setLoading(false);
        });
    } else {
      updateTrade(orderData.id, payload)
        .then(data => {
        })
        .catch(error => {
        })
        .finally(() => {
          console.log("false");
          setLoading(false);
        });
    }
    // {ordertype  === "trade" ? (updateOrderNew(orderData.id, payload)) : (updateTrade(orderData.id, payload))}
    // updateOrderNew(orderData.id, payload);
    // handleModal();
  };

  const handleStopLimit = (e) => {
    e.preventDefault();
    if (Orderside === "") {
      return hitToast("Plase Select Buy or Sell first", "info");
    } else {
      setIsVisible(!isVisible);
    }
  };

  return (
    <>
    {loading && <Loader />}
    <section
      className={`w-[18rem] ${
        isVisible ? "max-h-max" : "h-[15rem]"
      } border border-grey-700 rounded bg-grey`}
    >
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="p-3">
          <div className="flex justify-center">
            {/* <button
              disabled
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
            </button> */}
            {/* <button
              disabled
              onClick={(e) => {
                e.preventDefault();
                setTradeType('order');
                reset();
              }}
              className={`uppercase font-bold tracking-wide px-8 py-[2px] rounded ${tradeType === 'order' ? 'bg-primary' : 'bg-black'} text-regular text-sm`}
            >
              Order
            </button> */}
          </div>
          {/* <p className="text-sm tracking-normal font-medium pt-1 px-1 pb-3 border-b border-b-grey-400">
            {orderData.marketData.MarketName}
          </p> */}
          <div className="pt-1 flex items-end border-b border-b-grey-400 pb-3">
            <button
              disabled
              onClick={(e) => {
                e.preventDefault();
                setOrderside("sell");
              }}
              className={`rounded-r-none rounded capitalize font-bold text-sm text-regular w-20 text-left pl-2 h-12 ${
                Orderside === "buy" ? "bg-grey-400" : "bg-warning"
              }`}
            >
              Sell
            </button>
            <div>
              <p className="text-xs font-extralight text-center">Ammount</p>
              {/* <input disabled type="number" {...register('amount')} className="w-28 outline-none px-1 h-7 border border-grey-400" /> */}
              <select
                disabled
                {...register("percentage")}
                className="w-28 outline-none text-xs tracking-wider appearance-none text-center px-1 h-12 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider"
              >
                <option value="" disabled>
                  Select Amount
                </option>
                {ammounts.map((amount) => (
                  <option key={amount.value} value={amount.value}>
                    {amount.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled
              onClick={(e) => {
                e.preventDefault();
                setOrderside("buy");
              }}
              className={`rounded-l-none rounded capitalize font-bold text-sm text-regular w-20 text-right pr-2 h-12 ${
                Orderside === "sell" ? "bg-grey-400" : "bg-primary"
              }`}
            >
              Buy
            </button>
          </div>
          <div className={`flex items-end justify-end gap-1 px-1 mt-1`}>
            {/* <div className="flex gap-2">
              <input id='heding' type="checkbox" {...register('hedging')} />
              <label htmlFor='heding' className="text-sm font-extralight tracking-wide select-none">Hedging</label>
            </div> */}
            {tradeType === "order" ? (
              <div>
                <p className="text-xs text-center font-thin tracking-wide">
                  Order Level
                </p>
                <input
                  type="number"
                  {...register("orderLevel")}
                  className="w-28 outline-none border border-grey-400 px-1"
                />
              </div>
            ) : (
              <></>
            )}
            {/* <div>
              <button
                onClick={handleStopLimit}
                className="border outline-none border-grey-400 rounded-sm font-thin text-xs tracking-wider px-1 py-[2px]"
              >
                Stop/Limit
              </button>
            </div> */}
          </div>
          {isVisible ? (
            <div>
              <div className=" border  p-1">
                {/* <div className='flex gap-3'>
                  <input id='stop/trailing' type="checkbox" {...register('stopTrailing')} />
                  <label htmlFor='stop/trailing' className="text-xs font-thin tracking-wide select-none">Stop / Trailing</label>
                </div>
                <div className="mt-1 flex gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setStopLimit('stop');
                    }}
                    className={`outline-none font-bold text-sm tracking-wider border px-1 rounded-sm border-grey-400 ${stopLimit === 'stop' && 'bg-grey-400'}`}
                  >
                    STOP
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setStopLimit('trailing');
                    }}
                    className={`outline-none font-bold text-sm tracking-wider border px-1 rounded-sm border-grey-400 ${stopLimit === 'trailing' && 'bg-grey-400'}`}
                  >
                    TRAILING
                  </button>
                </div> */}
                <div className="mt-2 flex justify-center gap-5">
                  {/* <div>
                    <p className="text-xs font-thin tracking-wide">Points Away</p>
                    <input type="number" {...register('pointsAway')} className="outline-none border border-grey-400 px-1 w-28" />
                  </div> */}
                  <div className="">
                    <p className="text-xs text-center font-thin tracking-wide">
                      At Price
                    </p>
                    <input
                      step="any"
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
                      <input id='guarantee' type="checkbox" {...register('guarantee')} />
                    </div>
                  ) : <></>
                } */}
              </div>
              {/* <div className="mt-3 border border-grey-400 rouned-sm p-1">
                <div className="flex items-center gap-3">
                  <input id='limit' type="checkbox" {...register('limit')} />
                  <label className="text-sm font-medium tracking-wide select-none" htmlFor="limit">Limit</label>
                </div>
                <div className="mt-2 flex gap-5">
                  <div>
                    <p className="text-xs font-thin tracking-wide">Points Away</p>
                    <input type="number" {...register('limitPointsAway')} className="outline-none border border-grey-400 px-1 w-28" />
                  </div>
                  <div>
                    <p className="text-xs font-thin tracking-wide">At Price</p>
                    <input type="number" {...register('limitAtPrice')} className="outline-none border border-grey-400 px-1 w-28" />
                  </div>
                </div>
              </div> */}
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-center mt-4 pb-2">
            <input
              type="submit"
              value="SUBMIT"
              className="bg-primary cursor-pointer rounded-sm font-semibold h-12 tracking-wider text-regular px-3 py-1"
            />
          </div>
        </div>
      </form>
    </section>
    </>
  );
}