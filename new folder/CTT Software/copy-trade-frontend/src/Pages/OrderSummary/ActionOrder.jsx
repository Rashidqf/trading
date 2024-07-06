import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGlobalCtx } from "../../Contexts/GlobalProvider";
import "./Actions.css";
import Loader from "../../Components/Shared/Loader/Loader";
const ammounts = [
  {
    name: "100%",
    value: 100,
  },
  {
    name: "75%",
    value: 75,
  },
  {
    name: "50%",
    value: 50,
  },
  {
    name: "25%",
    value: 25,
  },
];

export default function ActionOrder({ orderData, ordertype }) {
  const side = orderData.side === "buy" ? "sell" : "buy";
  const { handleSubmit, register, reset, setValue } = useForm();
  const { updateTrade, createOrder,closeTrade, updateOrderNew, orderToTrade } =
    useGlobalCtx();
  const modalRef = useRef();
  const [tradeType, setTradeType] = useState("trade");
  const [loading, setLoading] = useState(false); 
  const [orderType, setOrderType] = useState(side);
  const [stopLimit, setStopLimit] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    setOrderType(side);
  }, [side]);

  useEffect(() => {
    Object.keys(orderData).forEach(
      (key) => key !== "percentage" && setValue(key, orderData[key])
    );
  }, [orderData, side, setValue]);

  /**
   * Toggles the visibility of a modal element and performs additional actions.
   * - Sets the form type to 'trade'.
   * - Clears the type value.
   * @returns {void} - This function does not return a value.
   */
  const handleModal = () => {
    modalRef.current.classList.toggle("hidden");
  };

  /**
   * Submit handler for creating a new order.
   * @param {object} data - The data object containing order information.
   * @returns {void} - This function does not return a value.
   */

    const handlexit = async () => {
      try {
        setLoading(true);
        const action = await updateOrderNew(orderData.id, {
        status: "Closed",
        exit: "Exit",
        placeOrder: false,
    });
        console.log(action);
      } catch (error) {
        console.error("Error updating trade:", error);
      } finally {
        setLoading(false);
      }
    };


  const onsubmit = (data) => {
    const newOrderData = { ...orderData };
    newOrderData.percentage = Number(data.percentage);
    newOrderData.exit = "Partial Exit";
    newOrderData.placeOrder = false;
    delete newOrderData.__v;
    createOrder(newOrderData);
    handleModal();
    reset();
  };
  return (
    <>
    {loading && <Loader />}
      <div className="flex gap-5">
        <button
          disabled={orderData.status === "Closed" ? true : false}
          onClick={handlexit}
          className="font-semibold text-regular py-2 h-[2.75rem] px-7 inline-block rounded-md bg-warning  disabled:bg-grey-400"
        >
          Exit
        </button>
        <button
          disabled={orderData.status === "Closed"}
          onClick={() => {
            const newOrderData = { ...orderData };
            const data = orderToTrade(newOrderData);
            console.log(orderData.id);
            closeTrade(orderData.id);
            // window.location.reload();
          }}
          className="font-semibold text-regular py-2 px-7 inline-block rounded-md bg-green-400 disabled:bg-grey-400"
        >
          To Trade
        </button>
      </div>
      <section ref={modalRef} className="trade hidden h-max">
        <p
          onClick={() => {
            handleModal();
          }}
          className="text-4xl absolute top-4 right-8 cursor-pointer"
        >
          &#215;
        </p>
        <div>
          <h2 className="text-black font-bold text-xl text-center pb-2">
            Partial Exit
          </h2>
          {/*  */}
          <section
            className={`w-[18rem] ${
              isVisible ? "max-h-max" : "h-[15rem]"
            } border border-grey-700 rounded bg-grey`}
          >
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className="p-3">
                <div className="flex justify-center">
                  <button
                    disabled
                    onClick={(e) => {
                      e.preventDefault();
                      setTradeType("trade");
                      reset();
                    }}
                    className={`uppercase font-bold tracking-wide px-8 py-[2px] rounded ${
                      tradeType === "trade" ? "bg-primary" : "bg-black"
                    } text-regular text-lg`}
                  >
                    Trade
                  </button>
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
                <p className="text-sm tracking-normal font-medium pt-1 px-1 pb-3 border-b border-b-grey-400">
                  {orderData.marketData.MarketName}
                </p>
                <div className="pt-1 flex items-end border-b border-b-grey-400 pb-3">
                  <button
                    disabled
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderType("sell");
                    }}
                    className={`rounded-r-none rounded capitalize font-bold text-lg text-regular w-20 text-left pl-2 h-12 ${
                      orderType === "buy" ? "bg-grey-400" : "bg-warning"
                    }`}
                  >
                    Sell
                  </button>
                  <div>
                    <p className="text-xs font-extralight text-center">
                      Amount
                    </p>
                    {/* <input type="number" {...register('amount')} className="w-28 outline-none px-1 h-7 border border-grey-400" /> */}
                    {/* <input placeholder='Eg:100/75/50/25' {...register('amount')} className="w-28 outline-none px-1 h-7 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider" /> */}
                    <select
                      {...register("percentage")}
                      className="w-28 outline-none text-xs tracking-wider appearance-none text-center px-1 h-10 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider"
                    >
                      <option value="" selected disabled>
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
                      setOrderType("buy");
                    }}
                    className={`rounded-l-none rounded capitalize font-bold text-lg text-regular  w-20 text-right pr-2 h-12 ${
                      orderType === "sell" ? "bg-grey-400" : "bg-primary"
                    }`}
                  >
                    Buy
                  </button>
                </div>
                <div
                  className={`flex items-end ${
                    tradeType !== "order" && "justify-between"
                  } gap-1 px-1 mt-1`}
                >
                  {/* <div className="flex gap-2">
                    <input disabled id='heding' type="checkbox" {...register('hedging')} />
                    <label htmlFor='heding' className="text-sm font-extralight tracking-wide select-none">Hedging</label>
                  </div> */}
                  {tradeType === "order" ? (
                    <div>
                      <p className="text-xs text-center font-thin tracking-wide">
                        Order Level
                      </p>
                      <input
                        disabled
                        type="number"
                        {...register("orderLevel")}
                        className="w-28 outline-none border border-grey-400 px-1"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div>
                    {/* <button
                      disabled
                      className="border outline-none border-grey-400 rounded-sm font-thin text-xs tracking-wider px-1 py-[2px]"
                    >
                      Stop/Limit
                    </button> */}
                  </div>
                </div>
                {isVisible ? (
                  <div>
                    <div className="mt-3 border border-grey-400 p-1">
                      <div className="flex gap-3">
                        <input
                          disabled
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
                          disabled
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
                          disabled
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
                      <div className="mt-2 flex gap-5">
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
                          <p className="text-xs font-thin tracking-wide">
                            At Price
                          </p>
                          <input
                            type="number"
                            {...register("atPrice")}
                            className="outline-none border border-grey-400 px-1 w-28"
                          />
                        </div>
                      </div>
                      {stopLimit !== "trailing" ? (
                        <div className="flex mt-2">
                          <label
                            className="text-xs font-thin w-24 select-none"
                            htmlFor="guarantee"
                          >
                            Guarantee:
                          </label>
                          <input
                            disabled
                            id="guarantee"
                            type="checkbox"
                            {...register("guarantee")}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="mt-3 border border-grey-400 rouned-sm p-1">
                      <div className="flex items-center gap-3">
                        <input
                          disabled
                          id="limit"
                          type="checkbox"
                          {...register("limit")}
                        />
                        <label
                          className="text-sm font-medium tracking-wide select-none"
                          htmlFor="limit"
                        >
                          Limit
                        </label>
                      </div>
                      <div className="mt-2 flex gap-5">
                        <div>
                          <p className="text-xs font-thin tracking-wide">
                            Points Away
                          </p>
                          <input
                            disabled
                            type="number"
                            {...register("limitPointsAway")}
                            className="outline-none border border-grey-400 px-1 w-28"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-thin tracking-wide">
                            At Price
                          </p>
                          <input
                            disabled
                            type="number"
                            {...register("limitAtPrice")}
                            className="outline-none border border-grey-400 px-1 w-28"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="mt-4 pb-2 flex justify-center">
                  <input
                    type="submit"
                    value="SUBMIT"
                    className="bg-primary cursor-pointer rounded-sm font-semibold tracking-wider h-12 text-lg text-white px-3 py-1"
                  />
                </div>
              </div>
            </form>
          </section>
          {/*  */}
        </div>
      </section>
    </>
  );
}
