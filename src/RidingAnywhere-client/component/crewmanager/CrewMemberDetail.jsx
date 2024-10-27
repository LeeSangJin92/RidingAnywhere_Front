import React from 'react';

const CrewMemberDetail = (props) => {
    let memberData = props.memberData;
    let memberBike = memberData.UserBike;
    let bikeImgUrl = !memberBike?"":'/img/brand/'+memberBike.bikeModel.bikebrand_id.bikebrand_logo
    const clickCloseBtn = () => {
        console.log("🕹️ 멤버 상세 정보 닫음")
        props.controller({block:false,up:""})
    }
    const onClickOkay = (btn) => {
            if(btn.target.className==="JoinAcceptBtn"){
                console.log("🕹️ 크루 참여 수락 클릭");
                props.requestJoinAccept({
                    ...memberData,
                    JoinAccept:true
                })
            } else {
                console.log("🕹️ 크루 참여 거절 클릭");
                props.requestJoinAccept({
                    ...memberData,
                    JoinAccept:false
                })
            }
    }



    return (
        <div className='CrewMemberDetail' style={props.showUp?{display:'flex'}:{display:'none'}}>
            {props.memberData.ListIndex!==""&&
                <>
                    <input type='button' className='CloseDetailBtn' onClick={clickCloseBtn}></input>
                    <div className='Detail_Top'>
                    <img src={!memberData.UserProfile?'/img/mypage/DefaultProfileImg.png':('data:image/png;base64,'+memberData.UserProfile)} alt=''></img>
                    <div className='MemberInfoBox'>
                        <h2>{memberData.UserNickname}</h2>
                        <h2>{memberData.UserCity} / {memberData.UserTown}</h2>
                        <h2>{memberData.UserBirthday.slice(2,4)}.{memberData.UserBirthday.slice(4,6)}</h2>
                        <h2>{memberData.UserGender?"여성":"남성"}</h2>
                    </div>            
                </div>
                <div className='Detail_Mid'>
                    <div className='JoinAcceptLine' style={memberData.UserState==="CrewJoiner"?{display:'flex'}:{display:'none'}}>
                        <h2>🤔 크루 참여 요청을 수락하시겠습니까?</h2>
                        <div>
                            <input type='button' className='JoinAcceptBtn' onClick={onClickOkay}/>
                            <input type='button' className='JoinRefuseBtn' onClick={onClickOkay}/>
                        </div>
                    </div>
                    <div className='MemberInfoLineTop' style={memberData.UserState!=="CrewJoiner"?{display:'flex'}:{display:'none'}}>
                        <div className='MemberInfoEmail'>
                            <h2>이메일</h2>
                            <h2>{memberData.UserEmail}</h2>
                        </div>
                        <div className='MemberInfoPhone'>
                            <h2>연락처</h2>
                            <h2>{memberData.UserPhone.slice(0,3)+"-"+memberData.UserPhone.slice(3,7)+"-****"}</h2>
                        </div>
                        
                    </div>
                    <div className='MemberInfoLineBottom' style={memberData.UserState!=="CrewJoiner"?{display:'flex'}:{display:'none'}}>
                        <div className='MemberInfoCnt'>
                            <h2>출석</h2>
                            <h2>{memberData.UserCnt}</h2>
                        </div>
                        <div className='MemberInfoJoin'>
                            <h2>가입일</h2>
                            <h2>{memberData.UserJoinDate.slice(0,10)}</h2>
                        </div>
                    </div>
                </div>
                <div className='Detail_Bottom'>
                    <img className='MemberBikeBrandImg' src={bikeImgUrl} alt=''/>
                    <div className='MemberBikeInfoLine'>
                        <div className='MemberBikeName'>
                            <h2>모델</h2>
                            <h2 className='MemberBikeModelData'>{memberBike.bikeModel.model_name}</h2>
                        </div>
                        <div>
                            <div>
                                <h2>배기량</h2>
                                <h2 className='MemberBikeCC'>{memberBike.bikeModel.model_cc}</h2>
                            </div>
                            <div className='MemberBikeYear'>
                                <h2>연식</h2>
                                <h2>2024</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            }
        </div>
    );
};

export default CrewMemberDetail;