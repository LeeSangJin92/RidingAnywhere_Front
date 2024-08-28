import React, { useEffect, useState } from 'react';
import DefaultHeader from '../component/DefaultHeader_main';
import DefaultFooter from '../component/DefaultFooter';
import '../css/crewBoard.css';
import { useNavigate } from 'react-router-dom';
import CrewBoardBox from '../component/crewboard/CrewBoardBox';
const CrewBoard = () => {
    const navigate = useNavigate();

    // 토큰 체크
    const [accessToken] = useState(!sessionStorage.getItem('accessToken'));

    // 접속한 유저 정보
    const [riderInfo, setriderInfo] = useState({
        userId : 0,
        userCrewId : 0,
     });

    useEffect(()=>{checkData()},[]);

    // 게시글 목록
    const [crewBoardList,setCrewBoardList] = useState([]);
    
    // 필터 리스트
    const [filterList, setFilterList] = useState({
        Note:true,
        Tour:true,
        Free:true,
        Greetings:true,
        SearchText:new RegExp(''),
        SearchType:'all'
    });

    // 검색 데이터
    const [searchData,setSearchData] = useState({
        Text:"",
        Type:"all"
    })

    // ✏️ 검색 데이터 작성
    const changeSearchData = (inputData) => {
        let key = inputData.target.className==="boardTextBox"?"Text":"Type";
        let changeData = inputData.target.value;
        setSearchData({...searchData,[key]:changeData})
    }

    // 화면 컨트롤
     const [viewBlock,setViewBlock] = useState(true);

    // 접속한 유저 정보 가져오기
     const checkData = async () => {
        console.log("🛜 라이더 엑세스 체크 중...")
        if(!accessToken){
            console.log("✅ 접속자에게 엑세스 있음!")
            console.log("🛜 라이더 데이터 확인 중...")
            await fetch("/RA/CheckRider",
            {headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"}})
            .then(response => {
                if(response.status===200) return response.json();
                else if(response.status===401){
                    console.log("❌ 토큰 데이터 만료");
                    alert("⚠️ 로그인 유지 시간 초과 \n - 로그인 페이지로 이동합니다. -");
                    sessionStorage.removeItem('accessToken');
                    navigate('/RA/Login');
                }
            }).then(data => {
                if(!!data){
                    if(!data.crewId){
                    console.log("❌ 가입된 크루 없음")
                    alert("⚠️가입된 크루가 없습니다.\n - 가입 또는 생성 후 이용해주세요! -");
                    navigate("/RA/Home");
                    }
                    console.log("✅ 라이더 데이터 수집 완료!");
                    setriderInfo({
                        userId : data.userData.userId,
                        userCrewId : data.crewId,
                    });
                    loadCrewBoard();
                }
            })
            }else {
                console.log("⛔ 접속자에게 엑세스 없음");
                alert("⚠️로그인이 필요합니다.⚠️\n - 로그인 페이지로 이동합니다. - ")
                console.log("🛠️ 로그인 페이지로 이동")
                navigate("/RA/login");
            }
        };

    // 🛜 게시글 데이터 로드
    const loadCrewBoard = async () => {
        console.log("🛜 서버 게시글 목록 요청");
        await fetch("/CR/LoadCrewBoard",
            {
                headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                "Content-Type": "application/json;charset=utf-8"
            }
        }).then(response => {
            if(response.status===200){
                console.log("✅ 게시글 응답 완료");
                return response.json();
            } else {
                console.log("❌ 서버 응답 실패");
                console.log("응답 상태 : " + response.status);
            }
        }).then(data=>{
            if(!!data){
                console.log("✅ 게시글 목록 로드 완료");
                console.log(data);
                setCrewBoardList(data);
                setViewBlock(false);
            };
        })
    }

    // 🕹️ 게시글 작성버튼 클릭
    const onClickWriteBtn = () => {
        navigate("/CR/Board/Write")
    }

    // 🕹️ 게시글 필터 버튼 클릭
    const onClickFilterBtn = (filterData) => {
            setFilterList({
                ...filterList,
                [filterData.target.id]:!filterList[filterData.target.id]
            })
        }

    // 🕹️ 게시글 검색 버튼 클릭
    const onClickSearchBtn = () => {
        if(!searchData.Text){
            alert("⚠️검색어가 비어 있습니다.");
            setFilterList({
                ...filterList,SearchText:new RegExp('')
            });
        } else {
            let filterText = new RegExp(searchData.Text);
            setFilterList({
                ...filterList,
                SearchText:filterText,
                SearchType:searchData.Type
            });
        }
    }

    return (
        <main>
            <DefaultHeader/>
            <section className='CrewBoard'>
                <div className='boardTopLine'>
                    <div className='boardFilterLine'>
                        <div className='filterTop'>
                            <h1>크루 게시판</h1>
                            <input type='text' className='boardTextBox' value={searchData.Text} placeholder='찾고 싶은 키워드를 입력하세요!' onChange={changeSearchData} disabled={viewBlock}/>
                            <input type='button' className='boardSearchBtn' disabled={viewBlock} onClick={onClickSearchBtn}/>
                            <select className='boardSearchType' value={searchData.Type} onChange={changeSearchData}  disabled={viewBlock}>
                                <option value={"all"}>제목 + 내용</option>
                                <option value={"title"}>제목</option>
                                <option value={"context"}>내용</option>
                            </select>
                        </div>
                        <div className='filterBottom'>
                            <h1>필터</h1>
                            <input type='checkbox' id='Note' className='filterInput' checked={filterList.Note} onClick={onClickFilterBtn} disabled={viewBlock} hidden/>
                            <label htmlFor='Note' className='filterCheckBox'><span>공지글</span></label>
                            <input type='checkbox' id='Tour' className='filterInput' checked={filterList.Tour} onClick={onClickFilterBtn} disabled={viewBlock} hidden/>
                            <label htmlFor='Tour' className='filterCheckBox'><span>모임글</span></label>
                            <input type='checkbox' id='Free' className='filterInput' checked={filterList.Free} onClick={onClickFilterBtn} disabled={viewBlock} hidden/>
                            <label htmlFor='Free' className='filterCheckBox'><span>자유글</span></label>
                            <input type='checkbox' id='Greetings' className='filterInput' checked={filterList.Greetings} onClick={onClickFilterBtn} disabled={viewBlock} hidden/>
                            <label htmlFor='Greetings' className='filterCheckBox'><span>인사말</span></label>
                        </div>
                    </div>
                    <label htmlFor='writeBtn' className='boardWriteBtn'><span>게시글<br/>작성</span></label>
                    <input id='writeBtn' type='button' onClick={onClickWriteBtn} disabled={viewBlock} hidden/>
                </div>
                
                <div className='boardListLine'>
                    {/* 게시글 목록 헤더 라인 */}
                    <div className='boardListHeadLine'>
                        <h2 className='boardNo'>No</h2>
                        <h2 className='boardType'>말머리</h2>
                        <h2 className='boardTitle'>제목</h2>
                        <h2 className='boardWriter'>작성자</h2>
                        <h2 className='boardLevel'>등급</h2>
                        <h2 className='boardCount'>조회수</h2>
                    </div>
                    <div className='boardListBodyLine'>
                        <div className='viewBlock' style={viewBlock?{display:'flex'}:{display:'none'}}>
                            <h1>데이터 불러오는 중...</h1>
                        </div>
                        {crewBoardList.map((boardData,index)=>{
                            if(filterList[boardData.boardType]){
                                let checkRegExp = false;
                                switch(filterList.SearchType){
                                    case "all":
                                        checkRegExp = (filterList.SearchText.test(boardData.boardTitle)||filterList.SearchText.test(boardData.boardContext));
                                        break;
                                    case "title":
                                        checkRegExp = (filterList.SearchText.test(boardData.boardTitle))
                                         break;
                                    case "context":
                                        checkRegExp = (filterList.SearchText.test(boardData.boardContext))
                                        break;
                                    default :
                                }
                                if(checkRegExp) return <CrewBoardBox key={index} boardData={boardData} userId={riderInfo.userId}/>;
                                else return null;
                            }
                            else return null;
                        })}
                    </div>
                </div>
            </section>
            <DefaultFooter/>
        </main>
    );
};

export default CrewBoard;