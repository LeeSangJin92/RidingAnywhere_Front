import React, { useEffect, useState } from 'react';
import '../css/loginpage.css';
import DefaultFooter from '../component/DefaultFooter';
import { Link, useNavigate } from 'react-router-dom';
import DefaultHeader from '../component/DefaultHeader_small';

const LoginPage = () => {

    const navigate = useNavigate();

    // Request 보낼 데이터 기본값
    const [request, setRequest] = useState({
        userEmail:"",
        userPassword:""
    });

    // 이메일 및 비밀번호 데이터 저장
    const changeValue = (data)=>{
        setRequest({
            ...request,
            [data.target.name]:data.target.value
        });
    }

    // 이메일, 비밀번호 확인 문구 컨트롤
    const [errorWord,setErrorWord] = useState({
        onerrorEmail:false,
        onerrorPW:false,
        errorEmail:true,
        errorPW:true,
        errorUndefined:true
    })

    const showErrorWord = (btn) => {
        setErrorWord(
            btn.target.name === "userEmail"?{...errorWord,onerrorEmail:true}:{...errorWord,onerrorPW:true}
        )
    }

    // 로그인 버튼 비활성화 컨트롤
    const [loginBtnAct, setLoginBtnAct] = useState(true);

    // 이메일, 비밀번호 검증
    useEffect(()=>{
        checkRequest();
    },[request]);

    const checkRequest = () => {
        let emailRegExp = RegExp(!errorWord.onerrorEmail?"":"^([A-Za-z0-9])+@+([A-Za-z0-9])+\\.+([A-Za-z])+$");
        let passwordRegExp = RegExp(!errorWord.onerrorPW?"":'^(?=.*[A-Za-z])(?=.*[\\d])(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,14}$');
        setErrorWord({...errorWord,
            errorUndefined:true,
            errorEmail:emailRegExp.test(request.userEmail),
            errorPW:passwordRegExp.test(request.userPassword)})
    }

    useEffect(()=>{
        setLoginBtnAct(Object.values(errorWord).includes(false));
    },[errorWord])

    // Request 보내는 작업 영역
    const login_start = (e)=>{
        console.log(request);
        e.preventDefault();
        fetch("/RA/Login",{
            method: "POST", 
            headers: {
                // 전송되는 데이터 타입 옵션 설정!
                "Content-Type": "application/json;charset=utf-8",
            },
            body:JSON.stringify(request)
            }).then(response => {
                    console.log("로그인 요청🛜")
                    if(response.status===200) {return response.json()};
            }).then(data => {
                // 로그인이 잘못되었을 경우
                if(!data){
                    alert("⚠️입력하신 정보가 잘못되었습니다");
                    setErrorWord({...errorWord,errorUndefined:false});
                } else{
                    // 받아온 데이터 확인
                    console.log(data+"로그인 완료✅")
                    console.log("토큰 : " + data.accessToken);
                    console.log("타입 : " + data.grantType);
                    console.log("유효 : " + new Date(data.tokenExpiresIn))
                    console.log("현재 : " + new Date())

                    // 토큰 세션에 저장
                    sessionStorage.setItem('accessToken', data.accessToken);
                    sessionStorage.setItem('tokenTime',new Date(data.tokenExpiresIn));

                    // 홈 페이지로 이동
                    navigate("/RA/Home");
                }
            });
    }
    return (
        <main>
            <section className='Section_login'>
            <DefaultHeader word={'로그인'}/>
                <div className='Login_Box'>
                    <div className='Login_InputLine'>
                        <div className='input_wrap'>

                            {/* ✅ 이메일 및 비밀번호 입력 라인 */}
                            <div className='input_row'>
                                <h2>Emaiil</h2>
                                <input className='login_textline' name='userEmail' type='textbox' onChange={changeValue} onClick={showErrorWord}/>
                            </div>
                            <div className='input_row'>
                                <h2>PW</h2>
                                <input className='login_textline' name='userPassword' type='password' onChange={changeValue} onClick={showErrorWord}/>
                            </div>
                        </div>
                        <div className='input_wrap'>

                            {/* ✅ 로그인 버튼 */}
                            <input type='button' className='Login_Button' value={'Login'} onClick={login_start} disabled={loginBtnAct}/>

                            {/* ✅ 회원가입 버튼 */}
                            <Link to={'/RA/SignUp'}><img className='OAuth_log' src='/img/RA_icon.png' alt=''/></Link>
                        </div>
                    </div>
                </div>

                {/*❌ 에러 워드 */}
                <h3 className='errorWord' name='errorEmail' style={{display:errorWord.errorEmail?'none':'block'}}>❌ 이메일 정보가 정확하지 않습니다.</h3>
                <h3 className='errorWord' name='errorPW' style={{display:errorWord.errorPW?'none':'block'}}>❌ 비밀번호가 정확하지 않습니다.</h3>
                <h3 className='errorWord' name='errorUndefined' style={{display:errorWord.errorUndefined?'none':'block'}}>❌ 등록되지 않은 이메일 정보입니다.</h3>
            </section>
                <DefaultFooter/>
        </main>
    );
};

export default LoginPage;