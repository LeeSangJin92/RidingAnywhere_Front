import Cookies from 'js-cookie';
import React, { createContext, useState } from 'react';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName'

const LoginContextProvider = ({data}) => {
    // 로그인 여부
    const [isLogin, setLogin] = useState(false);
    
    // 유저 정보
    const [userInfo, setUserInfo] = useState({});

    // 권한 정보
    const [roles, setRoles] = useState("");

    // 로그인 셋팅
    // userData, accessToken (jwt)
    const loginSetting = (userData, accessToke) => {
        const {userId, userEmail, auth} = userData
        console.log(`userId : ${userId}`);
        console.log(`userEmail : ${userEmail}`);
        console.log(`auth : ${auth}`);

        Cookies.set("accessToken",accessToke)
        // 로그인 여부 : true
        setLogin(true)
        // 로그인 유저 정보 셋팅
        const updateUserInfo = {userId, userEmail, auth}
        setUserInfo(updateUserInfo)
        // 권한 정보 세팅
        setRoles(auth);
    }

    // 로그아웃 셋팅
    const logoutSetting = () => {

        // 쿠키 초기화
        Cookies.remove("accessToken")

        // 로그인 여부 : false
        setLogin(false)

        // 유저 정보 초기화
        setUserInfo(null)

        // 권한 정보 초기화
        setRoles(null)
    }

    const logout = () => {
        setLogin(false)
    }
    return (
            <LoginContext.Provider value={{isLogin, logout}}>
                {data}
            </LoginContext.Provider>
    );
};

export default LoginContextProvider;