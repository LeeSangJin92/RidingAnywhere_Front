import React, { useEffect, useState } from 'react';
import '../css/homepage.css';
import '../css/index.css';
import DefaultFooter from '../component/DefaultFooter';
import OkBtnBox from '../component/OkBtnBox';
import DefaultHeader from '../component/DefaultHeader_main';
import { useNavigate } from 'react-router-dom';
import MiniCrewBoardBox from '../component/homepage/MiniCrewBoardBox';
import MiniRiderBoardBox from '../component/homepage/MiniRiderBoardBox';

const HomePage = () => {

    const navigate = useNavigate();

    // 🪙토큰 확인
    const [accessToken, setAccessToken] = useState(!sessionStorage.getItem('accessToken'))
    const checkData = async () => {
        console.log("🛜 라이더 엑세스 체크 중...")
        if(!accessToken){
            console.log("✅ 접속자에게 엑세스 있음!")
            console.log("🛜 라이더 데이터 확인 중...")
            await fetch("/RA/CheckRider",{headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"}
            }).then(response => {
                if(response.status==200){
                    console.log("✅ 서버 작업 완료")
                    return response.json();
                } else console.log("❌ 서버 통신 실패");
            }).then(response => {
                if(response.status===200) return response.json();
                else if(response.status===401){
                    console.log("❌ 토큰 데이터 만료");
                    alert("⚠️ 로그인 유지 시간 초과 \n - 로그인 페이지로 이동합니다. -");
                    sessionStorage.removeItem('accessToken');
                    navigate('/RA/Login');
                }
            }).then(data => {
                console.log("✅ 라이더 데이터 수집 완료!");
                console.log(data);
                if(data.bikeList.length===0){
                    console.log("⚠️ 입력된 바이크 정보가 없습니다.")
                    alert("⚠️ 등록된 바이크가 없습니다. ⚠️\n - 바이크 등록 페이지로 이동합니다 -")
                    navigate("/RA/AddBike")
                }
                console.log("🔎 가입된 크루 조회 중...");
                if(data.userData.authorityId.authorityId===1){
                    console.log("⚠️ 가입된 크루 없음");
                }else{
                    console.log("✅ 가입된 크루 존재");
                    setJoinCrew(true);
                    loadCrewBoard();
                }
            })
        } else console.log("⛔접속자에게 엑세스 없음")
        loadRiderBoard();
    }

    useEffect(()=>{
        checkData();
    },[])
    
    // ✏️ 게시판 영역 관련 코드
    const [joinCrew, setJoinCrew] = useState(false);
    const [showCrewBoard, setShowCrewBoard] = useState(false);
    const [showRiderBoard, setShowRiderBoard] = useState(false);
    const [riderBoardList, setRiderBoardList] = useState([])
    const [crowBoardList, setCrewBoardList] = useState([{
        boardType:"",
        boardTitle:""
    }]);

    // 🛜 크루 게시글 호출
    const loadCrewBoard = async() => {
        console.log("🛜 크루 게시글 호출중...");
        await fetch("/CR/LoadCrewBoard",{
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"}
            }).then(response=>{
                if(response.status===200) return response.json();
                else return null;
            }).then(data=>{
                setCrewBoardList(data);
                setShowCrewBoard(true);
                console.log(data);
                console.log("✅ 크루 게시글 로드 완료");
            })
    }

    // 🛜 라이더 게시글 호출
    const loadRiderBoard = async() => {
        console.log("🛜 라이더 게시글 호출중...");
        await fetch("/RA/LoadRiderBoard",{
            headers:{"Content-Type": "application/json;charset=utf-8"}
        }).then(response=>{
            if(response.status===200) {
              console.log("✅ 서버 연결 완료");
              console.log(response.json());
              return response.json();
            }
            else if(response.status===401){
              console.log("⚠️ 로그인 토큰 만료");
              alert("🚨 토큰이 만료 되었습니다. \n - 로그인 페이지로 이동합니다. -")
              sessionStorage.removeItem('accessToken');
              navigate("/RA/Login");
            }
          })
          .then(data=>{
            if(data){
                console.log("✅ 라이더 게시글 호출 완료");
                setShowRiderBoard(true);
                setRiderBoardList(data);
                console.log(data);
            }
        });
    }

    return (
        <main>
            <DefaultHeader/>
            <section className='HomeSection'>  {/* 메인 영역 부분*/}
                    <div className='CrewHome'>
                        {/* 🛠️ 가입된 크루 없을 시 블록 처리 */}
                        <div className='BlockCrewBoard' style={joinCrew?{display:'none'}:{display:'flex'}}>
                            <img src='/img/NotJoiningCrew.png' alt=''></img>
                            <h1>가입된 크루가 없습니다.</h1>
                        </div>
                        
                        {/* ✏️ 크루 게시글 목록 */}
                        <div className='MiniCrewBoardArea' style={joinCrew?{display:'flex'}:{display:'none'}}>
                            <h1 className='TitleName'>크루 게시글</h1>
                            <div className='ListHeader'>
                                    <h2 className='boardType'>말머리</h2>
                                    <h2 className='boardTitle'>제목</h2>
                                </div>
                            <div className='ListLine'>
                                <div className='MiniCrewBoardBlock' style={showCrewBoard?{display:"none"}:{display:"flex"}}>
                                    <h1>데이터 준비중...</h1>
                                </div>
                                {crowBoardList.map((boardData,index)=>{
                                    return <MiniCrewBoardBox key={index} boardTitle={boardData.boardTitle} boardType={boardData.boardType} boardId={boardData.boardId}/>
                                })}
                            </div>
                        </div>
                    </div>
                    {/* ✏️ 라이더 게시글 목록 */}
                    <div className='RiderHome'>
                        <div>
                            <h1 className='TitleName'>라이더 게시글</h1>
                            <div className='ListHeader'>
                                <h2 className='boardType'>말머리</h2>
                                <h2 className='boardTitle'>제목</h2>
                            </div>
                            <div className='ListLine'>
                                <div className='MiniRiderBoardBlock' style={showRiderBoard?{display:"none"}:{display:"flex"}}>
                                    <h1>데이터 준비중...</h1>
                                </div>
                                {riderBoardList.map((riderBoardData,index)=>{
                                    return <MiniRiderBoardBox key={index} riderBoardData={riderBoardData}/>
                                })}
                            </div>
                        </div>
                    </div>
            </section>
            
            {/* ✏️ 픽스로 들어가는 태그 및 컴포넌트 */}
            <OkBtnBox title={"테스트 제목"} context={"테스트 내용"}/>
                <DefaultFooter/>
        </main>
    );
};

export default HomePage;