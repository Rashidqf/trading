import React from 'react';
import './Loader.css';

export default function Loader() {
    return (
        <div className="loader-overlay">
            <div className="loader">
                <p className="heading">Loading</p>
                <div className="loading">
                    <div className="load"></div>
                    <div className="load"></div>
                    <div className="load"></div>
                    <div className="load"></div>
                </div>
            </div>
            <div className="overlay"></div> {/* Transparent overlay */}
        </div>
    );
};
    