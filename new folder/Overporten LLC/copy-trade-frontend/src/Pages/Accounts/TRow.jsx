import React, { useRef } from 'react';
import Actions from './Actions';
import { useGlobalCtx } from '../../Contexts/GlobalProvider';

export default function TRow({ data, idx }) {
    const { submitPercentage } = useGlobalCtx();
    const editorRef = useRef();

    const isPrimary = data?.accountType === "Primary";
    const isEven = idx % 2 === 0;
    
    let rowClassName = "flex flex-nowrap w-full items-center border-b-2 border-b-grey h-max py-2 px-2 cursor-pointer";
    if (isPrimary) {
        rowClassName += " bg-[#FFD700]";
    } else {
        rowClassName += isEven ? " bg-grey" : "";
    }

    return (
        <div className={rowClassName}>
            <div className="w-[16.66%] shrink grow text-xs font-semibold text-[#64748B] flex justify-center">
                {data?.id || '---'}
            </div>
            <div className="w-[16.66%] text-xs font-semibold text-[#64748B] flex justify-center">
                {data?.email || '---'}
            </div>
            <div className="w-[16.66%] text-xs font-semibold text-[#64748B] flex justify-center">
                {data?.accountId || '---'}
            </div>
            <div className="w-[16.66%] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
                ---
            </div>
            <div className="w-[16.66%] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
                ---
            </div>
            {/* Uncomment and update these sections as needed */}
            {/* <div
                onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                        submitPercentage(data.id, editorRef);
                        editorRef.current.contentEditable = false;
                    }
                }}
                onBlur={() => {
                    submitPercentage(data.id, editorRef);
                    editorRef.current.contentEditable = false;
                }}
                ref={editorRef}
                className="w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center focus:outline-none focus:border-none"
            >
                {data.percentage + '%' || '---'}
            </div> */}
            {/* <div className="w-[12rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
                {data.accountType || '---'}
            </div> */}
            <div className="w-[16.66%] text-xs font-semibold uppercase text-[#64748B] flex justify-center hover:cursor-pointer">
                <Actions data={data} editorRef={editorRef} />
            </div>
        </div>
    );
}
