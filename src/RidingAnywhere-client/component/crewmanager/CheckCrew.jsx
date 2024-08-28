import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckCrew = (props) => {
    const navigate = useNavigate();
    const onClickJoin = () => {
        console.log("✅ 크루 가입 클릭")
        navigate("/CR/Join")
    }

    const onClickCreate = () => {
        console.log("✅ 크루 생성 클릭")
        props.controller({block:true,up:"Create"})
    }
    return (
        <div className='CheckCrew' style={props.showUp?{display:'flex'}:{display:'none'}}>
            <h1>⚠️가입된 크루가 없습니다⚠️</h1>
            <div className='BtnLine'>
                <div className='Create'>
                    <label htmlFor='create_crew'></label>
                    <input id='create_crew' type='button' style={{display:'none'}} onClick={onClickCreate}/>
                </div>
                <div className='Join'>
                    <label htmlFor='join_crew'></label>
                    <input id='join_crew' type='button' style={{display:'none'}} onClick={onClickJoin}/>
                </div>
            </div>
        </div>
    );
};

export default CheckCrew;