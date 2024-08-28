import React from 'react';

const ResultBoxTarget = ({title,category,addressData, lat, lng, onClick, hidden, setAddress}) => {
    const onClickBox = () => {
        setAddress(addressData);
        let targetInfo = `<div id="targetInfo">
                            <span id="targetType">${category}</span>
                            <h2>${title}</h2>
                            <span>${addressData}</span>
                        </div>`
        
        onClick({lat, lng, center:true, listHidden:true, poi:targetInfo});
    }


    return (<div style={hidden?{display:"none"}:{display:"flex"}}>
            <input type='button' id={"box"+title} onClick={onClickBox} hidden/>
            <label htmlFor={"box"+title} className='ResultBoxTarget'>
                <div className='Top'>
                    <span className='title'>{title}</span>
                    <span className='category'>{category}</span>
                </div>
                <div className='Bottom'>
                    <span className='address'>{addressData}</span>
                </div>
            </label>
        </div>
    );
};

export default ResultBoxTarget;