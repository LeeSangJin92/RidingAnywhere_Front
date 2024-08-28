import React from 'react';

const CrewJoinOk = (data) => {
    const ClickBtn = (props) => {
        switch(props.target.id){
            case "JoinOkBtn" :
                console.log("🕹️ 크루 가입 요청 보내기");
                data.requestJoin();
                break;
            case "JoinCancelBtn" :
                console.log("🕹️ 크루 가입 취소");
                data.setShowUpBox(false);
                break;
            default:
        }
    }
    return (
        <div className='CrewJoinOk'>
            <h1>{data.crewName}</h1>
            <h2>{"선택하신 크루에 가입 요청을 보내겠습니까?"}</h2>
            <div className='CrewJoinOkBtnLine'>
                <input type='button' id='JoinOkBtn' onClick={ClickBtn}/>
                <input type='button' id='JoinCancelBtn' onClick={ClickBtn}/>
            </div>
        </div>
    );
};

export default CrewJoinOk;