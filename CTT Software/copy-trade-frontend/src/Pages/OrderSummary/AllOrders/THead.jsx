import React from 'react';


const heads = [
	{
		name: 'MarketPlace',
		classNames: 'w-[8rem] text-xs font-semibold uppercase text-[#64748B] flex justify-start',
	},
	{
		name: 'Order Date',
		classNames: 'w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'Account(Email)',
		classNames: 'w-[15rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'Open Price',
		classNames: 'w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'Stop Loss',
		classNames: 'w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'Ammount',
		classNames: 'w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'TradeId',
		classNames: 'w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'Trade Type',
		classNames: 'w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'Side',
		classNames: 'w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
	{
		name: 'Status',
		classNames: 'w-[10rem] shrink grow text-xs font-semibold uppercase text-[#64748B] flex justify-center',
	},
];
export default function THead() {
	return (
		<div className="flex flex-nowrap w-full items-center bg-secondary h-max py-2 px-2">
			{
				heads.map((h, i) => <div className={`select-none ${h.classNames}`} key={i}>
					{h.name}
				</div>)
			}
		</div>
	);
}
