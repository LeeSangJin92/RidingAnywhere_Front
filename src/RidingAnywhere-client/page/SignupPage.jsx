import React, { useEffect, useState } from 'react';
import DefaultFooter from '../component/DefaultFooter';
import '../css/signuppage.css';
import DefaultHeader from '../component/DefaultHeader_small';
import { useNavigate } from 'react-router-dom';
const SignupPage = ({connect_Api}) => {
    const navigate = useNavigate();

    // ✏️ 지역 관련 데이터 변수
    const [addressList, setAddressList] = useState([]);
    const [cityList, setCityList] = useState([""])

    const selectCity = (btn) => {
        document.getElementsByClassName("selectTown")
        setUserData({...userData,userAddressCity:btn.target.value, userAddressTown:""});
        setDataCheck({...dataCheck,userAddressTown:[false]});
    }

    const selectTown = (btn) => {
        setUserData({...userData,userAddressTown:btn.target.value});
        setDataCheck({...dataCheck,userAddressTown:[true]})
    }

    // 🛜 지역 데이터 설정
    useEffect(()=>{
        console.log("🛜지역 데이터 요청중...")
        connect_Api("/RA/AddressData")
        .then((data)=>{
            if(data){
                console.log("🛠️지역 데이터 저장중...");
                setAddressList(data);
                setCityList([...new Set(data.map(data=>data.city))]);
                console.log("✅지역 데이터 작업 완료")
            }
        })
    },[])

    // 회원 데이터 초기값 설정
    const [userData,setUserData] = useState({
        userNickname:"",
        userName:"",
        userBirthday:"",
        userGender:"",
        userPhone:"",
        userEmail:"",
        userPassword:"",
        userPasswordRe:"",
        userAddressCity:"",
        userAddressTown:"",
    },[])

    // 입력된 정보 에러 체크 및 Display 설정 [에러문구 색상, Display 설정]
    const [dataCheck,setDataCheck] = useState({
        userNickname:[false,false],
        userName:[false,false],
        userBirthday:[false,false],
        userPhone:[false,false],
        userEmail:[false,false],
        emailAuth:[false,false],
        userGender:[false],
        userAddressTown:[false],
        userPassword:[false,false],
        userPasswordRe:[false,false]
    },[])

    // 서브밋 버튼 활성화 및 비활성화 여부 확인
    const [disableBtn,setDisableBtn] = useState(false)
    useEffect(()=>{
        setDisableBtn(Object.values(dataCheck).map(data=>data[0]).includes(false))
    },[dataCheck])

    // 회원 데이터 입력 설정
    const changeData = (data) =>{
        setUserData({
            ...userData,
            [data.target.name]:data.target.value
        });
        data.target.name==="userGender"&&setDataCheck({...dataCheck,userGender:[true]});
    }

    // 이메일 인증 번호 입력 값
    const [emailAuthData,setEmailAuthData] = useState("")
    const changeEmailAuthData = (data) =>{
        setEmailAuthData(
            data.target.value
        );
        setDataCheck({...dataCheck,emailAuth:[parseInt(emailAuthData)===parseInt(emailKey),true]})
    }

    const [emailKey,setEmailKey] = useState("")


    // 회원 정보 관련 정규표현식 데이터
    const mapRegExp = {
        "userEmail" : new RegExp("^([A-Za-z0-9])+@+([A-Za-z0-9])+\\.+([A-Za-z])+$"),
        "emailAuth" : new RegExp("^([\\d]{8,8}$)"),
        "userPassword" : new RegExp('^(?=.*[A-Za-z])(?=.*[\\d])(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,14}$'),
        "userPasswordRe" : new RegExp(userData.userPasswordRe),
        "userNickname" : new RegExp('^([A-Za-z\\d\\uAC00-\\uD7A3\\u3131-\\u314E]){1,8}$'),
        "userName" : new RegExp('^([가-힣]){3,4}$'),
        "userBirthday" : new RegExp('^([\\d]){8,8}$'),
        "userPhone" : new RegExp('^(010+[\\d]{8,8})$')
    };

    // 회원 데이터 검증
    const checkData = (data) => {
        let tagName = data.target.name;
        setDataCheck({...dataCheck,[tagName]:[mapRegExp[tagName].test(data.target.value),true]})
    }

    // 회원 가입 서버로 요청
    const signUpPost = (e) => {
        e.preventDefault();
        setUserData({...userData,authority:'1'})
        connect_Api("/RA/Signup",{
            method: "POST", 
            headers: {
                "Content-Type": "application/json;charset=utf-8",       // 전송되는 데이터 타입 옵션 설정!
            },
            body:JSON.stringify(userData)
        }).then(data=>{
            if(data){
                navigate("/RA/Login");
            }
        })
    }
    const [emailAuthDisable,setEmailAuthDisabled] = useState(true);

    // 이메일 인증번호 전송 및 중복 체크
    const sendEmailAuth = () => {
        connect_Api("/RA/SignUp/Email",{
            method: "POST",
            headers:{
                "Content-Type": "application/json;charset=utf-8"},
            body:JSON.stringify(userData.userEmail)
            }).then(data=>{
                if(data){
                    console.log(data);
                    setEmailKey(data);
                }
            })
            setEmailAuthDisabled(false);
        }

    return (
        <main>
            <section className='Section_signup'>
            <DefaultHeader word={'회원가입'}/>
            <div className='Signup_Box'>

                {/* 이메일 입력 라인 */}
                <div className='Signup_line'>
                    <h2>이메일</h2>
                    <input type='eamil' placeholder='ex) test1@naver.com' name='userEmail' onChange={changeData} onBlur={checkData}/>
                </div>
                <h8 name='userEmailError' style={{color: dataCheck.userEmail[0]?'green':'red', display:dataCheck.userEmail[1]?'block':'none'}}>
                    {dataCheck.userEmail[0]?'정상적으로 입력되었습니다.':'이메일 정보가 정확하지 않습니다.'}
                </h8>

                {/* 이메일 인증 라인 */}
                <div className='Signup_line' id='Email_pass'>
                    <button name='emailAuth' value={""} onClick={sendEmailAuth} disabled={dataCheck.userEmail[0]?false:true}>인증 요청</button> 
                    <input type='textbox' name='emailAuthData' maxLength="8" placeholder='ex) 12345678' onChange={changeEmailAuthData} onBlur={changeEmailAuthData} disabled={emailAuthDisable}/>
                </div>
                <h8 name='emailAuthError' style={{color : dataCheck.emailAuth[0]?'green':'red', display:dataCheck.emailAuth[1]?'block':'none'}}>
                    {dataCheck.emailAuth[0]?'인증이 완료 되었습니다':'인증번호가 정확하지 않습니다.'}
                </h8>

                {/* 1차 비밀번호 입력 라인 */}
                <div className='Signup_line'><h2>비밀번호</h2><input type='password' name='userPassword' onChange={changeData} onBlur={checkData}/></div>
                <h8 name='userPasswordError' style={{color : dataCheck.userPassword[0]?'green':'red', display:dataCheck.userPassword[1]?'block':'none'}}>
                    {dataCheck.userPassword[0]?'정상적으로 입력되었습니다.':'비밀번호가 정확하지 않습니다.'}
                </h8>
                
                {/* 2차 비밀번호 입력 라인 */}
                <div className='Signup_line'><h2>비밀번호 확인</h2><input type='password' name='userPasswordRe' onChange={changeData} onBlur={checkData}/></div>
                <h8 name='userPasswordReError' style={{color : dataCheck.userPasswordRe[0]?'green':'red', display:dataCheck.userPasswordRe[1]?'block':'none'}}>
                    {dataCheck.userPasswordRe[0]?'정상적으로 입력되었습니다.':'비밀번호와 동일하지 않습니다.'}
                </h8>
                
                {/* 닉네임 입력 라인 */}
                <div className='Signup_line'><h2>닉네임</h2><input type='textbox' name='userNickname' onChange={changeData} onBlur={checkData}/></div>
                <h8 name='userNicknameError' style={{color : dataCheck.userNickname[0]?'green':'red', display:dataCheck.userNickname[1]?'block':'none'}}>
                    {dataCheck.userNickname[0]?'정상적으로 입력되었습니다.':'닉네임이 정확하지 않습니다.'}
                </h8>
               
                {/* 이름 입력 라인 */}
                <div className='Signup_line'><h2>이름</h2><input type='textbox' name='userName' onChange={changeData} onBlur={checkData}/></div>
                <h8 name='userNameError' style={{color : dataCheck.userName[0]?'green':'red', display:dataCheck.userName[1]?'block':'none'}}>
                    {dataCheck.userName[0]?'정상적으로 입력되었습니다.':'이름이 정확하지 않습니다.'}
                </h8>
                
                {/* 생년월일 입력 라인 */}
                <div className='Signup_line'><h2>생년월일</h2><input type='textbox' maxLength="8" placeholder='ex) 19920110' name='userBirthday' onChange={changeData} onBlur={checkData}/></div>
                <h8 name='userBirthdayError' style={{color : dataCheck.userBirthday[0]?'green':'red', display:dataCheck.userBirthday[1]?'block':'none'}}>
                    {dataCheck.userBirthday[0]?'정상적으로 입력되었습니다.':'생년월일 정보가 정확하지 않습니다.'}
                </h8>

                {/* 연락처 입력 라인 */}
                <div className='Signup_line'><h2>연락처</h2><input type='textbox' placeholder='핸드폰번호를 숫자로만 입력하세요!' name='userPhone' onChange={changeData} onBlur={checkData}/></div>
                <h8 name='userPhoneError' style={{color : dataCheck.userPhone[0]?'green':'red', display:dataCheck.userPhone[1]?'block':'none'}}>
                    {dataCheck.userPhone[0]?'정상적으로 입력되었습니다.':'연락처 정보가 정확하지 않습니다.'}   
                </h8>

                {/* 지역 선택 라인 */}
                <div className='Signup_line'><h2>지역</h2>
                    <select className='selectCity' onChange={selectCity}>
                    <option value={""}>도시 선택</option>
                    {cityList.map((data,index)=>(<option key={index} value={data}>{data}</option>))}</select>

                    <select className='selectTown' onChange={selectTown} value={userData.userAddressTown}>
                        <option value={""}>⚠️도시 선택⚠️</option>
                        {addressList.filter(data=>data.city===userData.userAddressCity).map((data,index)=>(<option key={index} value={data.town}>{data.town}</option>))}
                    </select>
                </div>
                {/* 성별 선택 라인 */}
                <div className='Gender_radio'>
                    <input id='gender1' name='userGender' type='radio' value='true' onChange={changeData}/>
                    <label htmlFor='gender1'>남자</label>
                    <input id='gender2' name='userGender' type='radio' value='false' onChange={changeData}/>    
                    <label htmlFor='gender2'>여자</label>
                </div>

                {/* 서브밋 버튼 라인 */}
                <div className='Button_line'>
                    <button className='btn_submit_signup' id='btnSignUp' disabled={disableBtn} onClick={signUpPost}>다음</button>
                </div>
                </div>
            </section>
            <DefaultFooter/>
        </main>
    );
};
export default SignupPage;