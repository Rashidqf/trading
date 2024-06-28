import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loader from '../../Components/Shared/Loader/Loader';

const AllOrders = lazy(() => import('../../Pages/OrderSummary/AllOrders/AllOrders'));
const MarketPlace = lazy(() => import('../MarketPlace/MarketPlace'));
const OrderSummary = lazy(() => import('../../Pages/OrderSummary/OrderSummary'));
const Accounts = lazy(() => import('../../Pages/Accounts/Accounts'));

export default function Routing() {
    useEffect(() => {
        if (window.location.pathname === "/all-orders") {
            window.location.reload();
        }
    }, [Loader]);

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Navigate to='/dashboard' replace={true} />} />
                <Route path='/dashboard' element={<MarketPlace />}>
                    <Route index element={<OrderSummary />} />
                    <Route path='account-summary' element={<Accounts />} />
                    <Route path="all-orders" element={<AllOrders />} />
                </Route>
            </Routes>
        </Suspense >
    );
}
