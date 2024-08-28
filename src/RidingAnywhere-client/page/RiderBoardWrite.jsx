import React, { useEffect, useRef, useState } from 'react';
import DefaultHeader from '../component/DefaultHeader_main';
import DefaultFooter from '../component/DefaultFooter';
import '../css/RiderBoardWrite.css';
import DatePicker from '../component/DatePicker';
import QuillEditor from '../component/QuillEditor';
import { useNavigate } from 'react-router-dom';
import NaverMap from '../component/NaverMap';

const RiderBoardWrite = () => {

    // 🛠️ 네비게이션용
    const navigate = useNavigate();

    // 🔎 작성자 정보 확인 (로그인)
    const checkLogin = () => {
        if(!sessionStorage.getItem('accessToken')){
            alert("🚨 로그인이 필요한 페이지입니다. \n - 로그인 페이지로 이동합니다. -");
            navigate("/RA/Login");
        }
    }

    // ✏️ 작성하는 게시글 정보
    const [boardData, setBoardData] = useState({
        boardType:"Free",          // 게시글 타입
        boardTitle:"",         // 게시글 제목
        boardContext:"",       // 게시글 내용
        boardLimit:false,   // 게시글 댓글 제한
        boardDetail:"",        // 게시글 디테일 타입 ex) 사건 종류, 번개 종류, 카테고리
        boardDate:"",          // 게시글 날짜
        boardLocation:""       // 게시글 장소
    });
    
    // ✏️ 게시글 초기값 정보 저장 및 로그인 확인
    const quillRef = useRef(null);
    const [resetData,setResetData]=useState(null);
    useEffect(()=>{
        checkLogin();
        if(boardData) setResetData(boardData);
    },[])

    // 🕹️ 게시글 타입 선택 반응
    const onChangeBoardType = (props) => {
        setBoardData({...resetData,
            boardType:props.target.value,          // 게시글 타입
            boardContext:boardData.boardContext,  // 게시글 내용
            boardTitle:boardData.boardTitle,      // 게시글 제목
            boardDate:boardData.boardDate});      // 게시글 날짜
    }

    // 🕹️ 게시글 제목 입력
    const insertTitle = (props) => {
        setBoardData({...boardData,boardTitle:props.target.value})
    }

    // 🕹️ 게시글 내용 입력
    const insertContext = (data) => {
        setBoardData({...boardData,boardContext:data});
    }

    // 🕹️ 댓글 제한 버튼 반응
    const onClickCommentControlBtn = () => {
        setBoardData({...boardData,boardLimit:!boardData.boardLimit});
    }

    // 🕹️ 게시글 날짜 입력
    const insertDate = (data) => {
        setBoardData({...boardData,boardDate:data});
    }

    // 🕹️ 게시글 디테일 변경 반응
    const [hiddenMechanicMap,setHiddenMechanicMap] = useState(true);
    const onChangeDetail = (data) => {
        setBoardData({...boardData,boardDetail:data.target.value});
        // 🛠️ 정비 맵 버튼 Hidden 설정
        if(boardData.boardType==="Mechanic") setHiddenMechanicMap(data.target.value!=="Center");
    }

    // 🕹️ 게시글 장소 입력
    const [hiddenMap, setHiddenMap] = useState(true);
    const onClickMapBtn = () => {
        setHiddenMap(!hiddenMap);
    }
    const insertLocation = (data) => {
        setBoardData({
            ...boardData,boardLocation:data
        })
    }
    const checkLocationData = () => {
        if(boardData.boardLocation==="") return "🔎 장소 검색";
        else return boardData.boardLocation;
    }

    // 🕹️ 등록 버튼 클릭 반응
    const onClickOkayBtn = () => {
        if(checkData()){
            console.log("🛜 서버 요청");
            fetch("/RA/RequestWriteBoard",{
                headers:{
                    "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                    "Content-Type": "application/json;charset=utf-8"},
                method:"POST",
                body:JSON.stringify(boardData)
            }).then(response=>{
                if(response.status===401){
                    alert("🚨 로그인 정보가 만료되었습니다. \n - 로그인 페이지로 이동합니다. -");
                    navigate("/RA/Login");
                } else if(response.status===200){
                    alert("✅ 게시글이 등록되었습니다.");
                    navigate("/RA/Board");
                }

            })
        };
    }

    // 🔎 데이터 검증 영역
    const checkData = () => {
        console.log(boardData)
        // 1. 기본 검증 진행
        // 1-1) 게시글 제목 검증
        if(boardData.boardTitle.trim().length===0){
            alert("🚨입력한 제목이 없습니다.");
            return false;
        }

        // 1-2) 게시글 내용 검증
        if(quillRef.current.getEditor().getText().trim().length===0){
            alert("🚨입력한 내용이 없습니다.");
            return false;
        }

        // 2. 게시글 타입 별 검증
        switch(boardData.boardType){
            // 사건글 검증
            case "Event" :
                return !((checkBoardDetail("🚨 사건 종류가 선택되지 않았습니다."))||
                         (checkBoardLocation("🚨 사건 장소가 선택되지 않았습니다."))||
                         (checkBoardDate("🚨 사건 날짜가 선택되지 않았습니다.")));

            // 번개글 검증
            case "Driving":
                return !((checkBoardDetail("🚨 배기 조건이 선택되지 않았습니다."))||
                         (checkBoardLocation("🚨 번개 장소가 선택되지 않았습니다."))||
                         (checkBoardDate("🚨 번개 날짜가 선택되지 않았습니다.")));    

            // 정비글 검증
            case "Mechanic":
                return !((checkBoardDetail("🚨 카테고리가 선택되지 않았습니다."))||
                         (boardData.boardDetail==="Center"&&checkBoardLocation("🚨 센터 위치가 선택되지 않았습니다.")));
            default :
            return true;
        }

        // 게시글 디테일 검증
        function checkBoardDetail(alertText){
            if(boardData.boardDetail===""){
                alert(alertText);
                return true;
            }
        }

        // 게시글 장소 검증
        function checkBoardLocation(alertText){
            if(boardData.boardLocation===""){
                alert(alertText);
                return true;
            }
        }

        // 게시글 날짜 검증
        function checkBoardDate(alertText){
            if(boardData.boardDate===""){
                alert(alertText);
                return true;
            }
        }
    }

    // 🕹️ 취소 버튼 클릭 반응
    const onClickCancelBtn = () => {
        navigate('/CR/Board');
    }

    return (
        <main>
            <NaverMap hidden={hiddenMap} mapHiddenControl={onClickMapBtn} insertLocation={insertLocation} setHiddenMap={setHiddenMap}/>
            <DefaultHeader/>
            <section className='RiderBoardWrite'>
                <div className='RiderBoardWriteTop'>
                    <h1>라이더 게시판</h1>
                    <div className='RiderBoardType'>
                        <h2>게시글 종류</h2>
                        <select value={boardData.boardType} onChange={onChangeBoardType}>
                            <option value={"Free"}>🆓자유글</option>
                            <option value={"Event"}>🚨사건글</option>
                            <option value={"Driving"}>⚡번개글</option>
                            <option value={"Mechanic"}>🛠️정비글</option>
                        </select>
                    </div>
                </div>
                <div className='RiderBoardWriteBody'>
                    <div className='BoardWriteArea'>
                        <input type='text' value={boardData.boardTitle} placeholder='게시글 제목을 입력하세요.' onChange={insertTitle}></input>
                        <QuillEditor refData={quillRef} value={boardData.boardContext} onChange={insertContext}/>
                    </div>
                    <div className='BoardOptionArea'>
                        <h1>게시글 설정</h1>
                        <input id='CommitControlBtn' type='checkbox' onClick={onClickCommentControlBtn} hidden></input>
                        
                        {/* 자유글 옵션 */}
                        <div className='BoardOptionBox' style={boardData.boardType==="Free"?{display:"flex"}:{display:"none"}}>
                            <label className='CommentControlBtn' htmlFor='CommitControlBtn'><h2>댓글 제한</h2></label>
                        </div>
                        
                        {/* 사건글 옵션 */}
                        <div className='BoardOptionBox' style={boardData.boardType==="Event"?{display:"flex"}:{display:"none"}}>
                            <div className='EventType'>
                                <h2>사건 종류 : </h2>
                                <select value={boardData.boardDetail} onChange={onChangeDetail}>
                                    <option value={""}>✏️필수 선택</option>
                                    <option value={"Crackdown"}>👮🏻교통 단속</option>
                                    <option value={"Accident"}>⚠️교통 사고</option>
                                    <option value={"RoadCondition"}>👷🏾도로 상태</option>
                                    <option value={"TrafficJam"}>🐢교통 정체</option>
                                </select>
                            </div>
                            <div className='EventLocation'>
                                <h2>사건 장소 : </h2>
                                <input id='EventMap' type='button' onClick={onClickMapBtn} hidden/>
                                <label className='EventMapBtn' htmlFor='EventMap'><h2>{checkLocationData()}</h2></label>
                            </div>
                            <div className='EventDate'>
                                <h2>사건 날짜 : </h2>
                                <DatePicker className='EventDatePicker' placeholderText='날짜 선택' value={boardData.boardDate} onChange={insertDate}/>
                            </div>
                            <label className='CommentControlBtn' htmlFor='CommitControlBtn'><h2>댓글 제한</h2></label>
                        </div>
                        
                        {/* 번개글 옵션 */}
                        <div className='BoardOptionBox' style={boardData.boardType==="Driving"?{display:"flex"}:{display:"none"}}>
                            <div className='DrivingType'>
                                <h2>배기 조건 : </h2>
                                <select value={boardData.boardDetail} onChange={onChangeDetail}>
                                    <option value={""}>✏️필수 선택</option>
                                    <option value={"Fast"}>🏍️고배기 번개</option>
                                    <option value={"All"}>🆓모든 바이크</option>
                                    <option value={"Slow"}>🛵저배기 번개</option>
                                </select>
                            </div>
                            <div className='DrivingLocation'>
                                <h2>번개 장소 : </h2>
                                <input id='DrivingMap' type='button' onClick={onClickMapBtn} hidden/>
                                <label className='DrivingMapBtn' htmlFor='DrivingMap'><h2>{checkLocationData()}</h2></label>
                            </div>
                            <div className='DrivingDate'>
                                <h2>번개 날짜 : </h2>
                                <DatePicker className='DrivingDatePicker' placeholderText='날짜 선택' value={boardData.boardDate} onChange={insertDate}/>
                            </div>
                            <label className='CommentControlBtn' htmlFor='CommitControlBtn'><h2>댓글 제한</h2></label>
                        </div>

                        {/* 정비글 옵션 */}
                        <div className='BoardOptionBox' style={boardData.boardType==="Mechanic"?{display:"flex"}:{display:"none"}}>
                            <div className='MechanicType'>
                                <h2>카테고리 : </h2>
                                <select value={boardData.boardDetail} onChange={onChangeDetail}>
                                    <option value={""}>✏️필수 선택</option>
                                    <option value={"Mechanic"}>🛠️정비 토크</option>
                                    <option value={"Center"}>🏬센터 소개</option>
                                    <option value={"Traction"}>🚚용달 소개</option>
                                </select>
                            </div>
                            <div className='MechanicTypeLocation' style={hiddenMechanicMap?{display:'none'}:{display:'flex'}}>
                                <h2>센터 장소 : </h2>
                                <input id='MechanicMap' type='button' onClick={onClickMapBtn} hidden/>
                                <label className='MechanicMapBtn' htmlFor='MechanicMap'><h2>{checkLocationData()}</h2></label>
                            </div>
                            <label className='CommentControlBtn' htmlFor='CommitControlBtn'><h2>댓글 제한</h2></label>
                        </div> 

                        {/* 게시글 등록&취소 버튼 라인 */}
                        <div className='OkayBtnLine'>
                            <label htmlFor='BoardUploadBtn'><h2>등록</h2></label>
                            <input type='button' id='BoardUploadBtn' onClick={onClickOkayBtn} hidden/>
                            <label htmlFor='BoardCancelBtn'><h2>취소</h2></label>
                            <input type='button' id='BoardCancelBtn' onClick={onClickCancelBtn} hidden/>
                        </div>
                    </div>
                </div>
            </section>
            <DefaultFooter/>
        </main>
    );
};

export default RiderBoardWrite;