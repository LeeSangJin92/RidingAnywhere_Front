import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import "../css/DefaultHeaderMain.css"

const DefaultHeader_main = () => {

    const [accessToken] = useState(!sessionStorage.getItem('accessToken'))

    // 로그아웃 박스 display 컨트롤
   const [logoutBox,setLogoutBox] = useState(false);
   const showLogoutBox = () => {
       setLogoutBox(true);
   }

    return (
        <>
            <header>    
                    {/* ✏️ 로고 이미지 클릭 시 홈 이동 */}    
                    <div className='header_log_img'>
                        <Link to="/RA/Home"><img className='log_img' src='/img/Log_img.png' alt=''/></Link>
                    </div>
                    <div className='top_line'>
                        <div className='top_tag_line'>
                            <Link to="/RA/Login" className='top_tag' name="unaccesslog_btn" style={{display:!accessToken?"none":"flex"}}>log in</Link>
                            <Link to="/RA/Signup" className='top_tag' name="unaccesslog_btn" style={{display:!accessToken?"none":"flex"}}>Sign Up</Link>
                            <Link to="/RA/MyPage" className='top_tag' name="accesslog_btn" style={{display:!accessToken?"flex":"none"}}>my page</Link>
                            <input type="button" className='top_tag' name="accesslog_btn" style={{display:!accessToken?"flex":"none"}} value="log out" onClick={showLogoutBox}/>
                        </div>
                        <nav className='topNav'>
                            <Link to="/CR/Manager" className='NavCategory'>CREW MANAGER</Link>     {/*크루원 관리*/}
                            <Link to="/CR/Board" className='NavCategory'>CREW BOARD</Link>       {/*크루 게시판*/}
                            <Link to="/CR/Join" className='NavCategory'>CREW JOIN</Link>        {/*크루원 모집*/}
                            <Link to="/RA/Board" className='NavCategory'>RIDER BOARD</Link>      {/*라이더 커뮤니티*/}
                        </nav>
                    </div>
                </header>
            {logoutBox?<Logout setLogoutBox={setLogoutBox}/>:<></>}
        </>
    );
};

export default DefaultHeader_main;