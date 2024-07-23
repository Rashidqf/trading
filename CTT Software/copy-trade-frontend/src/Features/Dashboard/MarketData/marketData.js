export const marketData = [
    {
        disPlayName: 'Popular Market',
        reqUrl: process.env.REACT_APP_MARKETDATA_URL,
        method: 'POST',
        payLoad: {
            groupID: 991,
            keyword: "",
            portfolio: false,
            search: false,
            popular: false
        }
    },
    {

        disPlayName: "Cryptocurrency",
        groups: [
            {
                disPlayName: 'All',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11064,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    },
    {
        disPlayName: 'Indices',
        groups: [
            {
                disPlayName: "Asian",
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'GET',
                payLoad: {
                    groupID: 8,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'Differentials',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 7,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'Uropean',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 16,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: "US",
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 17,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'World',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 18,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    },
    {
        disPlayName: 'FX',
        groups: [
            {
                disPlayName: 'EURxxx',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11028,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'GBPxxx',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11029,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'USDxxx',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11030,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'Other Pairs',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11031,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    },
    {
        disPlayName: 'Shares-UK',
        groups: [
            {
                disPlayName: 'UK -A',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 101,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -B',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 102,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -C',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 103,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -D',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 104,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -E',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 105,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -F',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 106,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -G',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 107,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -H',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 108,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -I',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 109,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -J',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 110,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -K',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 111,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -L',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 112,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -M',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 113,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -N',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 114,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -O',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 115,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -P',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 116,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -Q',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 117,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -R',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 118,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -S',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 119,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -T',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 120,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -U',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 121,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -V',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 122,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -W',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 123,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -X',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 124,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -Y',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 125,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'UK -Z',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 126,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
        ]
    },
    {
        disPlayName: 'Shares- US',
        groups: [
            {
                disPlayName: 'US Shares -A',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 251,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -B',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 252,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -C',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 253,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -D',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 254,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -E',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 255,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -F',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 256,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -G',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 257,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -H',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 258,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -I',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 259,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -J',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 260,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -K',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 261,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -L',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 262,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -M',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 263,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -N',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 264,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -O',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 265,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -P',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 266,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -Q',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 267,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -R',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 268,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -S',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 269,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -T',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 270,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -U',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 271,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -V',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 272,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -W',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 273,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -X',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 274,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -Y',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 275,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
            {
                disPlayName: 'US Shares -Z',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 276,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            },
        ]
    },
    {
        disPlayName: 'Shares - Denmark',
        groups: [
            {
                disPlayName: 'Denmark',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11063,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    },
    {
        disPlayName: 'Shares- European',
        groups: [
            {
                disPlayName: 'European',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11052,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    },
    {
        disPlayName: 'Bonds',
        groups: [
            {
                disPlayName: 'Bonds',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11033,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    },
    {
        disPlayName: 'Energy',
        groups: [
            {
                disPlayName: 'All Energy',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11038,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    },
    {
        disPlayName: 'Metals',
        groups: [
            {
                disPlayName: 'All Metals',
                reqUrl: process.env.REACT_APP_MARKETDATA_URL,
                method: 'POST',
                payLoad: {
                    groupID: 11032,
                    keyword: "",
                    portfolio: false,
                    search: false,
                    popular: false
                }
            }
        ]
    }
];