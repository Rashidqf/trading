import React from 'react';
import Trade from '../../Components/Modal/Trade/Trade';

export default function TRow({ data, idx }) {
    return (
        <div className={`flex flex-nowrap w-full items-center border-b-2 border-b-grey h-max py-2 px-2 cursor-pointer ${idx % 2 === 0 ? 'bg-grey' : ''}`}>
            <div className="w-[50rem] shrink grow text-xs font-semibold uppercase text-[#64748B] flex justify-start">
                {data.MarketName}
            </div>
            <div className="w-[12rem] text-xs font-semibold text-[#64748B] flex justify-center">
                {data.Currency}
            </div>
            <div className="w-[32rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
                <Trade marketData={data} />
            </div>
        </div>
    );
};
