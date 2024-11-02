import React, {useState } from 'react';
import DefaultHeader from '../component/DefaultHeader_main';
import DefaultFooter from '../component/DefaultFooter';
import DatePicker from '../component/DatePicker';
import '../css/crewBoardWrite.css';
import { useNavigate } from 'react-router-dom';
import QuillEditor from '../component/QuillEditor';

const CrewBoardWrite = () => {

    // 🛠️ 네비게이션용
    const navigate = useNavigate();

    // ✏️ 게시판 종류 변수
    const [optionControl, setOptionControl] = useState("Note");

    // 🛠️ 게시판 내용 변수
    const [boardData, setBoardData] = useState({
        emergencyNote : false,
        boardTitle : "",
        boardContext : "",
        startDate : "",
        endDate : "",
        memberCount : 2,
        address : "",
        boardType:"Note"
    });

    // 🛠️ 게시판 종류 설정 반응
    const changeType = (data) => {
        setOptionControl(data.target.value);
        setBoardData({      // 데이터 초기화
            ...boardData,
            emergencyNote : false,
            startDate : "",
            endDate : "",
            memberCount : 2,
            address : "",
            boardType : data.target.value
        });
        setDateEqual(false);
    }

    // 🕹️ 게시판 데이터 입력
    const insertBoardData = (data) => {
        console.log(boardData);
            switch(data.target.className){
                case "WriteTitle":          // ✏️ 게시글 제목
                    setBoardData({...boardData,boardTitle:data.target.value});
                    break;
                case "TourAddress":         // ✏️ 모임 주소
                    setBoardData({...boardData,address:data.target.value});
                    break;
                case "emergencyNoteBtn":    // ✏️ 공지 긴급 사항
                    setBoardData({...boardData,emergencyNote:data.target.checked});
                    break;
                default:
            }
    }

    // 🕹️ 게시판 내용 입력 (Quill)
    const insertBoardContext = (data) => {
        console.log(data);
        setBoardData({...boardData,boardContext:data})
    }

    // 🕹️ 게시판 날짜 입력
    const onChangeStartDate = (data)=>{
        dateEqual&&setBoardData({...boardData,startDate:data, endDate:data})
        !dateEqual&&setBoardData({...boardData,startDate:data})
    }
    const onChangeEndDate = (data)=>{
        setBoardData({...boardData,endDate:data})
    }

    // 🛠️ 시작 날짜, 종료 날짜 동일 버튼
    const [dateEqual, setDateEqual] = useState(false)
    const clickDateEqualBtn = (data) => {
        let dateEqualBtn = data.target;
        setDateEqual(!dateEqual)
        dateEqualBtn.checked&&setBoardData({...boardData,endDate:boardData.startDate});
        !dateEqualBtn.checked&&setBoardData({...boardData,endDate:""});
    }

    // ✏️ 데이터 검증에 필요한 정규표현식 데이터
    const boardRegExp = {
        "boardTitle" : new RegExp('^(\\S).+'),
        "boardContext" : new RegExp('^(\\S).+'),
        "address" : new RegExp('^(\\S).+')
    };

    // 🛠️ 서버 요청 전 데이터 검증
    const clickOkayBtn = () => {
        console.log("🕹️ 등록 버튼 클릭")
        console.log("🔎 데이터 검증 중...")
        let isPass = true;
        Object.keys(boardData).map(boardDataKey => {
            if(isPass){
                // 🛠️ 게시판 종류에 따른 검증 절차 우선 진행
                switch(optionControl){
                    case "Note" : 
                        checkDate(boardDataKey);
                        checkText(boardDataKey);
                            break;

                    case "Tour" :
                        checkDate(boardDataKey);
                        checkText(boardDataKey);
                            break;
                    default :
                }
            }
            return null;
        });
        isPass&&writeBoardRequest();

        function checkText(textKey){
            if(textKey==="boardTitle"||textKey==="boardContext"){
                if(!boardRegExp[textKey].test(boardData[textKey])){
                    alert("⚠️ 작성된 내용을 확인해주세요");
                    isPass=false;
                }
            }
        }
        
        function checkDate(dateKey) {
            switch(dateKey){
                case "endDate" :
                case "startDate" :
                    if(!boardData[dateKey]){
                        isPass=false;
                        alert("⚠️ 날짜를 확인해주세요!")
                    }
                    break;
                default:
            }
        }
    }
    const writeBoardRequest = async () => {
        console.log("🛜서버로 게시글 작성 요청");
        await fetch("https://ridinganywhere.site/CR/RequestWriteBoard",{
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"},
            method:"POST",
            body:JSON.stringify(boardData)
        }).then(response => {
            if(response.status==200){
                console.log("✅ 서버 작업 완료")
                return response.json();
            } else console.log("❌ 서버 통신 실패");
        }).then(data=>{
            if(data){
                switch(optionControl){
                    case "Note":
                        alert("😁 공지글이 등록되었습니다")
                        break;
                    case "Tour":
                        alert("😁 모임글이 등록되었습니다.")
                        break;
                    case "Free":
                        alert("😁 자유글이 등록되었습니다.")
                        break;
                    case "Greetings":
                        alert("😁 인사말이 등록되었습니다.")
                        break;
                    default:
                }
            console.log("✅ 게시글 등록 완료")
            navigate("/CR/Board");
            }
        });
    }

    const onClickCancelBtn = () => {
        navigate('/CR/Board');
    }


    return (
        <main className='Main_CrewBoardWrite'>
            <DefaultHeader/>
                    <section className='CrewBoardWrite'>
                        <div className='WriteTop'>
                            <h1>크루 게시판</h1>
                            <div className='WriteOptionLine'>
                                <h2>게시글 종류</h2>
                                <select value={optionControl} className='BoardType' onChange={changeType}>
                                    <option value={'Note'}>공지글</option>
                                    <option value={'Tour'}>모임</option>
                                    <option value={'Free'}>자유글</option>
                                    <option value={'Greetings'}>인사말</option>
                                </select>
                            </div>
                        </div>
                        <div className='WriteBody'>
                            <input type='button' id='BoardUploadBtn' onClick={clickOkayBtn} hidden/>
                            <input type='button' id='BoardCancelBtn' onClick={onClickCancelBtn} hidden/>
                            <div className='OkayBtnLine_Slim'>
                                <label htmlFor='BoardUploadBtn'><h2>등록</h2></label>
                                <label htmlFor='BoardCancelBtn'><h2>취소</h2></label>
                            </div> 
                            <div className='BoardWriteBox'>
                                <input type='text' className='WriteTitle' placeholder='제목을 입력하세요' value={boardData.boardTitle} onChange={insertBoardData}/>
                                <QuillEditor value={boardData.boardContext} onChange={insertBoardContext}/>
                            </div>
                            <div className='WriteOptionBox' >
                                <input type='checkbox' id='DateEqualBtn' onClick={clickDateEqualBtn} hidden/>
                                <div className='Option' id='Note' style={optionControl==='Note'?{display:'flex'}:{display:'none'}}>
                                    <input type='checkbox' id='emergencyNoteBtn' className='emergencyNoteBtn' onClick={insertBoardData} hidden/>
                                    <label htmlFor='emergencyNoteBtn' className='EmergencyNoteLabel'>
                                    <span>긴급 공지</span>
                                    </label>
                                    <div className='TimeLine'>
                                        <h2>공지 기간</h2>
                                        <label htmlFor='DateEqualBtn' className='NoteDateEqualLabel'>
                                        <span>날짜 동일</span>
                                    </label>
                                    </div>
                                    <div className='TimeLine'>
                                        <DatePicker placeholderText='시작 날짜' onChange={onChangeStartDate} value={boardData.startDate}/>
                                        <DatePicker placeholderText='종료 날짜' onChange={onChangeEndDate} value={boardData.endDate} disabled={dateEqual}/>
                                    </div>
                                </div>
                                <div className='Option' id='Tour' style={optionControl==='Tour'?{display:'flex'}:{display:'none'}}>
                                    <div className='TimeLine'>
                                        <h2>모임 일정</h2>
                                        <label htmlFor='DateEqualBtn' className='TourDateEqualLabel'>
                                            <span>날짜 동일</span>
                                        </label>
                                    </div>
                                    <div className='TimeLine'>
                                        <DatePicker placeholderText='시작 날짜' onChange={onChangeStartDate} value={boardData.startDate}/>
                                        <DatePicker placeholderText='종료 날짜' onChange={onChangeEndDate} value={boardData.endDate} disabled={dateEqual}/>
                                    </div>
                                    <div className='CountMemberLine'>
                                        <h2>참석 인원</h2>
                                        <input type='number' min={2} max={100} className='TourOptionInput' id='CountMember' defaultValue={2}/>
                                        <h2>명</h2>
                                    </div>
                                    <h2>모임 장소</h2>
                                    <input type='text' className='TourAddress' id='TourAddress' value={boardData.address} placeholder='모임 장소를 입력해주세요!' onChange={insertBoardData}/>
                                </div>
                                <div className='Option' id='Free' style={optionControl==='Free'?{display:'flex'}:{display:'none'}}>
                                    <h2>설정 가능 옵션 없음</h2>
                                </div>
                                <div className='Option' id='Greetings' style={optionControl==='Greetings'?{display:'flex'}:{display:'none'}}>
                                    <h2>설정 가능 옵션 없음</h2>
                                </div> 
                                <div className='OkayBtnLine_Wide'>
                                    <label htmlFor='BoardUploadBtn'><h2>등록</h2></label>
                                    <label htmlFor='BoardCancelBtn'><h2>취소</h2></label>
                                </div> 
                            </div>
                        </div>
                </section>
            <DefaultFooter/>
        </main>
    );
};

export default CrewBoardWrite;