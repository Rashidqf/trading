import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useUtils from "../Utils/useUtils";
import req from "./req";

// socket instance
const socket = io(process.env.REACT_APP_SOCKET_URL, { autoConnect: true, reconnection: true });
let interval;

const useGlobal = () => {

    const [accounts, setAccounts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [parentOrders, setParentOrders] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [marketName, setMarketName] = useState('Popular Market');
    const [groupName, setGroupName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [orderPaginations, setOrderPaginations] = useState({ total: 0, page: 1 });
    const [parentPagination, setParentPagination] = useState({ total: 0, page: 1 });
    const [accountPaginations, setAccountPaginations] = useState({ total: 0, page: 1 });
    const { hitToast } = useUtils();
    const { page: orderPage } = orderPaginations;
    const { page: accountPage } = accountPaginations;
    const { page: parentPage } = parentPagination;

    useEffect(() => {
        // on connection to the server
        socket.on('connection', (data) => {
            console.log(data);
        });

        // update order status
        socket.on('order', (data) => {
            hitToast(data.message, 'success');
            if (data.order.status === 'Closed') {
                setParentOrders((p) => {
                    // Filter out parent orders where any of the children's IDs match the order ID
                    const filteredOrders = p.filter((parentOrder) => {
                        const hasMatchingChild = parentOrder.childrens.some((child) => child.id === data.order.id);
                        return !hasMatchingChild;
                    });
                    return filteredOrders;
                });
            }
            else {
                setParentOrders((prev) => {
                    return prev.map((p) => {
                        return {
                            ...p,
                            childrens: p.childrens.map((c) => (c.id === data.order.id ? data.order : c)),
                        };
                    });
                });
            }

            setOrders(([...prev]) => {
                return prev.map((p) => {
                    if (p.id === data.order.id) {
                        p.status = data.order.status;
                        return p;
                    };
                    return p;
                })
            });
        });

        // update account type
        socket.on('accountType', (data) => {
            setAccounts(([...prev]) => {
                return prev.map((p) => {
                    if (p.id === data.id) {
                        p.accountType = data.accountType;
                        return p;
                    };
                    return p;
                });
            });
        });

        // update the partial exit property
        socket.on('partialExit', (data) => {
            setParentOrders((prev) => {
                return prev.map((p) => {
                    if (p.id === data.parentId) {
                        return { ...p, childrens: [...data.parent] }
                    }
                    return p;
                })
            });

        });
        // for receiving account status from bot
        socket.on('account', (data) => {
            console.log(data);
        });
        return () => {
            socket.off('connection');
            socket.off('order');
            socket.off('accountType');
            socket.off('partialExit');
            socket.off('account');
        };
    }, []);

    useEffect(() => {
        // clearInterval(interval);
        // interval = setInterval(() => {
        //     // setIsLoading(true);
        //     req({ method: "GET", uri: `trades?${new URLSearchParams({ page: orderPaginations.page, orderType: 'child' })}` })
        //         .then(({ data }) => {
        //             setOrders(data.docs);
        //             setOrderPaginations((prev) => ({ ...prev, total: data.totalDocs }));
        //         })
        //         .catch((err) => console.log(err));
        //     // .finally(() => setIsLoading(false));
        // }, 3000);
    }, [orderPage]);

    useEffect(() => {
        setIsLoading(true);
        // for temporary use only
        req({ method: "GET", uri: `order/getall?${new URLSearchParams({ orderType: 'parent' })}` })
            .then(({ data }) => {
                setParentOrders(data);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    }, []);


    useEffect(() => {
        req({ method: "GET", uri: `accounts?${new URLSearchParams({ page: accountPaginations.page })}` })
            .then(({ data }) => {
                setAccounts(data.docs);
                setAccountPaginations((prev) => ({ ...prev, total: data.totalDocs }));
            })
            .catch((err) => console.log(err));
    }, [accountPage]);

    /**
     * Adds an account with the given account ID and percentage.
     * @param {Object} data - The data object containing the account ID (accountId),email,password and percentage (percentage).
     * @returns {void} - This function does not return a value.
     */
    const addAccount = (data) => {
        if (!data.accountId) return hitToast('Provide all the fields', 'info');
        try {
            req({ method: "POST", uri: 'account', data })
                .then(({ data }) => {
                    setAccounts(([...prev]) => ([...prev, data]));
                    hitToast('Added Successfully', 'success');
                })
                .catch((err) => {
                    console.log(err);
                    hitToast('Something went wrong', 'error');
                });
        }
        catch (err) {
            console.log(err);
            hitToast('Something went wrong', 'error');
        }
    };


    /**
     * Updates an account with the given ID using the provided payload.
     * @param {string} id - The ID of the account to update.
     * @param {Object} payload - The payload containing the updated values for the account.
     * @returns {void} - This function does not return a value.
     */
    const updateAccount = (id, payload) => {
        if (!Object.keys(payload).length > 0) return hitToast('Please Provide the value', 'info');
        try {
            setIsLoading(true);
            req({ method: "PATCH", uri: `account/${id}`, data: payload })
                .then(({ data }) => {
                    hitToast('Updated Successfully', 'success');
                    setAccounts(([...prev]) => {
                        return prev.map((p) => p.id !== data.id ? p : data);
                    });
                })
                .catch((err) => console.log(err));
        }
        catch (err) {
            console.log(err);
            hitToast('Something went wrong', 'error');
        }
        finally {
            setIsLoading(false);
        }
    };


    /**
     * Updates an account with data provided in a CSV format.
     *
     * @param {Object} payload - The data to be updated in CSV format.
     * @param {string} method - The HTTP method to be used for the update (e.g., 'PATCH', 'PUT', 'POST').
     * @param {string} uri - The URI endpoint where the update request will be sent.
     * @param {string} payload - The CSV data to be sent in the request body.
     * @returns {void}
     */
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



    /**
     * Removes an account with the given ID.
     * @param {string} id - The ID of the account to remove.
     * @returns {void} - This function does not return a value.
     */
    const removeAccount = (id) => {
        try {
            req({ method: 'DELETE', uri: `account/${id}` })
                .then((res) => {
                    setAccounts(([...prev]) => prev.filter((p) => p.id !== id));
                    hitToast('Account Removed Successfully', 'success');
                })
                .catch((err) => console.log(err));
        }
        catch (err) {
            console.log(err);
            hitToast('Something went wrong', 'error');
        }
    };


    /**
    * Enables editing of the content within an HTML element with the provided editor reference.
    * @param {Object} editorRef - The reference to the HTML element to be edited.
    * @returns {void} - This function does not return a value.
    */
    const handleEditPercentage = (editorRef) => {
        // make the task name section editable
        editorRef.current.contentEditable = true;
        editorRef.current.focus();
        const range = document.createRange();
        // positioning cursor at the end of the content
        const cursorPositon = editorRef.current.textContent.length;
        const selection = window.getSelection();
        range.setStart(editorRef.current.childNodes[0] || [], cursorPositon);
        range.setEnd(editorRef.current.childNodes[0] || [], cursorPositon);
        selection.removeAllRanges();
        selection.addRange(range);
    };


    /**
     * Submits the percentage value from the editor and updates the account with the given ID.
     * @param {string} id - The ID of the account to update.
     * @param {Object} editorRef - The reference to the HTML element containing the percentage value.
     * @returns {void} - This function does not return a value.
     */
    const submitPercentage = (id, editorRef) => {
        const percentage = Number(editorRef.current.textContent.replace(/%/g, ''));
        updateAccount(id, { percentage });
    };



    /**
     * Creates an order with the provided data.
     * @param {Object} data - The data required to create the order.
     * @returns {void} - This function does not return a value.
     */
    const createOrder = (data) => {
        try {
            if (!data.percentage || !data.side) return hitToast('Amount and Side is required', 'info');
            if (data.partialExit === false) {
                data.side = data.side === 'buy' ? 'sell' : 'buy';
                data.exitFrom = data.id;
                delete data.id;
                delete data.updatedAt;
                delete data.createdAt;
            }
            // return console.log(data);
            req({ method: 'POST', uri: 'order/create', data })
                .then((res) => {
                    setOrders((prev) => [...res.data.orders, ...prev]);
                    if (!res.data.parentOrder.childrens[0].exitFrom) setParentOrders((prev) => ([res.data.parentOrder, ...prev]));
                    hitToast('Order Placed', 'success');
                })
                .catch(err => console.log(err));
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    };


    /**
     * Retrieves market data based on the provided request URL and payload.
     * @param {Object} data - The data containing the request URL and payload.
     * @returns {void} - This function does not return a value.
     */
    const getMarketData = (data) => {
        try {
            setMarketName(data.disPlayName);
            if (data.groups && data.groups.length > 0) {
                setGroupName(data.disPlayName);
            }
            if (data.disPlayName === 'Popular Market') setGroupName('');
            const { reqUrl, payLoad } = data;
            const reqObject = {
                reqUrl,
                payLoad
            };
            if (reqUrl) {
                setIsLoading(true);
                req({ method: 'POST', uri: 'marketdata', data: reqObject })
                    .then(({ data }) => {
                        setMarketData(data);
                    })
                    .catch((err) => console.log(err))
                    .finally(() => setIsLoading(false));
            }
        }
        catch (err) {
            console.log(err);
            hitToast('Something went wrong', 'error');
        }
    };

    /**
     * Updates a trade with the provided ID using the given payload.
     * @param {string} id - The ID of the trade to update.
     * @param {Object} payload - The data payload containing the updates for the trade.
     * @returns {void} - This function does not return a value.
     */
    const updateTrade = (id, payload) => {
        try {
            req({ method: 'PATCH', uri: `trade/${id}`, data: payload })
                .then(({ data }) => {
                    hitToast('Updated Successfully', 'success');
                    setParentOrders((prev) => {
                        return prev.map((p) => p.id === data.orders.id ? data.orders : p);
                    });
                    setOrders((prev) => {
                        return prev.map((p) => {
                            const updatedOrder = data.updated.find((d) => d.id === p.id);
                            return updatedOrder ? updatedOrder : p;
                        });
                    });
                })
                .catch((err) => console.log(err));
        }
        catch (err) {
            console.log(err);
            hitToast('Something went wrong', 'error');
        }
    };

    const closeOrder = (id) => {
        req({ method: 'PATCH', uri: `close-order/${id}` })
            .then(({ data }) => {
                setParentOrders((prev) => prev.filter((p) => p.id !== data.docs[0].id));
                hitToast('Successfully closed order', 'success');
            })
            .catch((err) => {
                console.log(err);
                hitToast('Failed to close order', 'error');
            });
    };


    const sendAllAccounts = (e) => {
        e.preventDefault();
        const payLoad = {
            accounts,
            type: 'New Account'
        }
        if (accounts.length > 0) {
            req({ method: 'POST', uri: `${process.env.REACT_APP_BOT_SERVER_URL}/accounts`, data: payLoad })
                .then(() => {
                    console.log('recived');
                })
                .catch(err => {
                    console.log(err);
                    hitToast('Something went wrong', 'error');
                });
        }
    };

    return {
        socket,
        accounts,
        setAccounts,
        isLoading,
        setIsLoading,
        addAccount,
        updateAccount,
        updateAccountWithCSV,
        removeAccount,
        handleEditPercentage,
        submitPercentage,
        createOrder,
        closeOrder,
        orders,
        setOrders,
        getMarketData,
        marketData,
        setMarketData,
        marketName,
        updateTrade,
        groupName,
        setGroupName,
        sendAllAccounts,
        orderPaginations,
        accountPaginations,
        setOrderPaginations,
        setAccountPaginations,
        parentOrders,
        setParentOrders,
        parentPagination,
        setParentPagination,
    }
};
export default useGlobal;