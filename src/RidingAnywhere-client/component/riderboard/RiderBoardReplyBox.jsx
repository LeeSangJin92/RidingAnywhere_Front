import React, { useState } from 'react';
import { format } from 'date-fns';

const RiderBoardReplyBox = (props) => {
    console.log(props)
    let replyData = props.replyData;
    let writer = replyData.user;
    let showOption = replyData.user.userId===writer.userId?false:true;
    let profileImg = !writer.userProfile?'/img/mypage/DefaultProfileImg.png':'data:image/png;base64,'+writer.userProfile;
    const [changeMode, setChangeMode] = useState(false);
    const [changeContext,setChangeContext] = useState("");
    const onClickChangeBtn = () => {
        setChangeMode(!changeMode);
        setChangeContext("");
    }
    const insertContext = (props) => {
        setChangeContext(props.target.value);
    }
    const onClickChangeUpBtn = async () => {
        if(!changeContext||changeContext===replyData.commentContext){
            alert("⚠️ 변경되지 않거나 댓글 내용이 없습니다.");
        } else {
            console.log("🛜 댓글 수정 작업 요청");
            await fetch(`https://ridinganywhere.site/RA/BoardDetail/CommentChange?commentId=${replyData.commentId}`,{
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
            }).then(response=>{
                if(response.status===200){
                    console.log("✅ 댓글 수정 완료");
                    alert("✅ 댓글 수정이 완료 되었습니다.");
                    props.loadBoardCommentList();
                    setChangeMode(false);
                }
            })
        }
    }


    return (
        <div className='ReplyBox'>
            <img className='ProfileImg' src={profileImg} alt=''/>
            <div className='ReplyInfoLine'>
                <div className='TopLine'>
                    {replyData.user.userNickname}
                    <div className='TopRight'>
                        <div className='ReplyDateLine'>
                            🗓️{format(new Date(replyData.commentRegdate), "yyyy년 MM월 dd일")}
                        </div>
                        <div className='ReplyBtnLine'>
                            <input className='ReplyChangeBtn' type='button' hidden={showOption} onClick={onClickChangeBtn}/>
                            <input id='Comment' className='ReplyDeleteBtn' type='button' hidden={showOption} onClick={props.onClickDeleteBtn} value={replyData.commentId}/>
                        </div>
                    </div>
                </div>
                <div className='BottomLine'>
                    <text hidden={changeMode}>{replyData.commentContext}</text>
                    <input type='text' placeholder={replyData.commentContext} value={changeContext} className='ChangeReplyContext' onChange={insertContext} hidden={!changeMode}/>
                    <input id={'ReplyChangeUpBtn'+replyData.commentId} className='ReplyChangeUpBtn' onClick={onClickChangeUpBtn} hidden/>
                    <label htmlFor={'ReplyChangeUpBtn'+replyData.commentId} className='ReplyChangeUpLabel' style={!changeMode?{display:'none'}:{display:'flex'}}>수정하기</label>
                </div>
            </div>
        </div>
    );
};

export default RiderBoardReplyBox;