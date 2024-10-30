import React from 'react';

const CrewJoiner = (props) => {
    let crewData = props.crewData;

    const clickBtn = () => {
        console.log("🕹️ 크루 선택")
        props.setCrewInfo(crewData);
        props.setShowUpInfoBlock(false);
        document.getElementsByClassName("CrewInfoBox")[0].style.display = "flex";
    }

    return (
            <>
                <label className='CrewJoiner' htmlFor='CrewInfo'>
                    <div className='TitleA'>
                        <h2>크루명</h2>
                        <h2>마스터</h2>
                    </div>
                    <div className='DataA'>
                        <h2>{crewData.CrewName}</h2>
                        <h2>{crewData.CrewMaster}</h2>
                    </div>
                    <div className='TitleB'>
                        <h2>활동 지역</h2>
                        <h2>크루 인원</h2>
                    </div>
                    <div className='DataB'>
                        <h2>{crewData.CrewCity} / {crewData.CrewTown}</h2>
                        <h2>😎 {crewData.CrewCount} 명</h2>
                    </div>
                </label>
                <input type='button' id='CrewInfo' onClick={clickBtn} style={{display:"none"}}/>
            </>
    );
};

export default CrewJoiner;