import React from 'react';


// 바이크 추가에서 브랜드 라디오 버튼의 컴포넌트
function AddbikeBrandBtn({brandName, onChange, brandLogo}) {
    return (
            <>
                <input
                    id={brandName}
                    className='btn'
                    type='radio'
                    name="brand"
                    value={brandLogo}
                    onChange={onChange}/>
                <label htmlFor={brandName} className='brandBtn'>
                    {brandName}
                </label>
            </>
    );
}

export default AddbikeBrandBtn;