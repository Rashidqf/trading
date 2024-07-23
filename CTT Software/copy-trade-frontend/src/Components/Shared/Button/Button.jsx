import React from 'react';
import './Button.css';

export default function Button({
    type = '',
    text = 'Button',
    classNames = '',
    onClick = () => { },
}) {
    return (
        <button onClick={onClick} type={type} className={`my-btn ${classNames}`}>{text}</button>
    );
}
