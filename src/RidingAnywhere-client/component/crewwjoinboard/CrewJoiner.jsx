import React from 'react';

const CrewJoiner = (props) => {
    let crewData = props.crewData;

    const clickBtn = () => {
        console.log("🕹️ 크루 선택")
        props.setCrewInfo(crewData);
        props.setShowUpInfoBlock(false);
    }

    return (
            <>
                <label className='CrewJoiner' htmlFor='CrewInfo'>
                    <div className='Data'>
                        <h2>크루 네임</h2>
                        <h2>크루 마스터</h2>
                    </div>
                    <div className='Data'>
                        <h2>{crewData.CrewName}</h2>
                        <h2>{crewData.CrewMaster}</h2>
                    </div>
                    <div className='Data'>
                        <h2>활동 지역</h2>
                        <h2>크루 인원</h2>
                    </div>
                    <div className='Data'>
                        <h2>{crewData.CrewCity} / {crewData.CrewTown}</h2>
                        <h2>😎 {crewData.CrewCount} 명</h2>
                    </div>
                </label>
                <input type='button' id='CrewInfo' onClick={clickBtn} style={{display:"none"}}/>
            </>
    );
};

export default CrewJoiner;