import React from 'react';
import { Outlet } from 'react-router-dom';
import Folder from './Folder';
import { marketData } from './MarketData/marketData';

export default function Dashbar() {
    console.log(marketData);
    return (
        <section className="">
            <div className="h-[92vh] w-full flex">
                <div className="w-96 border-r h-full border-r-grey-400 pl-5 pt-3 overflow-y-scroll">
                    {
                        marketData.map((d) => <Folder key={d.disPlayName} data={d} />)
                    }
                </div>
                <div className="w-full overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </section>
    );
};

