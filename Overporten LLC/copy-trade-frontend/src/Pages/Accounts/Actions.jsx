import React, { useEffect, useRef } from "react";
import { useGlobalCtx } from "../../Contexts/GlobalProvider";
import UpdateAccount from "../../Components/Modal/UpdateAccount/UpdateAccount";
import { DotsThreeCircle} from "@phosphor-icons/react";

export default function Actions({ data, editorRef }) {
  const actionRef = useRef();
  const btnRef = useRef();
  const { removeAccount, updateAccount } = useGlobalCtx();

  /**
   * Toggles the visibility of a modal element.
   * @returns {void} - This function does not return a value.
   */
  const handleModal = () => {
    actionRef.current.classList.toggle("hidden");
  };

  /**
   * Click away listener that hides the action element when a click occurs outside of it.
   * @param {object} e - The click event object.
   * @returns {void} - This function does not return a value.
   */
  const clickAwayListenr = (e) => {
    if (
      actionRef.current &&
      !actionRef.current.contains(e.target) &&
      !btnRef.current.contains(e.target)
    ) {
      actionRef.current.classList.add("hidden");
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickAwayListenr);
    return () => {
      document.removeEventListener("click", clickAwayListenr);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={btnRef} className="select-none" onClick={handleModal}>
        <p><DotsThreeCircle  size={24}  /></p>
      </div>
      <div
        ref={actionRef}
        className="hidden shadow-md bg-regular absolute w-max p-3 rounded-md z-50 -left-16"
      >
        <button
          onClick={() => {
            if (data.accountType === "Primary") {
              updateAccount(data.id, { accountType: "Secondary" }); // Deselect if already selected
            } else {
              updateAccount(data.id, { accountType: "Primary" }); // Select as Primary if not already selected
            }
            handleModal();
          }}
          className="p-2 hover:bg-secondary rounded-md block mb-1"
        >
          {data.accountType === "Primary"
            ? "Deselect Account Selected"
            : "Select As Master"}
        </button>
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
        <button
          onClick={() => {
            removeAccount(data.id);
            handleModal();
          }}
          disabled={data.accountType === "Primary"} // Disable if it's a primary account
          className="p-2 hover:bg-secondary rounded-md block mb-1"
        >
          Remove Account
        </button>
      </div>
    </div>
  );
}
