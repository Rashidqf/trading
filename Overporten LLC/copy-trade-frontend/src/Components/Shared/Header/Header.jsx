import { ShoppingBagOpen, ShoppingCartSimple, ChartLineUp ,UsersFour,ClockCounterClockwise  } from '@phosphor-icons/react';
import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Item from '../../../Features/MarketPlace/components/Item';
import AddAccount from '../../Modal/AddAccount/AddAccount';
import AddCSV from '../../Modal/AddCSV/AddCSV';
import AddcsvClient from '../../Modal/AddCSV/AddcsvClient';

const data = [
    {
        name: 'Trading Dashboard',
        href: '/dashboard',
        Icon: ChartLineUp ,
    },
    {
        name: 'Account Summary',
        href: '/dashboard/account-summary',
        Icon: UsersFour,
    },
    {
        name: 'Trade History',
        href: '/dashboard/all-orders',
        Icon: ClockCounterClockwise ,
    },
];

export default function Header() {
    const location = useLocation();
    useEffect(() => {
        const reloaded = localStorage.getItem("reloaded");
    
        if (location.pathname === "/dashboard/all-orders" && reloaded !== "true") {
          localStorage.setItem("reloaded", "true");
          window.location.reload();
        } else if (location.pathname !== "/dashboard/all-orders") {
          localStorage.removeItem("reloaded");
        }
      }, [location.pathname]);
    return (
        <>
            <section className="py-3 px-8 flex justify-between">
                <div className="flex gap-40">
                    <div>
                        <h1 tabIndex={-1} className="cursor-pointer text-2xl font-mono tracking-wider focus:text-primary font-bold select-none"><Link className="text-black focus:text-primary" to='/dashboard'>Overporten LLC</Link></h1>
                    </div>
                    <div className="flex gap-12 bg-transparent">
                        {
                            data.map((d) => <Item key={d.name} href={d.href} name={d.name} Icon={d.Icon} />)
                        }
                    </div>
                </div>
                {/* <div className="flex gap-10">
                    <AddcsvClient/>
                    <AddCSV />
                    <AddAccount />
                </div> */}
            </section>
            <hr style={{ border: '0.7px solid #EAEAEA' }} />
        </>
    );
}
