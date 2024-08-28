import React from 'react';

const CrewAttendanceBox = (props) => {
    let memberData = props.memberData;
    let memberLevel = "";
    let address = memberData.address;
    switch(memberData.authorityId.authorityName){
        case "ROLE_CREW_Master":
            memberLevel = "마스터";
            break;
        case "ROLE_CREW_Member":
            memberLevel = "멤버";
            break;
        case "ROLE_RA_ADMIN":
            memberLevel = "관리자";
            break;
        default : 
    }



    return (
        <div className='CrewAttendanceBox'>
            <label>
                <h2>{memberData.userNickname}</h2>
                <h2>{memberLevel}</h2>
                <h2>{memberData.userBirthday.slice(2,4)}</h2>
                <h2>{address.city}/{address.town}</h2>
            </label>
            <input type='button' hidden/>
        </div>
    );
};

export default CrewAttendanceBox;