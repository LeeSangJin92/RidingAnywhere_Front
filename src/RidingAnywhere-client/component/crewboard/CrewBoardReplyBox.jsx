import React, { useState } from 'react';

const CrewBoardReplyBox = (props) => {
    let replyData = props.replyData;
    let writer = replyData.commentWriter;
    let showOption = replyData.commentWriter.userId===writer.userId?false:true;
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
            await fetch(`https://ridinganywhere.site/CR/BoardDetail/CommentChange?commentId=${replyData.commentId}`,{
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
        <div className='ReplyBox'>
            <img className='profileImg' src={profileImg} alt=''/>
            <div>
                <div className='TopLine'>
                    <h2 className='commentNickName'>{replyData.commentWriter.userNickname}</h2>
                    <span><h2 className='WriterLevel'>{writerLevel}</h2></span>
                    <div className='commentDateLine'>
                        <h2 className='commentRegDate'>{new Date(replyData.commentRegDate).toLocaleDateString('ko-KR')}</h2>
                        <h2 className='commentRegTime'>{new Date(replyData.commentRegDate).toLocaleDateString('ko-KR',{hour: '2-digit', minute: '2-digit', hour12: false}).match(/\d{1,2}:\d{2}/)[0]}</h2>
                    </div>
                    <div className='commentBtnLine'>
                        <input className='commentChangeBtn' type='button' hidden={showOption} onClick={onClickChangeBtn}/>
                        <input id='Comment' className='commentDeleteBtn' type='button' hidden={showOption} onClick={props.onClickDeleteBtn} value={replyData.commentId}/>
                    </div>
                </div>
                <div className='BottomLine'>
                    <h2 className='ReplyContext' hidden={changeMode}>{replyData.commentContext}</h2>
                    <input type='text' placeholder={replyData.commentContext} value={changeContext} className='ChangeCommentContext' onChange={insertContext} hidden={!changeMode}/>
                    <input id={'ReplyChangeUpBtn'+replyData.commentId} className='ReplyChangeUpBtn' onClick={onClickChangeUpBtn} hidden/>
                    <label htmlFor={'ReplyChangeUpBtn'+replyData.commentId} className='ReplyChangeUpLabel' style={!changeMode?{display:'none'}:{display:'flex'}}><h2>수정하기</h2></label>
                </div>
            </div>
        </div>
    );
};

export default CrewBoardReplyBox;