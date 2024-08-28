import React from 'react';

const BikeInfoBox = (props) => {
    let bike = props.data
    let box_on = {backgroundImage:"url('/img/mypage/InfoBox_On.png')"}
    let box_off = {backgroundImage:"url('/img/mypage/InfoBox_Off.png')"}
    let imgSrc = '/img/brand/'+bike.bikebrand_logo
    return (
        <div className='InfoBox' style={props.showBikeIndex===bike.bike_index?box_on:box_off}>
            <img className='infobox_Star' src='/img/mypage/InfoBox_Star.png' alt='' style={bike.bike_select?{display:"block"}:{display:"none"}}/>
            <div>
                <img className='Mypage_brandImg' src={imgSrc} alt=''/>
                <div className='bikeDataLine'>
                    <h4>연식<br/>{bike.bike_year}</h4>
                    <h4>CC<br/>{bike.bike_cc}</h4>
                </div>
            </div>
            <div className='bikeNameLine'>
                <h4>{bike.model_name}</h4>
            </div>
        </div>
    );
};

export default BikeInfoBox;