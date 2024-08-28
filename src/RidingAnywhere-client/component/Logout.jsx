import React from 'react';
import "../css/logout.css"
import { useNavigate } from 'react-router-dom';


function Logout(props){

    const navigate = useNavigate();
    const {setLogoutBox} = props;

    // 로그아웃 진행 ✅
    function logoutOk(){
        console.log("✅로그아웃 진행.")
        sessionStorage.removeItem('accessToken');
        navigate('/RA/Login');
    }

    // 로그아웃 취소 ❌
    function logoutCancel(){
        console.log("✅로그아웃 취소.")
        setLogoutBox(false);
    }
    return (
        <>
            {/* 로그아웃 박스 */}
            <div className='logoutBox'>
                    <h1>⚠️ 로그아웃 ⚠️</h1>
                    <h2>- 정말 로그아웃 하시겠습니까? -</h2>
                    <div className='logoutBtnLine'>
                        <input type='button' value={"🤗 Yes"} onClick={logoutOk}></input>
                        <input type='button' value={"😎 No"} onClick={logoutCancel}></input>
                    </div>
            </div>
            
        </>
    );

    
};

export default Logout;