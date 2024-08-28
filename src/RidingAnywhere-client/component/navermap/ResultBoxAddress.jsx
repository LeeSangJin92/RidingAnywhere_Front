import React from 'react';

const ResultBoxAddress = ({addressMain, addressRoad, roadFullAdd, lat, lng, onClick, setAddress, hidden}) => {
    // 🛠️ 도로명 주소 확인
    const boxDisabled = !addressRoad.trim();
    // 🕹️ 박스 클릭 반응
    const onClickBox = (data) => {
        let type = data.target.value;
        let addressValue = type==="main"?addressMain:roadFullAdd
        setAddress(addressValue);
        let targetInfo = `<div id="addressInfo">
                            <h2>${addressValue}</h2>
                        </div>`
        onClick({lat, lng, center:true, listHidden:true, poi:targetInfo});
    }

    return (
    <div className='ResultBoxAddress' style={hidden?{display:"none"}:{display:"flex"}}> 
        <input type='button' id={"box"+ addressMain} value={"main"} onClick={onClickBox} hidden/>
        <label className='ResultBoxMainAdd' htmlFor={"box"+ addressMain}>
                <span>{addressMain}</span>
        </label>
        <div className='RoadAddLine'>
            <span>도로명 : </span>
            <input type='button' hidden id={"box"+addressRoad} value={"road"} onClick={onClickBox} disabled={boxDisabled}/>
            <label className='ResultBoxRoadAdd'htmlFor={"box"+addressRoad} style={boxDisabled?{display:"none"}:{display:"flex"}}>
                <span>{addressRoad}</span>
            </label>
            <div>
            </div>
        </div>
        
    </div>
    );
};

export default ResultBoxAddress;