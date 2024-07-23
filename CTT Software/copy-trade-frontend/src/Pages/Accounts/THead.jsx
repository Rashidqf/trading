import React from 'react';


const heads = [
    {
        name: 'ID',
        classNames: 'w-[50rem] shrink grow text-xs font-semibold uppercase text-[#64748B] flex justify-start',
    },
    {
        name: 'Email',
        classNames: 'w-[15rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
    },
    {
        name: 'Account Id',
        classNames: 'w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
    },
    {
        name: 'Currency',
        classNames: 'w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
    },
    {
        name: 'Balance',
        classNames: 'w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
    },
    // {
    //     name: 'Percentage',
    //     classNames: 'w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
    // },
    // {
    //     name: 'Type',
    //     classNames: 'w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
    // },
    {
        name: 'Actions',
        classNames: 'w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center',
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
