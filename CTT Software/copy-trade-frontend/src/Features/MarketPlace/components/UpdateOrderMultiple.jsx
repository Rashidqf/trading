import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useUtils from "../../../Utils/useUtils";
import { useGlobalCtx } from "../../../Contexts/GlobalProvider";
import Loader from "../../../Components/Shared/Loader/Loader";

const amounts = [
  { name: "100%", value: 100 },
  { name: "75%", value: 75 },
  { name: "50%", value: 50 },
  { name: "25%", value: 25 },
];

export default function UpdateTradeMultiple({
  orderData,
  handleModal,
  orderDataLists,
}) {
  const [ordertype, setOrdertype] = useState(""); // Initialize with a default value
  const [isVisible, setIsVisible] = useState(false);
  const [atPrice, setAtPrice] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const { handleSubmit, register, setValue } = useForm();
  const { hitToast } = useUtils();
  const {
    updateTrade,
    updateOrderNew,
    updateTradeAmmend,
    updateTradeMultiples,
    updateOrderAmmend,
  } = useGlobalCtx();
  useEffect(() => {
    setOrdertype(orderData[0]?.ordertype);
  }, [orderData]);

  const reformattedData = {};

  orderDataLists?.forEach((parent) => {
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

  // Output the reformatted data
  // console.log(reformattedData);

  useEffect(() => {
    setIsVisible(true);
    orderData.forEach((order, index) => {
      Object.keys(order).forEach((key) =>
        setValue(`${index}-${key}`, order[key])
      );
    });
  }, [orderData]);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("object");
    const orderIds = [];
    const accountIds = [];
    const tradeId = [];

    orderDataLists.forEach((order) => {
      order.childrens.forEach((childOrder) => {
        orderIds.push(childOrder.id);
        accountIds.push(childOrder.account);
        tradeId.push(childOrder.tradeId);
      });
    });

    // console.log(reformattedData);

    const payload = {};
    payload.reformattedData = reformattedData;
    payload.orderIds = orderIds;
    payload.tradeIdArray = tradeId;
    payload.accountIds = accountIds;
    if (atPrice !== "") payload.atPrice = Number(atPrice);
    if (data.pointsAway !== "") payload.pointsAway = Number(data.pointsAway);
    if (data.limitPointsAway !== "")
      payload.limitPointsAway = Number(data.limitPointsAway);
    if (data.limit) payload.limit = data.limit;
    payload.ammend = true;

    const orderId = orderData[0]?.id;
    if (ordertype === "order") {
      try {
        const actionFunction = await updateOrderAmmend(payload);
        console.log("{loading && <Loader />}");
      } catch (error) {
        console.log(error);
        setLoading(false);
        console.error("Error creating order:", error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const actionFunction = await updateTradeAmmend(payload);
        console.log("{loading && <Loader />}");
      } catch (error) {
        console.log(error);
        setLoading(false);
        console.error("Error creating order:", error);
      } finally {
        setLoading(false);
      }
    }

    handleModal();
  };

  return (
    <>
      {loading && <Loader />}
      <section
        className={`w-[18rem] ${
          isVisible ? "max-h-max" : "h-[15rem]"
        } border border-grey-700 rounded bg-grey`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-3">
            {orderData.slice(0, 1).map((order, index) => (
              <div key={index}>
                <input
                  type="hidden"
                  {...register(`${index}-id`)}
                  value={order?.id}
                />
                <div className="pt-1 flex items-end border-b border-b-grey-400 pb-3">
                  <button
                    disabled
                    onClick={(e) => {
                      e.preventDefault();
                      setValue(`${index}-orderType`, "sell");
                    }}
                    className={`rounded-r-none rounded capitalize font-bold text-sm h-10 text-regular w-20 text-left pl-2 ${
                      order?.side === "buy" ? "bg-grey-400" : "bg-warning"
                    }`}
                  >
                    Sell
                  </button>
                  <div>
                    <p className="text-xs font-extralight text-center">
                      Amount
                    </p>
                    <select
                      disabled
                      {...register(`${index}-percentage`)}
                      className="w-28 outline-none text-xs tracking-wider appearance-none text-center px-1 h-10 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider"
                    >
                      <option value="" disabled>
                        Select Amount
                      </option>
                      {amounts.map((amount) => (
                        <option key={amount.value} value={amount.value}>
                          100
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled
                    onClick={(e) => {
                      e.preventDefault();
                      setValue(`${index}-orderType`, "buy");
                    }}
                    className={`rounded-l-none rounded capitalize font-bold text-sm text-regular w-20 text-right pr-2 h-10 ${
                      order?.side === "sell" ? "bg-grey-400" : "bg-primary"
                    }`}
                  >
                    Buy
                  </button>
                </div>
                <div
                  className={`flex items-end justify-center gap-1 px-1 mt-1`}
                >
                  <div>
                    <p className="text-xs text-center font-thin tracking-wide">
                      At Price
                    </p>
                    <input
                      type="number"
                      value={atPrice}
                      onChange={(e) => setAtPrice(e.target.value)}
                      className="w-28 outline-none text-center border border-grey-400 px-1"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 pb-2 flex justify-center">
              <input
                type="submit"
                value="SUBMIT"
                className="bg-primary cursor-pointer rounded-sm h-10 font-semibold tracking-wider text-regular px-3 py-1"
              />
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
