import React from 'react';
import '../css/okbtnbox.css'

function OkBtnBox(props){
    // Ok 버튼 클릭 시 ✅True 설정
    function clickOk(){
        !!props.setResult&&props.setResult(true);
    }

    // No 버튼 클릭 시 ❌ false 설정
    function clickNo(){
        !!props.setResult&&props.setResult(false);
    }

    return (
            <>
                <div className='okBox'>
                    {/* ✏️ 제목 라인 */}
                        <div className='TilteLine'>
                            <h1>{props.title}</h1>
                        </div>
                    
                    {/* ✏️ 내용 라인 */}
                        <div className='ContextLine'>
                            <h2>{props.context}</h2>
                        </div>

                    {/* ✅ 버튼 라인 */}
                        <div className='BtnLine'>
                            <input className='OkBtn' id='ClickOk' type='button' value={"✅ OK"} onClick={clickOk}/> 
                            <input className='OkBtn' id='ClickNo' type='button' value={"❌ NO"} onClick={clickNo}/> 
                        </div>
                </div>
            </>
    );
};

export default OkBtnBox;