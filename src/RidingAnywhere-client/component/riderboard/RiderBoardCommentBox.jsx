import React, { useState } from 'react';
import { format } from 'date-fns';
import RiderBoardReplyBox from './RiderBoardReplyBox';
import RiderBoardReplyInsertBox from './RiderBoardReplyInsertBox';

const RiderBoardCommentBox = (props) => {
    let userId = props.userId;
    let boardId = props.boardId;
    let commentData = props.commentData;
    let writer = commentData.user;
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
            await fetch(`/RA/BoardDetail/CommentChange?commentId=${commentData.commentId}`,{
                method:"POST",
                headers:{
                    "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                    "Content-Type": "application/json;charset=utf-8"
                },
                body:changeContext
            }).then(response => {
                if(response.status==200){
                    console.log("✅ 서버 작업 완료")
                    return response.json();
                } else console.log("❌ 서버 통신 실패");
            }).then(data=>{
                if(data){
                    console.log("✅ 댓글 수정 완료");
                    alert("✅ 댓글 수정이 완료 되었습니다.");
                    props.loadBoardCommentList();
                    setChangeMode(false);
                }
            })
        }
    }

    return (
        <div className='commentBox' >
            <img className='profileImg' src={profileImg} alt=''/>
            <div>
                <div className='TopLine'>
                    <h2 className='commentNickName'>✏️ {commentData.user.userNickname}</h2>
                    <div className='TopRight'>
                        <div className='commentDateLine'> 
                            <h2 className='commentRegDate'>{format(new Date(commentData.commentRegdate), "yyyy년 MM월 dd일")}</h2>
                        </div>
                        <div className='commentBtnLine'>
                            <input className='commentChangeBtn' type='button' hidden={userId!==writer.userId} onClick={onClickChangeBtn}/>
                            <input id="Comment" className='commentDeleteBtn' type='button' hidden={userId!==writer.userId} onClick={props.onClickDeleteBtn} value={commentData.commentId}/>
                        </div>
                    </div>
                </div>
                <div className='BottomLine'>
                    <h2 className='commentContext' hidden={changeMode}>{commentData.commentContext}</h2>
                    <input type='text' placeholder={commentData.commentContext} value={changeContext} className='ChangeCommentContext' onChange={insertContext} hidden={!changeMode}/>
                    <div className='commentBtnLine'>
                        <input id={'CommentChangeUpBtn'+commentData.commentId} className='CommentChangeUpBtn' onClick={onClickChangeUpBtn} hidden/>
                        <label htmlFor={'CommentChangeUpBtn'+commentData.commentId} className='commentChangeUpLabel' style={!changeMode?{display:'none'}:{display:'flex'}}><h2>수정하기</h2></label>
                        <input id= {"commentReplyBtn"+commentData.commentId} type='button' className='commentReplyBtn' onClick={onClickReplyShowBtn} hidden/>
                        <label htmlFor={"commentReplyBtn"+commentData.commentId}><h2>댓글 작성</h2></label>
                    </div>
                </div>
                <RiderBoardReplyInsertBox setReplyShow={setReplyShow} replyShow={replyShow} commentId={commentData.commentId} loadBoardCommentList={props.loadBoardCommentList} boardId={boardId}/>
                {replyList.map((replyData,index)=><RiderBoardReplyBox key={index} replyData={replyData} loadBoardCommentList={props.loadBoardCommentList} onClickDeleteBtn={props.onClickDeleteBtn}/>)}
            </div>
        </div>
    );
};

export default RiderBoardCommentBox;