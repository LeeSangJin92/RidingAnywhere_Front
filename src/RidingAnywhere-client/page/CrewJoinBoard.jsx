import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultFooter from '../component/DefaultFooter';
import DefaultHeader from '../component/DefaultHeader_main';
import "../css/CrewJoinBoard.css"
import CrewJoiner from '../component/crewwjoinboard/CrewJoiner';
import CrewJoinOk from '../component/crewwjoinboard/CrewJoinOk';


// 크루 가입 게시판
const CrewJoinBoard = () => {

    const navigate = useNavigate();

    // 🛠️ 창 관리용 블록
    const [showUpOkBox,setShowUpBox] = useState(false);

    // 🛠️ 크루 정보 박스 관리용 블록
    const [showUpInfoBlock,setShowUpInfoBlock] = useState(true);
 

    // ✏️ 지역 관련 데이터 변수
    const [addressList, setAddressList] = useState([]);
    const [cityList, setCityList] = useState([""])

    // 🔐 토큰 체크
    const [accessToken] = useState(!sessionStorage.getItem('accessToken'));

     // 😎 라이더 정보
     const [riderInfo, setriderInfo] = useState({
        userEmail : "",
        userName : "",
        userNickname : "",
        userBirthday : "",
        userGender : "",
        userPhone : "",
        userAddressCity:"",
        userAddressTown:"",
        userAuthority:"",
        crewId:0,
     });

     // 😎 라이더가 가입된 크루 정보
     const [riderCrewInfo, setRiderCrewInfo] = useState({
        CrewId:0,           // 크루 아이디
        CrewName:"",        // 크루 이름
        CrewMaster:"",      // 크루 마스터 닉네임
        CrewCity:"",        // 크루 활동 도시
        CrewTown:"",        // 크루 활동 지역
        CrewCount:0,        // 크루 회원 인원
        CrewContext:""      // 크루 인사말
     })

     // 👪 크루 정보 박스 데이터
     const [crewInfo,setCrewInfo] = useState({
        CrewId:0,           // 크루 아이디
        CrewName:"",        // 크루 이름
        CrewMaster:"",      // 크루 마스터 닉네임
        CrewCity:"",        // 크루 활동 도시
        CrewTown:"",        // 크루 활동 지역
        CrewCount:0,        // 크루 회원 인원
        CrewContext:""      // 크루 인사말
     })

    //  ✏️ 모든 크루 리스트 목록
    const [crewList, setCrewList] = useState([]);
     

    // 🛠️ 크루 가입 버튼 (활성화 / 비활성화)
    const [joinBtn, setJoinBtn] = useState({backgroundImage:"url('/img/crewjoin/JoinBtnOff.png')"});
    const joinBtnController = (control) => {
        control&&setJoinBtn({backgroundImage:"url('/img/crewjoin/JoinBtnOn.png')"});
        !control&&setJoinBtn({backgroundImage:"url('/img/crewjoin/JoinBtnOff.png')"});
    }
    // 🛠️ 페이지 로딩 후 1회 실행해야하는 사항들
    useEffect(()=>{checkData()},[]);

    // 🛠️ 페이지 로드에 필요한 데이터 가져오기
    const checkData = async () => {
        console.log("🛜 라이더 엑세스 체크 중...")
        if(!accessToken){
            console.log("✅ 접속자에게 엑세스 있음!")
            console.log("🛜 라이더 데이터 확인 중...")
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
                    console.log("✅ 라이더 데이터 수집 완료!");
                    let userData = data.userData;
                    setCrewAddress({
                        CrewCity:userData.address.city,
                        CrewTown:userData.address.town
                    });
                    if(!data.crewId){
                            console.log("❌ 가입된 크루 없음");
                            setriderInfo({
                                ...riderInfo,
                                userEmail : userData.userEmail,
                                userName : userData.userName,
                                userNickname : userData.userNickname,
                                userBirthday : userData.userBirthday,
                                userGender : userData.userGender,
                                userPhone : userData.userPhone,
                                userAddressCity : userData.address.city,
                                userAddressTown : userData.address.town,
                                userAuthority : userData.authorityId.authority_name,
                                crewId:0
                            });
                            joinBtnController(true)
                            return 0;
                        }
                    else{
                        console.log("✅ 가입된 크루 존재");
                        setriderInfo({
                            ...riderInfo,
                            userEmail : userData.userEmail,
                            userName : userData.userName,
                            userNickname : userData.userNickname,
                            userBirthday : userData.userBirthday,
                            userGender : userData.userGender,
                            userPhone : userData.userPhone,
                            userAddressCity : userData.address.city,
                            userAddressTown : userData.address.town,
                            userAuthority : userData.authorityId.authority_name,
                            crewId:data.crewId
                        });
                        joinBtnController(false);
                        return data.crewId;
                    }
                }}).then(async (crewId)=>{
                if(!!crewId){
                console.log("🛜 가입된 크루 데이터 호출중...")
                await fetch("https://ridinganywhere.site/CR/LoadCrewData",{
                        headers:{
                            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                            "Content-Type": "application/json;charset=utf-8"},
                        method:"POST",
                        body:JSON.stringify(crewId)
                    }).then(response => {
                        if(response.status==200){
                            console.log("✅ 서버 작업 완료")
                            return response.json();
                        } else console.log("❌ 서버 통신 실패");
                    }).then(data=>{
                        if(data){
                            let crewInfoData = {
                                CrewId:data.crewId,                     // 크루 아이디
                                CrewName:data.crew_name,                // 크루 이름
                                CrewMaster:data.user.userNickname,      // 크루 마스터 닉네임
                                CrewCity:data.crew_location.city,       // 크루 활동 도시
                                CrewTown:data.crew_location.town,       // 크루 활동 지역
                                CrewCount:data.crew_count,              // 크루 회원 인원
                                CrewContext:data.crew_context           // 크루 인사말
                            }
                            setRiderCrewInfo(crewInfoData);
                            setCrewInfo(crewInfoData);
                            setCrewAddress({
                                CrewCity:data.crew_location.city,
                                CrewTown:data.crew_location.town
                            });
                            setShowUpInfoBlock(false);
                            console.log("🛠️ 크루 데이터 저장 완료")
                        }})}
                    return crewId;
                }).then(async (crewId)=>{
                    console.log("🛜 모든 크루 리스트 요청")
                    await fetch("https://ridinganywhere.site/CR/CrewAllData")
                    .then(response => {
                        if(response.status==200){
                            console.log("✅ 서버 작업 완료")
                            return response.json();
                        } else console.log("❌ 서버 통신 실패");
                    }).then(data=>{
                        if(data){
                            console.log("🛠️ 크루 리스트 저장중...");
                            let crewList = data.map(data=>{
                                return {
                                     CrewId:data.crew_id,
                                     CrewName:data.crew_name,                // 크루 이름
                                     CrewMaster:data.user.userNickname,      // 크루 마스터 닉네임
                                     CrewCity:data.crew_location.city,       // 크루 활동 도시
                                     CrewTown:data.crew_location.town,       // 크루 활동 지역
                                     CrewCount:data.crew_count,              // 크루 회원 인원
                                     CrewContext:data.crew_context           // 크루 인사말
                                 }
                             })
                            setCrewList(crewList);
                            console.log("✅ 크루 리스틑 저장 완료");
                        }})
                }).then(async ()=>{
                console.log("🛜 지역 데이터 요청");
                await fetch("https://ridinganywhere.site/RA/AddressData")
                .then(response => {
                    if(response.status==200){
                        console.log("✅ 서버 작업 완료")
                        return response.json();
                    } else console.log("❌ 서버 통신 실패");
                }).then(data=>{
                    if(data){
                        console.log("🛠️지역 데이터 저장중...");
                        setAddressList(data);
                        setCityList([...new Set(data.map(data=>data.city))]);
                        console.log("✅지역 데이터 작업 완료");
                    }
                });
            })
        } else {
            console.log("⛔ 접속자에게 엑세스 없음");
            alert("⚠️로그인이 필요합니다.⚠️\n - 로그인 페이지로 이동합니다. - ")
            console.log("🛠️ 로그인 페이지로 이동")
            navigate("/RA/login");
        }
    }

    // 🛠️ 크루 리스트 지역 필터용 데이터
    const [crewAddress,setCrewAddress] = useState({
        CrewCity:"",
        CrewTown:""
    })

    // 🛠️ 크루 지역 필터 설정
    const changeFilter = (prop) => {
        let filterData = prop.target
        if(filterData.name==="CrewCity"){
            setCrewAddress({
                CrewCity:filterData.value,
                CrewTown:""
            })
        } else {
            setCrewAddress({
                ...crewAddress,
                CrewTown:filterData.value
            })
        }
    }

    // 🛠️ 크루 가입 신청
    const clickJoinBtn = () =>{
        console.log("🕹️ 가입 버튼 클릭")
        if(!!riderInfo.crewId){
            console.log("❌ 가입된 크루 존재");
            alert("⚠️이미 크루에 가입되어 있습니다.");
        } else {
            console.log("🛠️ 크루 가입 신청");
            setShowUpBox(true);
        }
    }

    // 🛠️ 크루 가입 요청
    const requestJoin = async () => {
        console.log("🛜 크루 가입 요청중...")
        await fetch("https://ridinganywhere.site/CR/RequestCrewJoin",{
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"},
            method:"POST",
            body:JSON.stringify(crewInfo.CrewId)
        }).then(response => {
            if(response.status==200){
                console.log("✅ 서버 작업 완료")
                return response.json();
            } else console.log("❌ 서버 통신 실패");
        }).then(data=>{
            if(data){
                console.log("✅ 크루 가입 응답 성공");
                setShowUpBox(false);
                checkData();
            } else console.log("❌ 크루 가입 응답 실패");
        })    
    }

    // 🛠️ 크루 정보 박스 닫기 (브러우저 사이즈가 1200 미만 시 활성화)
    const closeInfoBoxBtn = () => {
        console.log("🕹️크루 정보 박스 닫기");
        document.getElementsByClassName("CrewInfoBox")[0].style.display="none";
    }



    return (
        <main className='Main_CrewJoinBoard'>
            <DefaultHeader/>
            <section className='CrewJoinBoard'>
                <div className='CrewJoinBoardBlock' style={showUpOkBox?{display:'flex'}:{display:'none'}}>
                    <CrewJoinOk setShowUpBox={setShowUpBox} crewName={crewInfo.CrewName} requestJoin={requestJoin}/>
                </div>
                <div className='CrewInfoBox'>
                    <input type='button' className='CrewInfoBoxCloseBtn' onClick={closeInfoBoxBtn}/>
                    <div className='CrewInfoBox_Block' style={showUpInfoBlock?{display:"flex"}:{display:"none"}}>
                        <h1>크루를 선택해주세요</h1>
                    </div>
                    <div className='CrewInfoBox_Top'>
                        <h1>{crewInfo.CrewName}</h1>
                        <label htmlFor='JoinBtn' className='JoinBtnLabel' style={joinBtn} onClick={clickJoinBtn}/>
                        <input id='JoinBtn' style={{display:'none'}}/>
                    </div>
                    <div className='CrewInfoBox_Main'>
                        <div>
                            <h2>크루 마스터</h2>
                            <h2>{crewInfo.CrewMaster}</h2>
                        </div>
                        <div>
                            <h2>크루 인원</h2>
                            <h2>😎 {crewInfo.CrewCount}명</h2>
                        </div>
                        <div>
                            <h2>활동 장소</h2>
                            <h2>{crewInfo.CrewCity} / {crewInfo.CrewTown}</h2>
                        </div>
                    </div>
                    <div className='CrewInfoBox_Bottom'>
                        <h1>크루 인사말</h1>
                        <h2 className='CrewContextBox'>{crewInfo.CrewContext}</h2>
                    </div>
                </div>
                <div className='CrewListBox'>
                    <div className='CrewListBox_Top'>
                        <div className='CrewNameSearchBoxLine'>
                            <input type='text' className='CrewNameSearchBox' placeholder='✏️ 찾고 싶은 크루 이름을 입력하세요'/>
                            <input type='button' className='CrewNameSearchBtn'/>
                        </div>
                        <div className='CrewAddressBoxLine'>
                            <select name='CrewCity' className='selectCity' value={crewAddress.CrewCity} onChange={changeFilter}>
                                {cityList.map((data,index)=>(<option key={index} value={data}>{data}</option>))}</select>
                            <select name='CrewTown' className='selectTown' value={crewAddress.CrewTown} onChange={changeFilter}>
                                <option value={""}>전체</option>
                                {addressList.filter(data=>data.city===crewAddress.CrewCity).map((data,index)=>(<option key={index} value={data.town}>{data.town}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className='CrewListBox_Section'>
                        {/* ✏️ 가입되어 있는 크루가 맨위로 올라오도록 설정 */}
                        {!!riderInfo.crewId&&<CrewJoiner setCrewInfo={setCrewInfo} crewData={riderCrewInfo} setShowUpInfoBlock={setShowUpInfoBlock}/>}

                        {/* 활동 도시 전체 선택 시 */}
                        {!crewAddress.CrewTown&&crewList.filter(crew=>{
                            if((crew.CrewId!==riderInfo.crewId)&&(crew.CrewCity===crewAddress.CrewCity)&&(crewAddress.CrewTown==="")){
                                return crew;
                            }
                            }).map((crew,index)=>(<CrewJoiner setCrewInfo={setCrewInfo} key={index} crewData={crew} setShowUpInfoBlock={setShowUpInfoBlock}/>))}
                        
                        {/* 활동 도시 선택 시 */}
                        {!!crewAddress.CrewTown&&crewList.filter(crew=>{
                            if((crew.CrewId!==riderInfo.crewId)&&(crew.CrewCity===crewAddress.CrewCity)&&(crewAddress.CrewTown===crew.CrewTown)){
                                return crew;
                            }
                            }).map((crew,index)=>(<CrewJoiner setCrewInfo={setCrewInfo} key={index} crewData={crew} setShowUpInfoBlock={setShowUpInfoBlock}/>))}
                    </div>
                </div>
            </section>
            <DefaultFooter/>
        </main>
    );
};

export default CrewJoinBoard;