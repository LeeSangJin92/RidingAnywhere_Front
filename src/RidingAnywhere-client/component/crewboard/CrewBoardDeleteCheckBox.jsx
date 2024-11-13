import React from 'react';
import { useNavigate } from 'react-router-dom';

const CrewBoardDeleteCheckBox = (props) => {

    const navigate = useNavigate();

    let deleteId = props.deleteData.Id;
    let deleteUrl = props.deleteData.Type==="Comment"?
        "/CR/BoardDetail/CommentDelete?commentId=":"/CR/BoardDelete/Board?boardId=";
    const onClickCancelBtn = () => {
        console.log("❌ 삭제 취소")
        props.setDeleteData({Type:"",Id:0});
        props.setShowDeleteBox(false);
    }

    const onClickOkayBtn = async () => {
        console.log("🛜 댓글 삭제 요청");
        await fetch(`${deleteUrl}${deleteId}`,{
            method:"POST",
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"}
        }).then(response=>{
            if(response.status==200){
                console.log("✅ 서버 작업 완료");
                return response.json();
            } else console.log("❌ 서버 작업 실패");
        }).then(data=>{
            if(data){
                console.log("✅ 삭제 성공");
                alert("✅ 삭제되었습니다.");
                if(props.deleteData.Type==="Comment") {
                    props.setDeleteData({Type:"",Id:0});
                    props.setShowDeleteBox(false);
                    props.loadCommentList();
                }
                else navigate("/CR/Board");
            }
        });
    }

    return (
        <div className='CrewBoardDeleteCheckBox' style={props.showDeleteBox?{display:'flex'}:{display:'none'}}>
            <h1>⚠️ 해당 글을 삭제 하시겠습니까?</h1>
            <div className='DeleteBoxBtnLine'>
                {/* 삭제 */}
                <input id='deleteOkayBtn' type='button' onClick={onClickOkayBtn} hidden/>
                <label htmlFor='deleteOkayBtn' className='deleteBtnOkayLabel'><h1>삭제</h1></label>

                {/* 취소 */}
                <input id='deleteCancelBtn' type='button' onClick={onClickCancelBtn} hidden/>
                <label htmlFor='deleteCancelBtn' className='deleteBtnCancelLabel'><h1>취소</h1></label>

            </div>
        </div>
    );
};

export default CrewBoardDeleteCheckBox;