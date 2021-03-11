import React from 'react';

import './Infobar.css';

import closeIcon from '../../icons/closeIcon.png';

const Infobar = ({room}) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <h3>Play-Tabel: {room}</h3>
        </div>        
        <div className="rightInnerContainer">
            <a href="/"><img src={closeIcon} alt="close"/></a>
        </div>
    </div>
)

export default Infobar;