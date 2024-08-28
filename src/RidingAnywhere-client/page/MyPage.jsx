import React, { useEffect, useState } from 'react';
import DefaultHeader from '../component/DefaultHeader_main';
import DefaultFooter from '../component/DefaultFooter';
import BikeInfoBox from '../component/mypage/BikeInfoBox';
import "../css/mypage.css"
import { useNavigate } from 'react-router-dom';

const MyPage = () => {

    const navigate = useNavigate();

     // 🪙 토큰 확인
     const [accessToken] = useState(!sessionStorage.getItem('accessToken'))

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
     })

    // 🤝 크루 정보
    const [crewInfo, setcrewInfo] = useState({
        crew_context:"",
        crew_count:0,
        crew_city:"",
        crew_town:"",
        crew_name:"",
        crew_master:"",
        crew_regdata:"",
    })

    useEffect(()=>{
        checkData();
        resetBtnAct();
    },[])

     // ✏️ 토큰으로 라이더 정보 가져오기
     const checkData = async () => {
        console.log("🛜라이더 엑세스 체크 중...")
        if(!accessToken){
            console.log("✅접속자에게 엑세스 있음!")
            console.log("🛜라이더 데이터 확인 중...")
            await fetch("/RA/CheckRider",
            {headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"}})
            .then(response => {
                if(response.status===200) return response.json();
                else if(response.status===401){
                    console.log("❌ 토큰 데이터 만료");
                    alert("⚠️ 로그인 유지 시간 초과 \n - 로그인 페이지로 이동합니다. -");
                    sessionStorage.removeItem('accessToken');
                    navigate('/RA/Login');
                }
            }).then(data => {
                console.log("✅라이더 데이터 수집 완료!");
                let userData = data.userData;
                setriderInfo({...riderInfo,
                    userEmail : userData.userEmail,
                    userName : userData.userName,
                    userNickname : userData.userNickname,
                    userBirthday : userData.userBirthday,
                    userGender : userData.userGender,
                    userPhone : userData.userPhone,
                    userAddressCity : userData.address.city,
                    userAddressTown : userData.address.town,
                });
                !!userData.userProfile&&setprofile('data:image/png;base64,'+userData.userProfile);
                if(data.bikeList.length===0){
                    console.log("⛔ 바이크 저장 이력 없음")
                    alert("⚠️입력된 바이크 정보가 없습니다.⚠️\n - 바이크 추가 페이지로 이동합니다. - ")
                    console.log("🛠️ 바이크 추가 페이지로 이동")
                    navigate("/RA/Addbike");
                }
                else {
                    setbikeInfo(data.bikeList.map((data,index)=>{
                        const bikeData = {
                            bike_index:index,
                            bike_id:data.bikegarage_id,
                            bike_year:data.bike_year,
                            bike_cc:data.bikeModel.model_cc,
                            bike_select:data.bike_select,
                            model_name:data.bikeModel.model_name,
                            bikebrand_logo:data.bikeModel.bikebrand_id.bikebrand_logo,
                        }
                        return bikeData
                    }))
                    console.log("바이크 데이터 수집 완료")}
                if(!!data.crewId) {
                    console.log("🔎 크루 데이터 감지")
                    return data.crewId;}
                else {console.log("❌ 가입된 크루 없음"); return;}
            }).then(crewId=>{
                if(!crewId) return;
                console.log("🛜 서버로 크루 데이터 로드 요청")
                fetch("/CR/LoadCrewData",{
                    method:"POST",
                    headers:{
                        "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body:JSON.stringify(crewId)
                }).then(response=>{
                    console.log("✅ 서버 수신 완료")
                    if(response.status===200){
                        console.log("✅ 크루 데이터 받기 완료");
                        return response.json();
                    } else console.log("❌ 크루 데이터 호출 실패");
                }).then(data=>{
                    console.log("수신 받은 데이터");
                    console.log(data)
                    setcrewInfo({
                        crew_context:data.crew_context,
                        crew_count:data.crew_count,
                        crew_city:data.crew_location.city,
                        crew_town:data.crew_location.town,
                        crew_name:data.crew_name,
                        crew_master:data.user.userNickname,
                        crew_regdata:data.crew_regdate,
                    })
                })
            })
        } else {
            console.log("⛔ 접속자에게 엑세스 없음");
            alert("⚠️로그인이 필요합니다.⚠️\n - 로그인 페이지로 이동합니다. - ")
            console.log("🛠️ 로그인 페이지로 이동")
            navigate("/RA/login");
        }
    }

    // 📷 프로필 이미지 관련 라인
    const [profile,setprofile] = useState(null)
    const profileimg = data => {
       const imagefile = data.target.files[0];
       const imageUrl = URL.createObjectURL(imagefile);
       setprofile(imageUrl);
       console.log(imagefile)
       updateImg(imagefile);
   }

   const updateImg = async (data) => {
        console.log("🛜변경 내용 서버로 전달...")
        const imgData = new FormData()
        imgData.append('file',data);
       await fetch("/RA/UpdateImage",
       {   
        method: "POST",
        headers:{
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`},
        body:imgData
    }).then(response=>{
        console.log("✅요청 수신 완료!");
        console.log(response);
        console.log("✅ 이미지 변경이 완료 되었습니다.")
        if(response.status===200) return response.json();
    }).then(data=>{
        console.log(data)
    }).catch(error=>{
        console.log(error);
    })
   }
    
    // 🛠️ 수정되는 라이더 정보
    const [updateRider, setUpdateRider] = useState({
        userEmail : "",
        userNickname : "",
        userName : "",
        userPhone : "",
        userBirthday : "",
        userAddressCity : "",
        userAddressTown :"",
        userGender : false
     })

    // 🛠️ 라이더 정보 수정
    const [changeBtnAct, setchangeBtn] = useState("/img/mypage/ChangeBtn.png"); // 수정, 취소 버튼 설정 변수
    const [updateBtnAct, setcheckBtn] = useState({});     // 저장On, 저장Off, 불가 버튼 설정 변수

     // 🛠️ 라이더 정보 리셋
    const resetBtnAct = () => {
        setcheckBtn({
            userNickname:"/img/mypage/SaveBtnOff.png",
            userName:"/img/mypage/SaveBtnOff.png",
            userPhone:"/img/mypage/SaveBtnOff.png",
            userBirthday:"/img/mypage/SaveBtnOff.png",
            userGender:"/img/mypage/SaveBtnOff.png",
            userAddress:"/img/mypage/SaveBtnOff.png"
        })
    }

    // 프로필 수정 관련 태그 출력 설정 변수
    const [showinput, setinput] = useState(false)       
    const profileControl = () => {
        switch(changeBtnAct){

            // ✏️ 라이더 정보 수정 시작
            case "/img/mypage/ChangeBtn.png" : 
                console.log("🛠️개인정보 수정 중...");
                setinput(true)
                reSetData();
                resetBtnAct();
                setchangeBtn("/img/mypage/CancelBtn.png");
                break;

             // ✏️ 라이더 정보 수정 취소
            case "/img/mypage/CancelBtn.png" : 
                console.log("❌개인정보 수정 취소!");
                setinput(false)
                setchangeBtn("/img/mypage/ChangeBtn.png");
                break;
            default :
        }
    }

    // ✏️ 지역 리스트
    const [addressList, setAddressList] = useState([]);
    const [cityList, setCityList] = useState([""])

    // 🔎 지역 데이터 호출
    useEffect(()=>{
        console.log("🛜지역 데이터 요청중...")
        fetch("/RA/AddressData")
        .then((response)=>{
            console.log("✅지역 데이터 요청 완료");
            if(response.status===200) return response.json();
            else console.log("❌지역 데이터 호출 실패!")
        }).then((data)=>{
            console.log("🛠️지역 데이터 저장중...");
            setAddressList(data);
            setCityList([...new Set(data.map(data=>data.city))]);
            console.log("✅지역 데이터 작업 완료")
        })
    },[])

    // 🛠️ 지역 설정 범위
    const selectCity = (props) => {
        console.log("✅ 라이더의 도시 변경");
        setUpdateRider({...updateRider,userAddressCity:props.target.value,userAddressTown:""});
        setcheckBtn({...updateBtnAct,userAddress:"/img/mypage/SaveBtnOff.png"});
    }

    const selectTown = (props) => {
        console.log("✅ 라이더의 마을 변경");
        console.log(updateRider);
        setUpdateRider({...updateRider,userAddressTown:props.target.value});
        setcheckBtn({...updateBtnAct,userAddress:riderInfo.userAddressTown!==props.target.value?"/img/mypage/SaveBtnOn.png":"/img/mypage/SaveBtnOff.png"});
    }


    const checkUpdata = (line) => {
        console.log("✏️ 변경 내용 체크 중...");
        switch(updateBtnAct[line.target.name]){
            // ✏️ 라이더 정보 수정 불가
            case "/img/mypage/DeniedBtn.png" :
                console.log("❌변경 불가판정!")
                alert("❌변경 내용이 적절하지 않습니다!")
                break;

            // ✏️ 라이더 정보 수정 가능
            case "/img/mypage/SaveBtnOn.png" :
                console.log("✅검수 완료!")
                riderDataUpdate(line.target.name);
                break;

            // ✏️ 라이더 정보 수정 사항 없음
            case "/img/mypage/SaveBtnOff.png" :
                console.log("⚠️수정 사항 없음!")
                alert("⚠️수정되지 않았습니다.")
                break;
            default :
        }
    }

    // ✏️ 변경된 유저데이터 서버로 전송
    const riderDataUpdate = async (update) => {
        console.log("🛜변경 내용 서버로 전달...")
        let requsetData = update!=="userAddress"?
        {...riderInfo,[update]:updateRider[update]}:
        {...riderInfo,userAddressCity:updateRider.userAddressCity,
        userAddressTown:updateRider.userAddressTown}
        console.log(requsetData);
        await fetch("/RA/UpdateUser",
            {   
                method: "POST",
                headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"},
                body:JSON.stringify(requsetData)
            })
                .then(response=>{
                    console.log("✅변경 내용 수신 완료")
                    if(response.status===200)return response.json();
                    else console.log("❌ 데이터 수정 실패!")
                }).then(()=>{
                    console.log("✅데이터 변경 완료!");
                    console.log("🛜유저 데이터 재호출!");
                    checkData();
                    if(update!=="userGender"&&update!=="userAddress")
                        document.getElementById([update]).value = "";
                    setcheckBtn({...updateBtnAct,[update]:"/img/mypage/SaveBtnOff.png"});
                })
    }


    // ✏️ 수정 시 모든 업데이트 데이터 초기화
    const reSetData = () => {
        setUpdateRider(riderInfo);
        document.getElementById('userName').value = "";
        document.getElementById('userNickname').value = "";
        document.getElementById('userBirthday').value = "";
        document.getElementById('userPhone').value = "";
    }

    // ✏️ 라이더 정보 관련 정규표현식 데이터
    const mapRegExp = {
        "userNickname" : new RegExp('^([A-Za-z\\d\\uAC00-\\uD7A3\\u3131-\\u314E]){1,8}$'),
        "userName" : new RegExp('^([가-힣]){3,4}$'),
        "userPhone" : new RegExp('^(010+[\\d]{8,8})$'),
        "userBirthday" : new RegExp('^([\\d]){8,8}$')
    };

    // 🛠️ 수정하는 데이터 입력 받기
    const insertData = (inputData) => {
        let key = inputData.target.name;
        let value = inputData.target.value;
        setUpdateRider({...updateRider,[key]:value});
        if(value===riderInfo[key]) setcheckBtn({...updateBtnAct,[key]:"/img/mypage/SaveBtnOff.png"});
        else if(mapRegExp[key].test(value)) setcheckBtn({...updateBtnAct,[key]:"/img/mypage/SaveBtnOn.png"});
        else setcheckBtn({...updateBtnAct,[key]:"/img/mypage/DeniedBtn.png"});
    }

    // 🛠️ 성별 데이터 설정하기
    const insertGender = (genderBtn) => {
        let data = genderBtn.target.value==='true'
        setUpdateRider({...updateRider,userGender:data});
        if(data===riderInfo.userGender) setcheckBtn({...updateBtnAct,userGender:"/img/mypage/SaveBtnOff.png"});
        else setcheckBtn({...updateBtnAct,userGender:"/img/mypage/SaveBtnOn.png"});
    }

    // 🏍️ 오토바이 정보
    const [bikeInfo, setbikeInfo] = useState()

    // 🛠️ 바이크 관련 정보 설정 범위
    // 보여지고 있는 바이크 index
    const [showBike,setShowBike] = useState(0)
    const [boxtransform,setTransform] = useState({transform:'translateX(40%)'})
    // 대표 바이크의 index
    const [selectBike, setSelectBike] = useState(0)
    
    const bikeControl = (btn) => {
        let resultIndex = btn.target.id==="showBikeUp"?showBike+1:showBike-1;
        if(resultIndex>=0&&bikeInfo.length-1>=resultIndex) {
            setShowBike(resultIndex)
            setBikeSelectBtn(bikeInfo[resultIndex].bike_select?{backgroundImage:"url('/img/mypage/BikeSelectBtnOff.png')"}:{backgroundImage:"url('/img/mypage/BikeSelectBtnOn.png')"})
            setBikeDeleteBtn(bikeInfo[resultIndex].bike_select?{backgroundImage:"url('/img/mypage/BikeDeleteBtnOff.png')"}:{backgroundImage:"url('/img/mypage/BikeDeleteBtnOn.png')"})
        }
    }

    // 🛠️ 바이크 설정 관련 버튼 배경이미지
    const [bikeAddBtn, setBikeAddBtn] = useState({backgroundImage:"url('/img/mypage/BikeAddBtnOn.png')"})
    const [bikeSelectBtn, setBikeSelectBtn] = useState({backgroundImage:"url('/img/mypage/BikeSelectBtnOff.png')"})
    const [bikeDeleteBtn, setBikeDeleteBtn] = useState({backgroundImage:"url('/img/mypage/BikeDeleteBtnOff.png')"})

    useEffect(()=>{
        if(!!bikeInfo){
            setBikeAddBtn(bikeInfo.length<5?{backgroundImage:"url('/img/mypage/BikeAddBtnOn.png')"}:{backgroundImage:"url('/img/mypage/BikeAddBtnOff.png')"})
            setShowBike(bikeInfo.map(data=>data.bike_select).indexOf(true));
            setSelectBike(bikeInfo.map(data=>data.bike_select).indexOf(true))
        }
    },[bikeInfo])

    // 🛠️ 바이크 박스 위치 설정
    useEffect(()=>{
        switch(showBike){
            case 0 :
                setTransform({transform:'translateX(40%)'})
                break;
            case 1 :
                setTransform({transform:'translateX(20%)'})
                break;
            case 2 :
                setTransform({transform:'translateX(0%)'})
                break;
            case 3 :
                setTransform({transform:'translateX(-20%)'})
                break;
            case 4 :
                setTransform({transform:'translateX(-40%)'})
                break;
            default :
        }},[showBike])

    // ➕ 바이크 추가하기
    const bikeAdd = () => {
        if(bikeInfo.length+1<=5) navigate("/RA/Addbike");
        else alert("⚠️신규 바이크를 추가 하실 수 없습니다.⚠️\n- 바이크는 최대 5개까지만 저장이 가능합니다. - ");
    }

    // 🛠️ 대표 바이크로 선택하기
    const bikeSelect = async () => {
        if(bikeInfo[selectBike].bike_id===bikeInfo[showBike].bike_id) alert("⚠️이미 대표로 선정된 바이크 입니다.⚠️")
        else {
            console.log("🛠️ 대표 바이크 수정 작업")
            let requestData = {
                beforBikeId:bikeInfo[selectBike].bike_id,
                afterBikeId:bikeInfo[showBike].bike_id
            }
            console.log("🛜 서버 작업 진행중...")
            await fetch("/RA/SelectBike",
            {   
                method: "POST",
                headers:{
                    "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                    "Content-Type": "application/json;charset=utf-8"},
                body:JSON.stringify(requestData)
            }).then(response=>{
                if(response.status===200) console.log("✅ 대표 바이크 수정 완료");
                else console.log("❌ 대표 바이크 수정 실패");
                checkData();
                setBikeSelectBtn({backgroundImage:"url('/img/mypage/BikeSelectBtnOff.png')"});
                setBikeDeleteBtn({backgroundImage:"url('/img/mypage/BikeDeleteBtnOff.png')"});
            })
        }
    }

    // 🗑️ 바이크 제거
    const bikeDelete = async () => {
        console.log("🛠️ 바이크 제거 작업 중...")
        if(bikeInfo[showBike].bike_select) alert("⚠️ 대표 바이크는 제거가 불가능합니다.⚠️")
        else {
            let deleteBikeId = {bikegarage_id:bikeInfo[showBike].bike_id}
            await fetch("/RA/DeleteBike",
            {
                method: "POST",
                headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"},
                body:JSON.stringify(deleteBikeId)
            }).then(response=>{
                if(response.status===200) {
                    console.log("✅ 바이크 제거 완료");
                    return response.json();
                }
            else console.log("❌ 바이크 삭제 작업 실패");    
            }).then(data=>{
                setbikeInfo(data.map((data,index)=>{
                    const bikeData = {
                        bike_index:index,
                        bike_id:data.bikegarage_id,
                        bike_year:data.bike_year,
                        bike_cc:data.bikeModel.model_cc,
                        bike_select:data.bike_select,
                        model_name:data.bikeModel.model_name,
                        bikebrand_logo:data.bikeModel.bikebrand_id.bikebrand_logo,
                    }
                    return bikeData
                }));
                setBikeSelectBtn({backgroundImage:"url('/img/mypage/BikeSelectBtnOff.png')"});
                setBikeDeleteBtn({backgroundImage:"url('/img/mypage/BikeDeleteBtnOff.png')"});
            })
        }
    }


    return (
        <main>
            <DefaultHeader/>
            <section className='myPage'>

                <div className='page_tile'>
                    <h1>마이 페이지</h1>
                </div>
                <div className='myInfoLine'>
                    {/* ✏️ 라이더 프로필 범위 */}
                    <div className='profile'>
                        <div className='profile_top'>
                            <h1>프로필</h1>
                            <div className='profile_changeLine'>
                                {/* 수정, 취소 버튼 라인 */}
                                <label id='profile_changeLine' htmlFor='profile_changebtn'><img src={changeBtnAct} alt=''></img></label>
                                <input type='button' className='profile_changebtn' id='profile_changebtn' style={{display:'none'}} onClick={profileControl}/>
                            </div>
                        </div>
                        <div className='profile_seccsion'>
                            <div className='riderInfo_left'>
                                <div className='profile_img'>
                                    <div className='profile_img_box'>
                                        <img src={profile===null?'/img/mypage/DefaultProfileImg.png':profile} alt=''/>
                                    </div>
                                    <label id='prfile_btnLline' htmlFor="profilebtn" style={showinput?{display:'block'}:{display:'none'}}><h3>이미지 변경</h3></label>
                                    <input className='profile_btn' type='file' id="profilebtn" style={{display:'none'}} accept='.jpg, .png' onChange={profileimg}/>
                                    <h4 style={showinput?{display:'block'}:{display:'none'}}>⚠️크기 : 200px x 200px</h4>
                                </div>
                                <div className='userAddress_Line'>
                                    <div className='userAddress_Line_Top'>
                                        <h2>지역</h2>
                                        <label style={showinput?{display:'block'}:{display:'none'}} htmlFor='save_userAddress'><img src={updateBtnAct.userAddress} alt=''></img></label><input id='save_userAddress' name='userAddress' type='button' onClick={checkUpdata} style={{display:'none'}}/>
                                    </div>
                                    <div className='userAddress_Line_Bottoom' style={showinput?{display:'none'}:{display:'flex'}}><h2>{riderInfo.userAddressCity} / {riderInfo.userAddressTown}</h2></div>
                                    <div className='userAddress_Line_Bottoom' style={showinput?{display:'flex'}:{display:'none'}}>
                                        <select className='selectCity' value={updateRider.userAddressCity} onChange={selectCity}>
                                            {cityList.map((data,index)=>(<option key={index} value={data}>{data}</option>))}
                                        </select>
                                        <select className='selectTown' value={updateRider.userAddressTown} onChange={selectTown}>
                                                <option value={""}>선택</option>
                                                {addressList.filter(data=>data.city===updateRider.userAddressCity).map((data,index)=>(<option key={index} value={data.town}>{data.town}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='riderInfo_right'>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td><h2>이메일</h2></td>
                                        <td><h2>{riderInfo.userEmail}</h2></td>
                                    </tr>
                                    <tr>
                                        <td><h2>닉네임</h2></td>
                                        <td style={showinput?{display:'none'}:{display:'table-cell'}} className='profile_inputLine'><h2>{riderInfo.userNickname}</h2></td>
                                        <td style={showinput?{display:'table-cell'}:{display:'none'}} className='profile_inputLine'><input className='profile_text' name='userNickname' id='userNickname' placeholder={riderInfo.userNickname} type='text' onChange={insertData}/></td>
                                        <td className='saveBtn_Line'><label style={showinput?{display:'table-cell'}:{display:'none'}} htmlFor='save_userNickname'><img src={updateBtnAct.userNickname} alt=''></img></label><input id='save_userNickname' name='userNickname' type='button' onClick={checkUpdata} style={{display:'none'}}/></td>
                                    </tr>
                                    <tr>
                                        <td><h2>이름</h2></td>
                                        <td style={showinput?{display:'none'}:{display:'table-cell'}} className='profile_inputLine'><h2>{riderInfo.userName}</h2></td>
                                        <td style={showinput?{display:'table-cell'}:{display:'none'}} className='profile_inputLine'><input className='profile_text' name='userName' id='userName' placeholder={riderInfo.userName} type='text' onChange={insertData}/></td>
                                        <td className='saveBtn_Line'><label style={showinput?{display:'table-cell'}:{display:'none'}} htmlFor='save_userName'><img src={updateBtnAct.userName} alt=''></img></label><input id='save_userName' name='userName' type='button' onClick={checkUpdata} style={{display:'none'}}/></td>
                                    </tr>
                                    <tr>
                                        <td><h2>연락처</h2></td>
                                        <td style={showinput?{display:'none'}:{display:'table-cell'}} className='profile_inputLine'><h2>{riderInfo.userPhone}</h2></td>
                                        <td style={showinput?{display:'table-cell'}:{display:'none'}} className='profile_inputLine'><input className='profile_text' name='userPhone' id='userPhone' placeholder={riderInfo.userPhone} type='text' maxLength={11} onChange={insertData}/></td>
                                        <td className='saveBtn_Line'><label style={showinput?{display:'table-cell'}:{display:'none'}} htmlFor='save_userPhone'><img src={updateBtnAct.userPhone} alt=''></img></label><input id='save_userPhone' name='userPhone' type='button' onClick={checkUpdata} style={{display:'none'}}/></td>
                                    </tr>
                                    <tr>
                                        <td><h2>생일</h2></td>
                                        <td style={showinput?{display:'none'}:{display:'table-cell'}} className='profile_inputLine'><h2>{riderInfo.userBirthday}</h2></td>
                                        <td style={showinput?{display:'table-cell'}:{display:'none'}} className='profile_inputLine'><input name='userBirthday' id='userBirthday' placeholder={riderInfo.userBirthday} type='text' maxLength={8} onChange={insertData}/></td>
                                        <td className='saveBtn_Line'><label style={showinput?{display:'table-cell'}:{display:'none'}} htmlFor='save_userBirthday'><img src={updateBtnAct.userBirthday} alt=''></img></label><input id='save_userBirthday' name='userBirthday' type='button' onClick={checkUpdata} style={{display:'none'}}/></td>
                                    </tr>
                                    <tr>
                                        <td><h2>성별</h2></td>
                                        <td style={showinput?{display:'none'}:{display:'table-cell'}} className='profile_inputLine'><h2>{riderInfo.userGender?"여성 ♀️":"남성 ♂️"}</h2></td>
                                        <td style={showinput?{display:'flex'}:{display:'none'}} className='profile_inputLine' name='changeGender'>
                                            <input id='gender1' name='genderBtn' type='radio' value={false} style={{display:'none'}} onClick={insertGender} defaultChecked={!updateRider.userGender}/>
                                            <label htmlFor='gender1'><h3>남자 ♂️</h3></label>
                                            <input id='gender2' name='genderBtn' type='radio' value={true} style={{display:'none'}}  onClick={insertGender} defaultChecked={updateRider.userGender}/>    
                                            <label htmlFor='gender2'><h3>여자 ♀️</h3></label> 
                                        </td>
                                        <td className='saveBtn_Line'><label style={showinput?{display:'table-cell'}:{display:'none'}} htmlFor='save_userGender'><img src={updateBtnAct.userGender} alt=''></img></label><input id='save_userGender' name='userGender' type='button' onClick={checkUpdata} style={{display:'none'}}/></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ✏️ 크루 및 바이크 범위*/}
                    <div className='bikeData'>
                        <div className='bikeLine'>
                            <h1>바이크</h1>
                            <div className='bikeInfo'>
                                <label className='showBikeBtn' name="Down" htmlFor='showBikeDown'></label>
                                <input type='button' id='showBikeDown' onClick={bikeControl}/>
                                <div className='bikeInfoLine'>
                                    <div className='bikeBoxLine' style={boxtransform}>
                                    {!!bikeInfo&&bikeInfo.map((bikeData) => <BikeInfoBox key={bikeData.bike_index} showBikeIndex={showBike} data={bikeData}/>)}
                                    </div>
                                </div>
                                <label className='showBikeBtn' name="Up" htmlFor='showBikeUp'></label>
                                <input type='button' id='showBikeUp' onClick={bikeControl}/>
                            </div>
                            <div className='bikeInfo_btnLine'>
                                <input type='button' id='bikeAdd' onClick={bikeAdd}/>
                                <label className='bikeInfoBtn' htmlFor='bikeAdd' style={bikeAddBtn}></label>
                                <input type='button' id='bikeSelect' onClick={bikeSelect}/>
                                <label className='bikeInfoBtn' htmlFor='bikeSelect' style={bikeSelectBtn}></label>
                                <input type='button' id='bikeDelect' onClick={bikeDelete}/>
                                <label className='bikeInfoBtn' htmlFor='bikeDelect' style={bikeDeleteBtn}></label>
                            </div>
                        </div>
                        <div className='crewLine'>
                            <h1>크루</h1>
                            <div className='crewBlockBox' style={!!crewInfo.crew_name?{display:'none'}:{display:'flex'}}>
                                    <h2>⚠️ 가입된 크루가 없습니다 ⚠️</h2>
                            </div>
                            <div className='crewInfo' style={!!crewInfo.crew_name?{display:'flex'}:{display:'none'}}>
                                <div className='crewInfoLine'>
                                    <h2>크루명</h2>
                                    <h2>{crewInfo.crew_name}</h2>
                                </div>
                                <div className='crewInfoLine'>
                                    <h2>크루장</h2>
                                    <h2>{crewInfo.crew_master}</h2>
                                </div>
                                <div className='crewInfoLine'>
                                    <h2>활동 지역</h2>
                                    <h2>{crewInfo.crew_city} / {crewInfo.crew_town}</h2>
                                </div>
                                <div className='crewInfoLine'>
                                    <h2>크루 가입일</h2>
                                    <h2>{crewInfo.crew_regdata}</h2>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <DefaultFooter/>
        </main>
    );
};

export default MyPage;