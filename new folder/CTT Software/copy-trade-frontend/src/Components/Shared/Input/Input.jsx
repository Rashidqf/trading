import React from 'react';
import './Input.css';

export default function Input({
    Variant = 'input',
    type = 'text',
    label = '',
    required = false,
    name = { label },
    onClick = () => { },
    step = 'any',
    title = '',
    onInvalid = () => { },
    disabled = false,
    register = {},
    className = '',
}) {
    return (
        <div className="w-full inputDiv">
            <Variant
                type={type}
                className={"rounded-3xl w-full customInput" + className}
                name={label}
                onClick={onClick}
                placeholder=" "
                step={step}
                onInput={e => e.target.setCustomValidity('')}
                title={title}
                onInvalid={onInvalid}
                onWheel={e => type === 'number' && e.target.blur()}
                required={required}
                disabled={disabled}
                {...register}
            />
            <label className="customLabel">
                {label} {required && <span className="required">*</span>}
            </label>
        </div>
    );
};
