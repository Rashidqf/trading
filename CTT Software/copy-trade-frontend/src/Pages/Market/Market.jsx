import React from "react";
import { useGlobalCtx } from "../../Contexts/GlobalProvider";
import THead from "./THead";
import TRow from "./TRow";
import Loader from "../../Components/Shared/Loader/Loader";

export default function Market() {
    const { marketData, marketName, isLoading } = useGlobalCtx();
    return (
        <section className="w-full">
            {
                isLoading ? <Loader /> : <section className="p-5 w-full">
                    <h1 className="font-semibold text-xl py-3">{marketName}</h1>
                    <div className="flex-col w-full">
                        <THead />
                        {
                            marketData.length > 0 ? marketData.map((d, idx) => <TRow idx={idx} key={d.QuoteID} data={d} />) : <p className="min-h-[70vh] w-full flex justify-center items-center text-primary">No Data found !</p>
                        }
                    </div>
                </section>
            }
        </section>
    );
};
