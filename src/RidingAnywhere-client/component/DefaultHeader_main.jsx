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
                    <div className='log_img'>
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
                            <div className='NavMiain'>
                                <h1>CREW AREA</h1>
                                <div className='NavMenu'>
                                    <Link to="/CR/Manager" className='NavCategory'>CREW<br/>MANAGER</Link>     {/*크루원 관리*/}
                                    <Link to="/CR/Board" className='NavCategory'>CREW<br/>BOARD</Link>       {/*크루 게시판*/}
                                    <Link to="/CR/Join" className='NavCategory'>CREW<br/>JOIN</Link>        {/*크루원 모집*/}
                                </div>
                            </div>
                            <div className='NavMiain'>
                                <h1>RIDER AREA</h1>       
                                <div className='NavMenu'>      
                                    <Link to="/RA/Board" className='NavCategory'>RIDER<br/>BOARD</Link>      {/*라이더 커뮤니티*/}
                                    <div className='NavCategory'>TOUR<br/>BOARD</div>       {/*투어 게시판*/}
                                    <div className='NavCategory'>MOTO<br/>CAMPING</div>     {/*모토 캠핑 게시판*/}
                                    <div className='NavCategory'>RIDING<br/>COURSE</div>    {/*라이딩 코스 추천*/}
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
            {logoutBox?<Logout setLogoutBox={setLogoutBox}/>:<></>}
        </>
    );
};

export default DefaultHeader_main;