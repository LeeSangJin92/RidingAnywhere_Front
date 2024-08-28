import React from 'react';
import { useNavigate } from 'react-router-dom';

const RiderBoardBox = ({userId, boardData}) => {

    const navigate = useNavigate();

    let boardType = "";

    const onClickBox = () => {
        console.log("🕹️ 라이더 게시판 디테일 이동");
        navigate("/RA/Board/Detail/"+boardData.boardId)
    }

    switch(boardData.boardType){
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
    return (
        <div>
            <label htmlFor={boardData.boardId} className='RiderBoardBox'>
                <h2 className='boardNo'>{boardData.boardId}</h2>
                <h2 className='boardType' id={boardData.boardType}>{boardType}</h2>
                <h2 className='boardTitle'>{boardData.boardTitle}{boardData.emergencyNote?<span id='emergency'>🚨!</span>:""}</h2>
                <h2 className='boardWriter' id={boardData.user.userId===userId?"MyBoard":""}>{boardData.user.userNickname}</h2>
                <h2 className='boardCount'>{boardData.boardCnt}</h2>
            </label>
            <input id={boardData.boardId} onClick={onClickBox} hidden/>
        </div>
    );
};

export default RiderBoardBox;