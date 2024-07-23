import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Loader from '../../../Components/Shared/Loader/Loader';
import Paginations from '../../../Components/Shared/Pagination/Paginations';
import { useGlobalCtx } from '../../../Contexts/GlobalProvider';
import THead from './THead';
import TRow from './TRow';
import { CSVLink } from 'react-csv';
import useHistory from '../../../Hooks/useHistory'; // Ensure the correct path
import { setPagination } from '../../../reducers/historyReducer';

export default function AllOrders() {
  const dispatch = useDispatch()
  const { handlePagination, WipeTrade } = useHistory();
  const { orders, loading, total, currentPage } = useSelector(
    (state) => ({
      orders: state.historyStore.allOrders,
      loading: state.historyStore.loading,
      total: state.historyStore.pagination.total,
      currentPage: state.historyStore.pagination.page,
    }),
    shallowEqual
  );
  const handlePageChange = (page) => {
    dispatch(setPagination({ page }));
  };
  console.log("orders",currentPage)

  const preprocessDataForCSV = (data) => {
    return data?.map((order) => {
      const {
        account,
        percentage,
        ammount,
        side,
        marketData,
        stopLimit,
        logs,
        createdAt,
      } = order;

      const email = account?.email;
      const orderDate = new Date(createdAt).toLocaleDateString();

      const marketDataStr = marketData ? Object.values(marketData).join(', ') : '';
      const logsStr = logs
        ?.map((log) => Object.values(log).join(', '))
        .join(' | ');

      return {
        email,
        orderDate,
        percentage,
        ammount,
        side,
        marketData: marketDataStr,
        stopLimit,
        logs: logsStr,
      };
    });
  };

  const preprocessedData = preprocessDataForCSV(orders);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className='p-5 w-full flex flex-col h-full'>
          <div className='flex-1 flex flex-col'>
            <div className='flex-1'>
              <div className='flex justify-between'>
                <h1 className='font-semibold text-xl py-3 flex-1'>All Orders</h1>
                <button
                  onClick={WipeTrade}
                  className='mr-10 cursor-pointer font-medium outline-none border-none select-none inline-block px-4 py-[5px] bg-primary rounded-3xl text-regular mb-1'
                >
                  Wipe data
                </button>
                <button className='cursor-pointer font-medium outline-none border-none select-none inline-block px-4 py-[5px] bg-primary rounded-3xl text-regular mb-1'>
                  <CSVLink data={preprocessedData} filename={'exported_orders.csv'}>
                    Export CSV
                  </CSVLink>
                </button>
              </div>

              <div className='flex flex-col w-full'>
                <THead />
                {orders && orders.length > 0 ? (
                  orders?.map((order, idx) => <TRow key={order.id} order={order} idx={idx} />)
                ) : (
                  <p className='min-h-[70vh] w-full flex justify-center items-center text-primary'>
                    No Orders found !
                  </p>
                )}
              </div>
            </div>
            <div>
              <Paginations onChange={handlePageChange} currentPage={currentPage} total={total} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
