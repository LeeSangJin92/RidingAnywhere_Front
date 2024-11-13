import React from 'react';

const CrewTourAttendCheck = (props) => {
    let textData = props.textData;
    let showAttendCheck = props.showAttendCheck;
    let setShowAttendCheck = props.setShowAttendCheck;
    let setCheckAttend = props.setCheckAttend;

    const onClickBtn = (btnData) => {
        console.log("클릭중..")
        if(btnData.target.value==="true"){
            setCheckAttend(true)
        } else {
            setCheckAttend(null)
        }

        setShowAttendCheck(false);
    }


    return (
        <div className='CrewTourAttendCheck' style={showAttendCheck?{display:'flex'}:{display:'none'}}>
            <h1>해당 모임에 참여하시겠습니까?</h1>
                <div className='CrewTourAttendBtnLine'>
                    <input type='button' id='TourAttendOkBtn' value={true} onClick={onClickBtn} hidden/>
                    <label htmlFor='TourAttendOkBtn' className='TourAttendOkLabel'><h1>참여</h1></label>
                    <input type='button' id='TourAttendCancelBtn' value={false} onClick={onClickBtn} hidden/>
                    <label htmlFor='TourAttendCancelBtn' className='TourAttendCancelLabel'><h1>취소</h1></label>
                </div>
        </div>
    );
};

export default CrewTourAttendCheck;