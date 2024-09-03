import React, { useState } from 'react';
import CrewBoardReplyBox from './CrewBoardReplyBox';
import CrewBoardReplyInsertBox from './CrewBoardReplyInsertBox';

const CrewBoardCommentBox = (props) => {
    let userId = props.userId;
    let boardId = props.boardId;
    let commentData = props.commentData;
    let writer = commentData.commentWriter;
    let profileImg = !writer.userProfile?'/img/mypage/DefaultProfileImg.png':'data:image/png;base64,'+writer.userProfile;
    let replyList = !props.replyList?[]:props.replyList;

    const [changeMode, setChangeMode] = useState(false);
    const [changeContext,setChangeContext] = useState("");
    const [replyShow, setReplyShow] = useState(false);

    const onClickChangeBtn = () => {
        setChangeMode(!changeMode);
        setChangeContext("");
    }

    const onClickReplyShowBtn = () => {
        setReplyShow(!replyShow);
    }

    const insertContext = (props) => {
        setChangeContext(props.target.value);
    }
    const onClickChangeUpBtn = async () => {
        if(!changeContext||changeContext===commentData.commentContext){
            alert("⚠️ 변경되지 않거나 댓글 내용이 없습니다.");
        } else {
            console.log("🛜 댓글 수정 작업 요청");
            props.connect_Api(`/CR/BoardDetail/CommentChange?commentId=${commentData.commentId}`,{
                method:"POST",
                headers:{
                    "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                    "Content-Type": "application/json;charset=utf-8"
                },
                body:changeContext
            }).then(data=>{
                if(data){
                    console.log("✅ 댓글 수정 완료");
                    alert("✅ 댓글 수정이 완료 되었습니다.");
                    props.loadCommentList();
                    setChangeMode(false);
                }
            })
        }
    }

    

    let writerLevel = '';
        switch(writer.authorityId.authorityName){
            case "ROLE_CREW_Master" : 
                writerLevel = "마스터"
                break;
            case "ROLE_CREW_Member" :
                writerLevel = "멤버"
                break;
            case "ROLE_RA_ADMIN" :
                writerLevel = "관리자";
                break;
            default:
        }

    return (
        <div className='commentBox' >
            <img className='profileImg' src={profileImg} alt=''/>
            <div>
                <div className='TopLine'>
                    <h2 className='commentNickName'>{commentData.commentWriter.userNickname}</h2>
                    <span><h2 className='WriterLevel'>{writerLevel}</h2></span>
                    <div className='commentDateLine'>
                        <h2 className='commentRegDate'>{new Date(commentData.commentRegDate).toLocaleDateString('ko-KR')}</h2>
                        <h2 className='commentRegTime'>{new Date(commentData.commentRegDate).toLocaleDateString('ko-KR',{hour: '2-digit', minute: '2-digit', hour12: false}).match(/\d{1,2}:\d{2}/)[0]}</h2>
                    </div>
                    <div className='commentBtnLine'>
                        <input className='commentChangeBtn' type='button' hidden={userId!==writer.userId} onClick={onClickChangeBtn}/>
                        <input id="Comment" className='commentDeleteBtn' type='button' hidden={userId!==writer.userId} onClick={props.onClickDeleteBtn} value={commentData.commentId}/>
                    </div>
                </div>
                <div className='BottomLine'>
                    <h2 className='commentContext' hidden={changeMode}>{commentData.commentContext}</h2>
                    <input type='text' placeholder={commentData.commentContext} value={changeContext} className='ChangeCommentContext' onChange={insertContext} hidden={!changeMode}/>
                    <input id={'CommentChangeUpBtn'+commentData.commentId} className='CommentChangeUpBtn' onClick={onClickChangeUpBtn} hidden/>
                    <label htmlFor={'CommentChangeUpBtn'+commentData.commentId} className='commentChangeUpLabel' style={!changeMode?{display:'none'}:{display:'flex'}}><h2>수정하기</h2></label>
                    <input id= {"commentReplyBtn"+commentData.commentId} type='button' className='commentReplyBtn' onClick={onClickReplyShowBtn} hidden/>
                    <label htmlFor={"commentReplyBtn"+commentData.commentId}><h2>댓글 작성</h2></label>
                </div>
                <CrewBoardReplyInsertBox setReplyShow={setReplyShow} replyShow={replyShow} commentId={commentData.commentId} loadCommentList={props.loadCommentList} boardId={boardId} connect_Api={props.connect_Api}/>
                {replyList.map((replyData,index)=><CrewBoardReplyBox key={index} replyData={replyData} loadCommentList={props.loadCommentList} onClickDeleteBtn={props.onClickDeleteBtn} connect_Api={props.connect_Api}/>)}
            </div>
        </div>
    );
};

export default CrewBoardCommentBox;