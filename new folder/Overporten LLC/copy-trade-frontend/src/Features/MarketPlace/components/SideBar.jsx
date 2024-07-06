import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MarketOrder from './MarketOrder';

export default function SideBar() {
  const location = useLocation();
  return (
    <section className="w-full">
      <div className="h-[92vh] w-full flex ">
        <div className={`${!['/dashboard/account-summary', '/dashboard/all-orders'].includes(location.pathname) ? 'w-[60rem] overflow-y-scroll border-r-grey-400 border-r' : 'w-0'} h-full px-5 pt-3`}>
          {
            !['/dashboard/account-summary', '/dashboard/all-orders'].includes(location.pathname) ? < MarketOrder /> : <></>
          }
        </div>
        <div className="w-full overflow-y-scroll overflow-x-scroll">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
