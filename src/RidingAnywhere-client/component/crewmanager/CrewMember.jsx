import React from 'react';
import "../../css/crewManager.css"

const CrewMember = (props) => { 
    let memberInfo = props.memberInfo;
    let memberAuth = "";
    switch(memberInfo.UserState){
        case "CrewMaster":
            memberAuth="마스터";        // 크루 마스터
            break;
        case "CrewNamed":
            memberAuth="네임드";        // 크루 네임드
            break;
        case "CrewMember":
            memberAuth="멤버";          // 크루 일반 멤버
            break;
        case "CrewJoiner":
            memberAuth="요청중";     // 크루 가입 요청자
            break;
        default:
    }
    
    const clickMember = ()=>{
        console.log("🕹️ 멤버 정보 클릭");
        props.controller({block:true,up:"Detail"});
        props.setcrewMemberInfo({
            ListIndex : memberInfo.ListIndex,           // 멤버 리스트 Index
            UserId : memberInfo.UserId,                 // 멤버 라이더 ID
            UserName : memberInfo.UserName,             // 멤버 이름
            UserNickname : memberInfo.UserNickname,     // 멤버 닉네임
            UserEmail : memberInfo.UserEmail,           // 멤버 이메일
            UserBirthday : memberInfo.UserBirthday,     // 멤버 생년월일
            UserPhone : memberInfo.UserPhone,           // 멤버 연락처
            UserCity : memberInfo.UserCity,             // 멤버 도시
            UserTown : memberInfo.UserTown,             // 멤버 지역
            UserGender : memberInfo.UserGender,         // 멤버 성별
            UserState : memberInfo.UserState,           // 멤버 상태(마스터, 네임드, 멤버, 대기, 신청 등...)
            UserJoinDate : memberInfo.UserJoinDate,     // 멤버 크루 가입 날짜
            UserCnt : memberInfo.UserCnt,               // 멤버 크루 일정 참가 횟수
            UserProfile : memberInfo.UserProfile,       // 멤버 라이더 프로필
            UserBike : memberInfo.UserBike              // 멤버 대표 바이크
        })
    }

    return (
        <>
            <label className='crewMemberBox' htmlFor={memberInfo.UserId}>
                <img src={!memberInfo.UserProfile?'/img/mypage/DefaultProfileImg.png':('data:image/png;base64,'+memberInfo.UserProfile)} alt=''/>
                <div className='crewMemberInfoLine'>
                    <div className='memberDataLine_Top'>
                        <h2 className='memberAuthority'>{memberAuth}</h2>
                        <h2 className='memberNickName'>{"닉네임 : " + memberInfo.UserNickname}</h2>
                    </div>
                    <div className='memberDataLine_Bottom'>
                        <div className='Bottom_Title'>
                            <h2>지역</h2>
                            <h2>나이</h2>
                        </div>
                        <div className='Bottom_Data'>
                            <h2 className='memberLocation'>{memberInfo.UserCity} / {memberInfo.UserTown}</h2>
                            <h2 className='memberAge'>{(memberInfo.UserBirthday+"").substring(2,4)+" . "+(memberInfo.UserBirthday+"").substring(4,6)}</h2>
                        </div>
                        <div className='Bottom_Bike'>
                            <h2 className='memberBikeData'>{memberInfo.UserBike.bikeModel.bikebrand_id.bikebrand_name}</h2>
                            <h2 className='memberBikeData'>{memberInfo.UserBike.bikeModel.model_name}</h2>
                        </div>
                    </div>
                </div>
            </label>
            <input type='button' id={memberInfo.UserId} style={{display:"none"}} onClick={clickMember}/>
        </>
    );
};

export default CrewMember;