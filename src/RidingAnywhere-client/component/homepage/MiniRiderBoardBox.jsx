import React from 'react';
import { useNavigate } from 'react-router-dom';

const MiniRiderBoardBox = ({riderBoardData}) => {
    const navigate = useNavigate();
    let boardType = "";
    let boardDetail = "";
    
    let boardId = riderBoardData.boardId;

    // 🛠️ 게시글 디테일 구분
    switch(riderBoardData.boardDetail){
        case "Crackdown" : boardDetail = "(👮🏻)"
            break;
        case "Accident" : boardDetail = "(⚠️)"
            break;
        case "RoadCondition" : boardDetail = "(👷🏾)"
            break;
        case "TrafficJam" : boardDetail = "(🐢)"
            break;
        case "Fast" : boardDetail = "(🏍️)" 
            break;
        case "All" : boardDetail = "(🆓)"
            break;
        case "Slow" : boardDetail = "(🛵)"
            break;
        case "Mechanic" : boardDetail = "(🛠️)"
            break;
        case "Center" : boardDetail = "(🏬)"
            break;
        case "Traction" : boardDetail = "(🚚)"
            break;
        default:
    }

    let boardTitle = riderBoardData.boardTitle + boardDetail;

    // 🛠️ 타입 구분
    switch(riderBoardData.boardType){
        case "Free" :
        boardType="🆓자유글";
        break;
        case "Event" :
        boardType="🚨사건글";
        break;
        case "Driving" :
        boardType="⚡번개글";
        break;
        case "Mechanic" :
        boardType="🛠️정비글";
        break;
        default:
    }

    const onClickBox = () => {
        console.log("🕹️ 라이더 게시글 이동");
        navigate("/RA/Board/Detail/"+boardId)
    }

    return (
        <div>
            <input type='button' id={boardId} hidden onClick={onClickBox}/>
            <label htmlFor={boardId} className='MiniRiderBoardBox'>
                <h2 className='boardType'>{boardType}</h2>
                <h2 className='boardTitle'>{boardTitle}</h2>
            </label>
        </div>
    );
};

export default MiniRiderBoardBox;