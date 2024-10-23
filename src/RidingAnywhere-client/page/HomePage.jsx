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
    const [accessToken, _] = useState(!sessionStorage.getItem('accessToken'))
    const checkData = async () => {
        console.log("🔍라이더 토큰 체크")
        if(!accessToken){
            console.log("✅라이더 토큰 발견")
            console.log("🛜라이더 서버 요청")
            await fetch("https://ridinganywhere.site/RA/CheckRider",{headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"}
            }).then(response => {
                if(response.status===200) {
                    console.log("✅라이더 서버 응답")
                    return response.json();
                }
                else if(response.status===401){
                    console.log("❌라이더 토큰 만료");
                    alert("⚠️로그인 유지 시간 초과 \n - 로그인 페이지로 이동합니다. -");
                    sessionStorage.removeItem('accessToken');
                    navigate('/RA/Login');
                }
            }).then(data => {
                console.log("✅라이더 서버 응답");
                console.log("🔍바이크 정보 조회")
                if(data.bikeList.length===0){
                    console.log("❌바이크 정보 없음")
                    alert("⚠️등록된 바이크가 없습니다.⚠️\n - 바이크 등록 페이지로 이동합니다 -")
                    navigate("/RA/AddBike")
                }
                console.log("✅바이크 정보 확인")
                console.log("🔎크루 ID 조회");
                if(data.userData.authorityId.authorityId===1){
                    console.log("❌크루 ID 없음");
                }else{
                    console.log("✅크루 ID 확인");
                    setJoinCrew(true);
                    loadCrewBoard();
                }
            })
        } else console.log("⛔라이더 토큰 없음")
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
        console.log("🛜크루 게시글 요청");
        await fetch("https://ridinganywhere.site/CR/LoadCrewBoard",{
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"}
            }).then(response=>{
                if(response.status===200) {
                    console.log("✅크루 게시글 응답");
                    return response.json();
                }
                else {
                    console.log("❌크루 게시글 실패");
                }
            }).then(data=>{
                if(data){
                    setCrewBoardList(data);
                    console.log("💾크루 게시글 수집")
                    setShowCrewBoard(true);
                }
            })
    }

    // 🛜 라이더 게시글 호출
    const loadRiderBoard = async() => {
        console.log("🛜라이더 게시글 요청");
        await fetch("https://ridinganywhere.site/RA/LoadRiderBoard",{
            headers:{"Content-Type": "application/json;charset=utf-8"}
        }).then(response=>{
            if(response.status===200) {
              console.log("✅라이더 게시글 응답");
              return response.json();
            }
            else if(response.status===401){
                console.log("❌라이더 토큰 만료");
              alert("🚨 토큰이 만료 되었습니다. \n - 로그인 페이지로 이동합니다. -")
              sessionStorage.removeItem('accessToken');
              navigate("/RA/Login");
            }
          })
          .then(data=>{
            if(data){
                setRiderBoardList(data);
                console.log("💾라이더 게시글 수집");
                setShowRiderBoard(true);
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