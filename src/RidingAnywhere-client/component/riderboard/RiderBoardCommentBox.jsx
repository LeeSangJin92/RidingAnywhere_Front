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
            await fetch(`https://ridinganywhere.site/RA/BoardDetail/CommentChange?commentId=${commentData.commentId}`,{
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


    // 댓글 박스 영역
    return (
        <div className='CommentBox'>
            <div className='CommentInfoLine'>
                <div className='Comment'>

                    {/* 댓글 옵션 버튼 label용 input 태그 */}
                    <input id={'CommentChangeUpBtn'+commentData.commentId} onClick={onClickChangeUpBtn} hidden/>
                    <input id= {"CommentReplyBtn"+commentData.commentId} type='button' onClick={onClickReplyShowBtn} hidden/>

                    {/* 기본 댓글 박스 */}
                    <div className='DefaultCommentBox'>
                        {/* 댓글 작성자 프로필 이미지 */}
                        <img className='ProfileImg' src={profileImg} alt=''/>
                        
                        {/* 댓글 정보 영역 */}
                        <div className='CommentInfo'>
                            
                            {/* 댓글 박스 탑라인 */}
                            <div className='CommentInfo_Top'>
                                {/* 작성자 닉네임 */}
                                <text>✏️{commentData.user.userNickname}</text>
                                <div className='CommentInfo_TopSub'>
                                    {/* 댓글 작성 날짜 */}
                                    <text>🗓️{format(new Date(commentData.commentRegdate), "yyyy년 MM월 dd일")}</text>
                                    {/* 댓글 옵션 버튼 라인 */}
                                    <div className='CommentBtnLine'>
                                        <input className='ChangeBtn' type='button' hidden={userId!==writer.userId} onClick={onClickChangeBtn}/>
                                        <input id="Comment" className='DeleteBtn' type='button' hidden={userId!==writer.userId} onClick={props.onClickDeleteBtn} value={commentData.commentId}/>
                                    </div>
                                </div>
                            </div>

                            {/* 댓글 박스 바텀라인 */}
                            <div className='CommentInfo_Bottom'>
                                <text hidden={changeMode}>{commentData.commentContext}</text>
                                <input type='text' placeholder={commentData.commentContext} value={changeContext} className='ChangeCommentContext' onChange={insertContext} hidden={!changeMode}/>
                                <div className='CommentBtnLine'>
                                    <label htmlFor={'CommentChangeUpBtn'+commentData.commentId} className='CommentChangeUpBtn' style={!changeMode?{display:'none'}:{display:'flex'}}>수정하기</label>
                                    <label htmlFor={"CommentReplyBtn"+commentData.commentId} className='CommentReplyBtn'>댓글 작성</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 축소모드 댓글 박스 */}
                    <div className='ShortCommentBox'>
                        <text hidden={changeMode}>{commentData.commentContext}</text>
                        <input type='text' placeholder={commentData.commentContext} value={changeContext} className='ChangeCommentContext' onChange={insertContext} hidden={!changeMode}/>
                        <div className='CommentBtnLine'>
                            <label htmlFor={'CommentChangeUpBtn'+commentData.commentId} className='CommentChangeUpBtn' style={!changeMode?{display:'none'}:{display:'flex'}}>수정하기</label>
                            <label htmlFor={"CommentReplyBtn"+commentData.commentId} className='CommentReplyBtn'>댓글 작성</label>
                        </div>
                    </div>
                </div>
                <RiderBoardReplyInsertBox setReplyShow={setReplyShow} replyShow={replyShow} commentId={commentData.commentId} loadBoardCommentList={props.loadBoardCommentList} boardId={boardId}/>
            </div>

            {/* 대댓글 라인 */}
            <div className='CommentReplyLine'>
                {replyList.map((replyData,index)=><RiderBoardReplyBox key={index} replyData={replyData} loadBoardCommentList={props.loadBoardCommentList} onClickDeleteBtn={props.onClickDeleteBtn}/>)}
            </div>
        </div>
    );
};

export default RiderBoardCommentBox;