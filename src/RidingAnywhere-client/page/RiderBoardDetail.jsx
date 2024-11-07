import React, { useEffect, useState } from 'react';
import DefaultHeader from '../component/DefaultHeader_main';
import DefaultFooter from '../component/DefaultFooter';
import "../css/RiderBoardDetail.css";
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import RiderBoardCommentBox from '../component/riderboard/RiderBoardCommentBox';

const RiderBoardDetail = () => {
    const {boardId} = useParams();
    const navigate = useNavigate();

    // ✏️ 게시글 데이터
    const [boardData, setBoardData] = useState({
        boardId:0,                  // 게시글 Id
        boardTitle : "",            // 게시글 제목
        boardType:"",      // 게시글 타입
        boardContext:"",            // 게시글 내용
        boardWriter:{               // 게시글 작성자 정보
            userId:null,               // 작성자 ID
            userNickName:""         // 작성자 닉네임
        },
        boardDate:"",               // 게시글 날짜
        address:"",              // 게시글 장소
        boardViewCont : 0,          // 게시글 조회수
        boardLimit : true           // 게시글 댓글 제한
    });

    // ✏️ 게시글 댓글 데이터
    const [commentList, setCommentList] = useState([]);

    // ✏️ 댓글 작성 데이터
    const [commentData,setCommentData] = useState({
        board_id:0,         // 게시글 ID
        comment_context:''  // 댓글 내용
    });

    // ✏️ 대댓글 작성 데이터
    const [replyData, setReplyData] = useState({
        board_id:0,           // 게시글 ID
        comment_context:"",      // 대댓글 내용
        comment_id:0          // 상위 댓글 ID
    })


    // ✏️ 댓글 데이터 입력
    const onChangeContext = (props) => {
        setCommentData({
            ...commentData,
            board_id:boardData.boardId,
            comment_context:props.target.value
        });
    }

    // 🔎 댓글 검사
    const onClickUploadBtn = () => {
        if(!commentData.comment_context){
            alert("⚠️ 입력된 댓글이 없습니다.");
        } else upLoadComment(commentData);
    }

    // ✏️ 댓글 작성 영역
    const upLoadComment = async (upLoadData) => {
        console.log(upLoadData);
        console.log("✏️ 댓글 등록 요청");
        if(!sessionStorage.getItem('accessToken')) {
            alert("🚨 로그인이 필요한 기능입니다. \n - 로그인 페이지로 이동합니다 -");
            navigate("/RA/Login");
        } else
        await fetch("https://ridinganywhere.site/RA/BoardDetail/Comment",{
            method:'POST',
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"
            },
            body:JSON.stringify(upLoadData)
        }).then(response => {
            if(response.status===200){
                console.log("✅ 댓글 등록 완료")
                alert("✅ 등록이 완료 되었습니다..");
                setCommentData({...commentData, comment_context:''});
                loadBoardCommentList();
            } else {
                console.log("❌ 서버 통신 실패")
                alert("⚠️ 댓글 등록을 실패 했습니다.")
            };
        })
    }

    // 🕹️ 댓글 화면 컨트롤러
    const [blockComment,setBlockComment] = useState(true);
    const [emptyComment,setEmptyComment] = useState(false);


    // 🔎 로그인 유저의 Id
    const [riderId, setRiderId] = useState(null)

    // 🔎 게시글 내용 가져오기
    const loadBoardData = async () => {
        console.log("🛜 서버로 게시글 데이터 호출")
        await fetch(`https://ridinganywhere.site/RA/BoardDetail/Board?boardId=${boardId}`,{
        }).then(response => {
            if(response.status==200){
                console.log("✅ 서버 작업 완료")
                return response.json();
            } else console.log("❌ 서버 통신 실패");
        }).then(data=>{
            if(data){
                console.log(data)
                console.log("✅ 서버 게시글 데이터 호출")
                let boardDate = format(new Date(data.boardDate), "yyyy년 MM월 dd일") // 날짜 포맷 적용

                setBoardData({
                    boardId : data.boardId,                // 게시글 Id
                    boardTitle : data.boardTitle,           // 게시글 제목
                    boardType: typeName(data.boardType),    // 게시글 타입
                    boardContext: data.boardContext,        // 게시글 내용
                    boardWriter:{                           // 게시글 작성자 정보
                        userId:data.user.userId,            // 작성자 ID
                        userNickName:data.user.userNickname // 작성자 닉네임
                    },
                    boardDate:boardDate,                    // 게시글 날짜
                    address:data.boardLocation,             // 게시글 장소
                    boardViewCont : data.boardCnt,          // 게시글 조회수
                    boardLimit : data.boardLimit            // 게시글 댓글 제한
                });
            }

            function typeName(typeData){
                switch(typeData){
                    case "Free" :
                        return "🆓자유글";
                    case "Event" :
                        return "🚨사건글";
                    case "Driving" :
                        return "⚡번개글";
                    case "Mechanic" :
                        return "🛠️정비글";
                    default:
                }
            }

        }).then(loadRiderInfo).then(loadBoardCommentList);
    }

    // 🛜 게시글 댓글 불러오기
    const loadBoardCommentList = async () => {
        console.log("🛜 게시글 댓글 요청");
        await fetch(`https://ridinganywhere.site/RA/BoardDetail/CommentList?board=${boardId}`,{
        }).then(response => {
                if(response.status===200){
                    console.log("✅ 서버 작업 완료")
                    return response.json();
                } else {
                    alert("⚠️ 댓글 등록을 실패했습니다.");
                    console.log("❌ 서버 통신 실패");
                };
        }).then(data=>{
            if(data){
                console.log("💾 게시글 댓글 수집");
                setCommentList(data);
                setBlockComment(false);
                setEmptyComment(false);
            }
        })
    }

    const loadRiderInfo = async () => {
        console.log("🛜 라이더 정보 요청");
        if(sessionStorage.getItem('accessToken'))
        await fetch("https://ridinganywhere.site/RA/CheckRider",
            {headers:{
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
            "Content-Type": "application/json;charset=utf-8"}
        }).then(response => {
            if(response.status==200){
                console.log("✅ 서버 작업 완료")
                return response.json();
            } else console.log("❌ 서버 통신 실패");
        }).then(data => {
            if(data){
                console.log("✅ 접속중인 라이더");
                setRiderId(data.userData.userId);
                console.log(data);
            };
        });
        else console.log("⚠️ 비접속 라이더");
     }

    useEffect(()=>{
        loadBoardData();
    },[])

    // 🛠️ 브라우저 관련 변수
    const [changeMode, setChangeMode] = useState(false);

    // 🕹️ 수정 버튼 클릭 반응
    const onClickChangeBtn = () => {
        console.log("🛠️ 게시글 수정 모드");
        setChangeMode(!changeMode);
    }

    // 🕹️ 삭제 버튼 클릭 반응
    const onClickDeleteBtn = () => {
        console.log("🕹️ 게시글 삭제 클릭");
    }

    return (
        <main className='Main_RiderBoardDetail'>
             <DefaultHeader/>
            <section className='RiderBoardDetail'>
                <div className='PageTopLine'>
                    <div className='PageTitle'>
                        <h1>라이더 게시판</h1>
                        <h1>{boardData.boardType}</h1>
                    </div>
                    <div className='BoardTitleLine'>
                        <div className='TitleTopLine'>
                            <input type='button' id='writerInfoBtn' hidden/>
                            <label htmlFor='writerInfoBtn' className='BoardWriterInfo'>
                                <h1>✏️{boardData.boardWriter.userNickName}</h1>
                            </label>
                            <div className='BoardInfoBox'>
                                <div className='BoardInfoBox_Top'>
                                    <h2>🗓️{boardData.boardDate}</h2>
                                    <div className='BoardInfoBox_Right'>
                                        <h2 className='BoardType_Short'>{boardData.boardType}</h2>
                                        <div className='boardControl' style={riderId===boardData.boardWriter.userId?{display:"flex"}:{display:"none"}}>
                                            <input type='button' id='boardChangeBtn' onClick={onClickChangeBtn}/>
                                            <input type='button' id='boardDeleteBtn' onClick={onClickDeleteBtn}/>
                                        </div>
                                    </div>
                                </div>
                                <input type='button' id='boardAddressBtn' hidden/>
                                <label htmlFor='boardAddressBtn' className='BoardAddressInfo' style={boardData.address?{display:"flex"}:{display:"none"}}>
                                    <h2>🚩{boardData.address}</h2>
                                </label>
                            </div>
                        </div>
                        <h1>{boardData.boardTitle}</h1>
                    </div>
                </div>
                <div className='PageBodyLine'>
                    <div className='BoardContext' dangerouslySetInnerHTML={{__html:boardData.boardContext}}>
                    </div>
                </div>

                {/* 게시글 댓글 관련 영역 */}
                    <div className='PageCommentLine'>

                        {/* 댓글 목록 영역 */}
                        <div className='CommentListLine'>

                            {/* 댓글 클릭 방지용 블록 */}
                            <div className='loadingBlock' style={blockComment?{display:"flex"}:{display:"none"}}>
                                <h2>🔎 댓글을 불러오는 중입니다.</h2>
                                <h2>- 잠시만 기달려 주세요 -</h2>
                            </div>

                            {/* 등록 댓글 없을 경우 표시 되는 블록 */}
                            <div className='commentEmptyNote' style={emptyComment?{display:'flex'}:{display:'none'}}>
                                <h2>⚠️ 등록된 댓글이 없습니다.</h2>
                            </div>

                            {/* 게시글 댓글 목록 라인 */}
                            <div className='CommentList' style={!emptyComment?{display:'flex'}:{display:'none'}}>
                                {commentList.map((commentData,index) => {
                                if(!commentData.commentReply) 
                                    return <RiderBoardCommentBox key={index} loadBoardCommentList={loadBoardCommentList} commentData={commentData} replyList={commentList.filter(
                                        comment=>comment.commentReply&&comment.commentReply.commentId===commentData.commentId)} 
                                        userId={riderId} boardId={boardId} onClickDeleteBtn={onClickDeleteBtn}/>;
                                else return null;
                                })}
                            </div>
                        </div>

                        {/* 게시글 댓글 입력 라인 */}
                        <div className='commentInputLine'>
                            <h2>댓글 내용 : </h2>
                            <input type='text' className='commentTextBox' onChange={onChangeContext} value={commentData.comment_context}/>
                            <input id='commentUploadBtn' type='button' onClick={onClickUploadBtn} hidden/>
                            <label htmlFor='commentUploadBtn' className='commentUploadBtn'>댓글 등록</label>
                        </div>
                    </div>
            </section>
             <DefaultFooter/>
        </main>
    );
};

export default RiderBoardDetail;