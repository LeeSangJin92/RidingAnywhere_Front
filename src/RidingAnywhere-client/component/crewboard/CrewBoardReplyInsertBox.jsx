import React, { useState } from 'react';

const CrewBoardReplyInsertBox = (props) => {

    // 대댓글 영역
    const [replyContext, setReplyContext] = useState("");

    const dataInsert = (inputTag) => {
        setReplyContext(inputTag.target.value);
    }
    const onClickUpLoadBtn = async () => {
        console.log("🛜 대댓글 등록 요청");
        if(!replyContext){
            alert("⚠️ 입력된 댓글이 없습니다.")
        } else {
            await fetch(`https://ridinganywhere.site/CR/BoardDetail/CommentReply?commentId=${props.commentId}&boardId=${props.boardId}`,{
                method:"POST",
                headers:{
                    "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                    "Content-Type": "application/json;charset=utf-8"
                },
                body:replyContext
            }).then(response => {
                if(response.status==200){
                    console.log("✅ 서버 작업 완료")
                    return response.json();
                } else console.log("❌ 서버 통신 실패");
            }).then(data => {
                if(data){
                    console.log("✅ 대댓글 등록 완료");
                    alert("✅ 댓글 등록이 완료 되었습니다.")
                    props.setReplyShow(false);
                    props.loadCommentList();
                }
            })
        }
    }
    const onClickCancelBtn = () => {
        setReplyContext("");
        props.setReplyShow(!props.replyShow);
    }

    return (
        <div className='CrewBoardReplyInsertBox' style={props.replyShow?{display:'flex'}:{display:'none'}}>
                <h2>테스트닉</h2>
                <div>
                    <input type='text' className='ReplyContextBox' onChange={dataInsert} value={replyContext}/>
                    <input id={'uploadReplyBtn'+props.commentId} onClick={onClickUpLoadBtn} hidden/>
                    <label htmlFor={'uploadReplyBtn'+props.commentId} className='uploadReplyBtn'><h2>등록</h2></label>
                    <input type='button' className='replyCancelBtn' onClick={onClickCancelBtn}/>
                </div>
        </div>
    );
};

export default CrewBoardReplyInsertBox;