import React from 'react';
import '../css/header_small.css'

function DefaultHeader(props){
    return (
        <>
            <div className='Title'><img src='/img/Log_img.png' alt=''/><h1>{props.word}</h1></div>
        </>
    );
};
export default DefaultHeader;