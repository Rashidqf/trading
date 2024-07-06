import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import req from "./req";
import { addAcount, deleteAcount, setValue, updateAcount } from "../reducers/accountReducer";
import useUtils from "../Utils/useUtils";

const useAcount = () => {
    const dispatch = useDispatch();
    const { hitToast } = useUtils();
    const { accounts, page } = useSelector((state) => ({
        accounts: state.acountStore.accounts,
        page: state.acountStore.pagination.page
    }), shallowEqual);

    useEffect(() => {
        dispatch(setValue({ target: 'loading', value: true }));
        req({ method: "GET", uri: `accounts?${new URLSearchParams({ page })}` })
            .then(({ data: { docs, totalDocs } }) => {
                dispatch((update, getState) => {
                    const { pagination } = getState().acountStore;
                    update(setValue({ target: 'accounts', value: docs }));
                    update(setValue({ target: 'pagination', value: { ...pagination, total: totalDocs } }));
                });
            })
            .catch((err) => console.log(err))
            .finally(() => dispatch(setValue({ target: 'loading', value: false })));
    }, [page]);


    const addAccount = (data) => {
        if (!data.accountId) return hitToast('Provide all the fields', 'info');
        req({ method: "POST", uri: 'account', data })
            .then(({ data }) => {
                dispatch(addAcount(data));
                hitToast('Added Successfully', 'success');
            })
            .catch((err) => {
                console.log(err);
                hitToast('Something went wrong', 'error');
            });

    };

    const updateAccount = (id, payload) => {
        if (!Object.keys(payload).length > 0) return hitToast('Please Provide the value', 'info');
        req({ method: "PATCH", uri: `account/${id}`, data: payload })
            .then(({ data }) => {
                hitToast('Updated Successfully', 'success');
                dispatch(updateAcount(data));
            })
            .catch((err) => console.log(err));
    };

    const sendAllAccounts = (e) => {
        e.preventDefault();
        console.log(accounts);
        const payLoad = {
            accounts,
            type: 'New Account'
        }
        if (accounts?.length > 0) {
            // Filter accounts with valid IDs to ensure data integrity
            const accountsWithIds = accounts.filter(account => account.id !== undefined && account.id !== null);
          
            if (accountsWithIds.length > 0) {
              req({
                method: 'POST',
                uri: `${process.env.REACT_APP_BOT_SERVER_URL}/accounts`,
                data: { accounts: accountsWithIds } // Send only accounts with IDs
              })
                .then(() => {
                  console.log('received');
                  hitToast('Accounts are being readied for trade..', 'success');
                })
                .catch(err => {
                  console.error(err);
                  hitToast('Something went wrong', 'error');
                });
            } else {
              console.warn('No accounts with valid IDs found for processing.');
              // Optionally: Display a message to the user indicating the issue
              // hitToast('No valid accounts found for trade.', 'warning');
            }
          }
          
    };

    const updateAccountWithCSV = (payload) => {
        if (!payload) return;
        req({ method: 'PATCH', uri: 'accounts', data: payload })
            .then(({ data }) => {
                hitToast('Updated Successfully', 'success');
            })
            .catch((err) => {
                console.log(err);
                hitToast('Data format mismatched', 'error');
            })
    };

    const AddAccountWithCSV = (payload) => {
        if (!payload) return;
        req({ method: 'POST', uri: 'accountwithcsv', data: payload })
            .then(({ data }) => {
                hitToast('Updated Successfully', 'success');
            })
            .catch((err) => {
                console.log(err);
                hitToast('Data format mismatched', 'error');
            })
    };

    const removeAccount = (id) => {
        req({ method: 'DELETE', uri: `account/${id}` })
            .then((res) => {
                dispatch(deleteAcount({ id }));
                hitToast('Account Removed Successfully', 'success');
            })
            .catch((err) => console.log(err));
    };

    const handlePagination = (event, value) => {
        dispatch((update, getState) => {
            const { pagination } = getState().acountStore;
            update(setValue({ target: 'pagination', value: { ...pagination, page: value } }));
        });
    };

    return {
        addAccount,
        sendAllAccounts,
        handlePagination,
        updateAccount,
        updateAccountWithCSV,
        AddAccountWithCSV,
        removeAccount,
    };
};

export default useAcount;   