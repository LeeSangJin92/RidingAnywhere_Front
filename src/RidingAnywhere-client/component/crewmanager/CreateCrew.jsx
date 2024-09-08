import React, { useEffect, useState } from 'react';

const CreateCrew = (props) => {

    // 🛠️ 크루 생성을 위한 기본 변수값
    const [crewData,setCrewData] = useState({
        crew_name:"",
        crew_city:"",
        crew_town:"",
        crew_context:""
        })

   

    // ✏️ 작성되는 데이터 저장
    const setData = (props) => {
        switch(props.target.name){
            case "crew_city" :
                setCrewData({...crewData, crew_city:props.target.value, crew_town:""});
                break;
                default :
                setCrewData({...crewData,[props.target.name]:props.target.value})
        }
    }

    const clickCreate = async() => {
        console.log("🔎 입력한 데이터 체크중...")
        if(Object.values(crewData).includes("")){
            console.log("❌입력 데이터 부족")
            alert(`⚠️크루 생성을 위한 정보가 부족합니다⚠️\n- 입력한 정보를 확인해주세요! -`)
        }
        else{
            console.log("🛜 서버로 데이터 전송중...")
            await fetch("/CR/Create",{
                method:"POST",
                headers:{
                    "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                    "Content-Type": "application/json;charset=utf-8"},
                body:JSON.stringify(crewData)
            }).then(response => {
                if(response.status==200){
                    console.log("✅ 서버 작업 완료")
                    return response.json();
                } else console.log("❌ 서버 통신 실패");
            }).then(data=>{
                if(data){
                    console.log("✅ 크루 생성 완료")
                    alert("😎 크루 생성이 완료되었습니다!")
                    props.controller({block:false,up:""})
                }
            })
        }
    }

    const clickCancelBtn = () => {
        console.log("❌취소 버튼 클릭")
        console.log("🛠️크루 생성 데이터 초기화")
        setCrewData({
            crew_name:"",
            crew_city:"",
            crew_town:"",
            crew_context:""
        })
        props.controller({block:true,up:"Check"})
    }



    return (
            <div className='CreateCrew' style={props.showUp?{display:"flex"}:{display:"none"}}>
                <h1>크루 생성</h1>
                <div className='CreateInputLine'>
                    <h2>크루 명</h2>
                    <div className='TextLine'>
                        <input name='crew_name' type='text' maxLength={10} onChange={setData} value={crewData.crew_name}/>
                    </div>
                </div>
                <div className='CreateInputLine'>
                    <h2>활동 지역</h2>
                    <div className='SelectLine'>
                        <select name='crew_city' className='selectCity' onChange={setData} value={crewData.crew_city}>
                        <option value={""}>도시</option>
                        {props.cityList.map((data,index)=>(<option key={index} value={data}>{data}</option>))}</select>
                        <select name='crew_town' className='selectTown' onChange={setData} value={crewData.crew_town}>
                        <option value={""}>⚠️선택</option>
                        {props.addressList.filter(data=>data.city===crewData.crew_city).map((data,index)=>(<option key={index} value={data.town}>{data.town}</option>))}
                    </select>
                    </div>
                </div>
                <div className='CreateInputLine'>
                    <div>
                        <h2>인사말</h2>
                        <h4>(✏️ {crewData.crew_context.length} / 100 )</h4>
                    </div>
                    <textarea name='crew_context' className='CrewContext_input' rows={4} cols={30} maxLength={100} onChange={setData} value={crewData.crew_context}/>
                </div>
                <div className='CreateCrewBtn_Line'>
                    <label className='Ok' htmlFor='Create_Ok'></label>
                    <input id='Create_Ok' type='button' style={{display:"none"}} onClick={clickCreate}/>
                    <label className='Cancel' htmlFor='Create_Non'></label>
                    <input id='Create_Non' type='button' style={{display:"none"}} onClick={clickCancelBtn}/>
                </div>
            </div>
    );
};

export default CreateCrew;