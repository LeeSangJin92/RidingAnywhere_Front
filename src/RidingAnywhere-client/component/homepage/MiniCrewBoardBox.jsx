import React from 'react';
import {useNavigate } from 'react-router-dom';

const MiniCrewBoardBox = (props) => {

    const navigate = useNavigate();

    let boardType = "";
    let boardTitle = props.boardTitle;
    let boardId = props.boardId;

    switch(props.boardType){
        case "Note" :
            boardType="📢공지글";
            break;
        case "Tour" :
            boardType="🚩모임글";
            break;
        case "Free" :
            boardType="🆓자유글";
            break;
        case "Greetings" :
            boardType="😁인사글";
            break;
        default:
    }

    const onClickBox = () => {
        console.log("🕹️ 크루 게시글 이동");
        navigate("/CR/Board/Detail/"+boardId)
    }

    return (
        <div>
            <input type='button' id={boardId} hidden onClick={onClickBox}/>
            <label htmlFor={boardId} className='MiniCrewBoardBox'>
                <h2 className='boardType'>{boardType}</h2>
                <h2 className='boardTitle'>{boardTitle}</h2>
            </label>
        </div>
    );
};

export default MiniCrewBoardBox;