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
export default function ActionMultiple({ orderDataList, ordertype }) {
  const side = orderDataList[0]?.childrens[0]?.side === "buy" ? "sell" : "buy";
  // const side = "buy";
  const { handleSubmit, register, reset, setValue } = useForm();
  const {
    updateTrade,
    closeMultiple,
    createOrder,
    updateOrderNew,
    updateOrderAmmend,
    createOrderPartialExit,
  } = useGlobalCtx();
  const modalRef = useRef();
  const [tradeType, setTradeType] = useState("trade");
  const [orderTypes, setOrderTypes] = useState(side);
  const [stopLimit, setStopLimit] = useState("");
  const [loading, setLoading] = useState(false);  // Add loading state
  const [isVisible, setIsVisible] = useState(false);

  const calculateSumOfAmounts = () => {
    const sumOfAmounts = {};
    const ids = {}; // Initialize ids object outside the loop

    orderDataList?.forEach((orderData) => {
      orderData?.childrens?.forEach((child) => {
        const childId = child?.account?.id || child?.account || "Unknown";
        sumOfAmounts[childId] = (sumOfAmounts[childId] || 0) + child.ammount;
        ids[child.id] = true; // Store child IDs in the ids object
      });
    });

    // Add the provided data
    const additionalData = {
      // status: "MultipleExit",
      exit: "MultipleExit",
      check: "exitMultiple",
      placeOrder: false,
      ammend: false,
    };

    // Convert ids object keys into an array if needed
    const idsArray = Object.keys(ids);

    return { sumOfAmounts, idsArray, ...additionalData }; // Return both sumOfAmounts, idsArray, and additionalData as an object
  };
  const reformattedData = {};

  // Iterate through the original data
  orderDataList?.forEach((parent) => {
    if (parent.childrens && Array.isArray(parent.childrens)) {
      // Iterate through the children of each parent
      parent.childrens.forEach((child) => {
        // Check if child has necessary properties
        if (child && child.id && child.tradeId && child.account) {
          // Extract necessary information
          let accountId;
          if (typeof child.account === "string") {
            accountId = child.account; // If account is a string, use it directly
          } else if (typeof child.account === "object" && child.account.id) {
            accountId = child.account.id; // If account is an object, extract accountId
          } else {
            // Handle unexpected account format
            console.error("Unexpected account format:", child.account);
            return; // Skip this child
          }

          const { id, tradeId } = child;

          // Check if the account already exists in the reformatted data
          if (!reformattedData.hasOwnProperty(accountId)) {
            // If not, initialize it with empty arrays for ids and tradeIds
            reformattedData[accountId] = {
              ids: [],
              tradeIds: [],
            };
          }

          // Push the extracted id and tradeId to the corresponding arrays
          reformattedData[accountId].ids.push(id);
          reformattedData[accountId].tradeIds.push(tradeId);
        }
      });
    }
  });

  const orderIds = [];
  const accountIds = [];
  const tradeId = [];

  orderDataList.forEach((order) => {
    order.childrens.forEach((childOrder) => {
      orderIds.push(childOrder.id);
      accountIds.push(childOrder.account);
      tradeId.push(childOrder.tradeId);
    });
  });
  // console.log("reformattedData",reformattedData);

  const sumOfAmounts = calculateSumOfAmounts();

  const payload = {};
  payload.exit = "MultipleExit";
  payload.reformattedData = reformattedData;
  payload.orderIds = orderIds;
  payload.tradeIdArray = tradeId;
  payload.accountIds = accountIds;
  payload.ammend = false;

  // useEffect(() => {
  //   const sumOfAmounts = calculateSumOfAmounts();
  //   console.log("Sum of amounts:", sumOfAmounts);
  // }, [orderDataList]);

  useLayoutEffect(() => {
    setOrderTypes(side);
  }, []);
  useEffect(() => {
    orderDataList.forEach((orderData) => {
      Object.keys(orderData).forEach(
        (key) => key !== "percentage" && setValue(key, orderData[key])
      );
    });
  }, [orderDataList]);

  const handleModal = () => {
    modalRef.current.classList.toggle("hidden");
  };

const onSubmit = async (data) => {
  setLoading(true);  
  let loopExecuted = false;

  for (const parentOrder of orderDataList) {
    if (loopExecuted) break; // Exit if already executed

    if (parentOrder.childrens.length > 0) {
      const childOrder = parentOrder.childrens[0];
      const updatedChildOrder = {
        ...childOrder,
        reformattedData: reformattedData,
        percentage: Number(data.percentage),
        exit: "Partial Exit",
        placeOrder: false,
      };
      delete updatedChildOrder.__v;

      try {
        const actionFunction = await createOrderPartialExit(updatedChildOrder); 
        if (typeof actionFunction === "function") {
          await actionFunction(data);
        }
      } catch (error) {
        console.error("Error creating order:", error);
      } finally {
        setLoading(false);
      }
      
      loopExecuted = true;
    }
  }
};

  
  
  
  

  const exitAllOrders = async () => {
    if (ordertype === "order") {
      try {
        setLoading(true); 
        const action = await updateOrderAmmend(payload); 
        console.log("Action executed successfully:", action);
      } catch (error) {
        console.error("Error executing action:", error);
      } finally {
        setLoading(false); 
      }
    } else {
      closeMultiple(sumOfAmounts);
    }
  };
  

  return (
    <>
    {loading && <Loader />}
      <div className={`flex ${ordertype === "order" ? "gap-1" : "gap-3"}`}>
        <button
          disabled={orderDataList.some(
            (orderData) => orderData.status === "Closed"
          )}
          onClick={exitAllOrders}
          className="font-semibold text-regular py-2 px-7 inline-block rounded-md bg-warning disabled:bg-grey-400"
        >
          Exit
        </button>
        <button
          disabled={orderDataList.some(
            (orderData) => orderData.status === "Closed"
          )}
          onClick={handleModal}
          style={{ visibility: ordertype === "order" ? "hidden" : "none" }}
          className="font-semibold text-regular py-2 px-7 inline-block rounded-md bg-black disabled:bg-grey-400"
        >
          Partial Exit
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
          <section className="w-[18rem] border border-grey-700 rounded bg-grey">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                </div>
                <p className="text-sm tracking-normal font-medium pt-1 px-1 pb-3 border-b border-b-grey-400"></p>
                <div className="pt-1 flex items-end border-b border-b-grey-400 pb-3">
                  <button
                    disabled
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderTypes("sell");
                    }}
                    className={`rounded-r-none rounded capitalize font-bold text-lg text-regular w-20 text-left pl-2 h-12 ${
                      orderTypes === "buy" ? "bg-grey-400" : "bg-warning"
                    }`}
                  >
                    Sell
                  </button>
                  <div>
                    <p className="text-xs font-extralight text-center">
                      Amount
                    </p>
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
                      setOrderTypes("buy");
                    }}
                    className={`rounded-l-none rounded capitalize font-bold text-lg text-regular  w-20 text-right pr-2 h-12 ${
                      orderTypes === "sell" ? "bg-grey-400" : "bg-primary"
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
                  <div></div>
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="uppercase font-bold tracking-wide px-8 py-[2px] rounded bg-warning text-regular text-lg"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </section>
    </>
  );
}
