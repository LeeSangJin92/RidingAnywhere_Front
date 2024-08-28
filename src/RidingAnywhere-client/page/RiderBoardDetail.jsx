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
        boardTitle : "테스트 제목라인",            // 게시글 제목
        boardType:"🆓 자유글",      // 게시글 타입
        boardContext:"",            // 게시글 내용
        boardWriter:{               // 게시글 작성자 정보
            userId:null,               // 작성자 ID
            userNickName:"테스트닉"         // 작성자 닉네임
        },
        boardDate:"2024년 12월 31일 금요일",               // 게시글 날짜
        address:"서울시 관악구 신림동 87-28",              // 게시글 장소
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
        await fetch("/RA/BoardDetail/Comment",{
            method:'POST',
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"
            },
            body:JSON.stringify(upLoadData)
        }).then(response => {
            if(response.status===200){
                alert("✅ 등록이 완료 되었습니다..");
                setCommentData({...commentData, comment_context:''});
                loadBoardCommentList();
            } else {
                response.status!==200&&alert("❌ 등록을 실패 했습니다..");}
        })
    }

    // 🕹️ 댓글 화면 컨트롤러
    const [blockComment,setBlockComment] = useState(true);
    const [emptyComment,setEmptyComment] = useState(false);


    // 🔎 로그인 유저의 Id
    const [riderId, setRiderId] = useState(null)

    // 🔎 게시글 내용 가져오기
    const loadBoardData = async () => {
        console.log(boardId);
        console.log("🛜 서버로 게시글 데이터 호출")
        await fetch(`/RA/BoardDetail/Board?boardId=${boardId}`,{}).then(response=>{
            if(response.status===200) return response.json(); 
            else {alert("실패");
                return null;
            }
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
        await fetch(`/RA/BoardDetail/CommentList?board=${boardId}`,{})
        .then(response=>{
            if(response.status===200) return response.json();
            else console.log("🚨 게시글 댓글 요청");
        }).then(data=>{
            if(data){
                console.log("✅ 게시글 댓글 요청");
                setCommentList(data);
                setBlockComment(false);
                setEmptyComment(false);
            }
        })
    }

    const loadRiderInfo = async () => {
        console.log("🛜 라이더 정보 요청");
        if(sessionStorage.getItem('accessToken'))
        await fetch("/RA/CheckRider",
            {headers:{
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
            "Content-Type": "application/json;charset=utf-8"}})
            .then(response=>{
                if(response.status===200){
                    console.log("✅ 라이더 정보 요청");
                    return response.json();
                } else {
                    console.log(response.status)
                    console.log("🚨 로그인 데이터 오류");
                    alert("🚨 로그인 정보 오류 발생\n로그인 페이지로 이동합니다.");
                    navigate("/RA/Login");
                    return null;}
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
        console.log(boardId);
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
        <main>
             <DefaultHeader/>
            <section className='RiderBoardDetail'>
                <div className='PageTopLine'>
                    <div className='PageTitle'>
                        <h1>라이더 게시판</h1>
                        <h1>{boardData.boardType}</h1>
                    </div>
                    <div className='BoardTitleLine'>
                        <div>
                            <input type='button' id='writerInfoBtn' hidden/>
                            <label htmlFor='writerInfoBtn'>
                                <h1>✏️ {boardData.boardWriter.userNickName}</h1>
                            </label>
                            <div>
                                <div className='RightTopBox'>
                                    <h2>{boardData.boardDate}</h2>
                                    <div className='boardControl' style={riderId===boardData.boardWriter.userId?{display:"flex"}:{display:"none"}}>
                                        <input type='button' id='boardChangeBtn' onClick={onClickChangeBtn}/>
                                        <input type='button' id='boardDeleteBtn' onClick={onClickDeleteBtn}/>
                                    </div>
                                </div>
                                <input type='button' id='boardAddressBtn' hidden/>
                                <label htmlFor='boardAddressBtn' style={boardData.address?{display:"flex"}:{display:"none"}}>
                                    <h2>🚩 {boardData.address}</h2>
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

                {/* 댓글 영역 */}
                    <div className='PageCommentLine'>
                        <div className='commentList'> {/* 댓글 목록 */}
                            <div className='loadingBlock' style={blockComment?{display:"flex"}:{display:"none"}}>
                                <h1>🔎 댓글을 불러오는 중입니다.</h1>
                                <h1>- 잠시만 기달려 주세요 -</h1>
                            </div>
                            <div className='commentEmptyNote' style={emptyComment?{display:'flex'}:{display:'none'}}>
                                <h1>⚠️ 등록된 댓글이 없습니다.</h1>
                            </div>
                            <div className='commentListLine' style={!emptyComment?{display:'flex'}:{display:'none'}}>
                                {commentList.map((commentData,index) => {
                                if(!commentData.commentReply) 
                                    return <RiderBoardCommentBox key={index} loadBoardCommentList={loadBoardCommentList} commentData={commentData} replyList={commentList.filter(
                                        comment=>comment.commentReply&&comment.commentReply.commentId===commentData.commentId)} 
                                        userId={riderId} boardId={boardId} onClickDeleteBtn={onClickDeleteBtn}/>;
                                else return null;
                                })}
                            </div>
                        </div>
                        <div className='commentInputLine'>
                            <h2>댓글 내용 : </h2>
                            <input type='text' className='commentTextBox' onChange={onChangeContext} value={commentData.comment_context}/>
                            <input id='commentUploadBtn' type='button' className='commentUploadBtn' onClick={onClickUploadBtn} hidden/>
                            <label htmlFor='commentUploadBtn'><h2>댓글 등록</h2></label>
                        </div>
                    </div>
            </section>
             <DefaultFooter/>
        </main>
    );
};

export default RiderBoardDetail;