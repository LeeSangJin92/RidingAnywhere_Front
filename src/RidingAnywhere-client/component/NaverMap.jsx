import React, { useEffect, useRef, useState} from 'react';
import "../css/naverMap.css"
import ResultBoxTarget from './navermap/ResultBoxTarget';
import ResultBoxAddress from './navermap/ResultBoxAddress';

const NaverMap = ({hidden, setHiddenMap, mapHiddenControl, insertLocation}) => {

  // ✏️ 기본값 정리
  const {naver} = window;
  const naverMap = useRef(null);
  const [location, setLocation] = useState("");   // ✏️ 장소 이름
  const [address, setAddress] = useState("");     // ✏️ 주소
  const [coordinate, setCoordinate] = useState({  // ✏️ 좌표 코드
    lat:37.5759,
    lng:126.9769
  });
  const [resultList,setResultList] = useState([]);
  
  // 🕹️ 결과창 숨김 컨트롤
  const [resultDisplayed, setResultDisplayed] = useState(false); // ✏️ 검색 결과창 활성화
  const [resultHidden, setResultHidden] = useState(true); // ✏️ 검색 결과창 숨김
  const resultDisplayControl = (control) => {
        setResultDisplayed(control);}
  const toggleResultHidden = () => {
        setResultHidden(!resultHidden);}
  useEffect(()=>{
    resultDisplayControl(resultList.length>0)
    setResultHidden(false);
  },[resultList])

  // 🕹️ 마커 생성 함수
  const createMarker = ({lat, lng, center, listHidden, poi}) => {
    let position = new naver.maps.LatLng(lat, lng);
     // 🕹️ center 조정 필요 시 수정
     if(center){
      console.log("🕹️ 맵 센터 수정");
      naverMap.current.setCenter(position)
    }
    console.log("🕹️맵 마커 생성")
    let marker = new naver.maps.Marker({
      position: position,
      map: naverMap.current
    });
    // 🛠️ 결과창 숨기기
    if(listHidden){
      setResultHidden(true);
      console.log("🕹️ 결과창 숨김")
    }
    // 🛠️ poi 제어
    let poiData = null;
    if(poi){
      console.log("🛠️ POI 생성");
      poiData = new naver.maps.InfoWindow({
        position:position,
        content:poi,
        disableAnchor:true,
        backgroundColor:"#0000000",
        borderColor:"#0000000",
      });
      poiData.open(naverMap.current,marker)
    }
    
    // 🛠️ 기존 마커 제거
    if(!!markerData.marker) markerData.marker.setMap(null);
    
    // 🛠️ poi 제거
    if(markerData.poi) markerData.poi.close();
    setMarkerData({
      ...markerData,
      marker:marker,
      poi:poiData,
      lat:coordinate.lat,
      lng:coordinate.lng
    });
  }


  // 🛠️ 네이버 지도 컨트롤 영역
  useEffect(() => {
    // 네이버 지도 API 로드 확인
    if (window.naver && window.naver.maps) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(coordinate.lat, coordinate.lng),
        maxZoom: 18,  // 최대 확대
        minZoom: 12,  // 최소 확대
        zoom: 16,
      };

      naverMap.current = new window.naver.maps.Map('map', mapOptions); 
      naver.maps.Event.addListener(naverMap.current, 'click', function(e) {
        setCoordinate({
          lat:e.coord.lat(),
          lng:e.coord.lng()
        });
      })
    }
  }, []);

  useEffect(()=>{
    if(!hidden)searchCoordinate();
  },[coordinate])

  // 🕹️ 검색 텍스트 입력
  const onChangeSearchText = ({target}) => {
    setLocation(target.value);
  }

  // 🛠️ 마커 컨트롤 영역
  const [markerData, setMarkerData] = useState({
    marker:null,
    poi:null,
    lat:37.5759,
    lng:126.9769,
    type:"Normal",
  })

  // 🛜 좌표 기준으로 주소 조회
  const searchCoordinate = async () => {
    console.log("🛜 좌표로 주소 요청");
    try{
      const response = await fetch(`https://ridinganywhere/Map/api/coordinate?lat=${coordinate.lat}&lng=${coordinate.lng}`);
      const data = await response.json();
      if(data.results[1]){
        let region = Object.values(data.results[1].region).map(e=>e.name);
        region.shift();
        let resultAddress = region[0] + " " + region[1] + " " + data.results[1].land.name + " " + data.results[1].land.number1;
        resultAddress = data.results[1].land.number2?resultAddress+"-"+data.results[1].land.number2:resultAddress;
        setAddress(resultAddress);
      } else{
        console.log(data.results[0])
        let region = Object.values(data.results[0].region).map(e=>e.name);
        region.shift();
        region.pop();
        setAddress(region.join(" "));
      }
      console.log("✅ 좌표로 주소 요청")
      // ✏️ 주소 등록 라인 변경

      // 🕹️ 지도에 클릭한 위치에 마커 생성
      createMarker({lat:coordinate.lat,lng:coordinate.lng, listHidden:true})
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // 🛜 검색 클릭했을 때 서버 요청
  const onClickSearchBtn = async () => {
    console.log("🛜 장소 이름으로 검색 요청");
    if(location.trim().length>0){
      try {
        let response = await fetch(`https://ridinganywhere/Map/api/search?location=${location}`);
        let data = await response.json();
        console.log(data);
        if(data.items.length===0){
          console.log("⚠️ 장소로 검색된 데이터 없음");
          response = await fetch(`https://ridinganywhere/Map/api/address?address=${location}`)
          data = await(response.json());
          console.log(data.addresses)
          if(data.addresses.length>0){
            setResultList(data.addresses.map(resultData=>{
              let addressMapping = resultData.addressElements.map(data=>data.longName)
              let addressMain = addressMapping[0] + " " + addressMapping[1] + " " + addressMapping[2] + " " + addressMapping[7];
              let addressRoadFull = addressMapping[0] + " " +  addressMapping[1] + " " + addressMapping[4] + " " + addressMapping[5];
              let addressRoad = addressMapping[4] + " " + addressMapping[5];
              let mappingData={
                mainAddress:addressMain,
                roadAddress:addressRoad,
                roadFullAdd:addressRoadFull,
                lat:resultData.y,
                lng:resultData.x
              }
              return mappingData;
            }));
          }
          else{
            alert("🚨 검색 결과가 없습니다.");
          }
        } else {
          setResultList(data.items.map((resultData)=>{
            function changeData(data,number){
              let result = data.split('');
                  result.splice(number,0,'.');
                  return result.join('')
            }
            let parser = new DOMParser();
            let doc = parser.parseFromString(resultData.title,'text/html');
            let mappingData = {
              title:doc.body.textContent || "",
              category:resultData.category,
              address:resultData.roadAddress,
              lat:parseFloat(changeData(resultData.mapy,2)),
              lng:parseFloat(changeData(resultData.mapx,3))
            }
            return mappingData;
          }))
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else alert("🚨 검색 내용이 비어 있습니다.");
  }

  // 🕹️ 등록 버튼 클릭 시 반응
  const onClickInsertBtn = () => {
    console.log("🕹️ 등록 버튼 클릭");
    if(address){
      insertLocation(address);
      setHiddenMap(true);
    } else alert("🚨 입력된 주소가 없습니다.")
  }

  return <div className='NaverMap' style={hidden?{display:"none"}:{display:"flex"}}>
            <div className='BlockBox' onClick={mapHiddenControl}></div>
            <div className='MapBox'>
                <div className='TopLine'>
                    <h1>장소 선택</h1>
                    <div>
                      <div className='searchLine'>
                        <h2>장소 이름 :</h2>
                        <input className='tagText' type='text' value={location} onChange={onChangeSearchText} placeholder='주소 또는 장소를 검색해주세요. ex) 효자동 10, 잠수교, CGV'></input>
                        <input id='searchBtn' type='button' onClick={onClickSearchBtn} hidden/>
                        <label htmlFor='searchBtn' className='searchBtn'><h2>검색</h2></label>
                      </div>
                      <div className='addressLine'>
                        <h2>주소 :</h2>
                        <h2 className='addressText'>{address?address:"선택된 주소가 없습니다."}</h2>
                        <input id='insertBtn' type='button' onClick={onClickInsertBtn} hidden/>
                        <label htmlFor='insertBtn'><h2>등록</h2></label>
                      </div>
                    </div>
                </div>
                <div className='BottomLine'>
                    <div className='resultBoxLine' style={resultDisplayed?{display:"flex"}:{display:"none"}}>
                      <input type='button' id='resultHiddenBtn' onClick={toggleResultHidden} hidden/>
                      <label htmlFor='resultHiddenBtn' className='resultHiddenLabel'>{resultHidden?"열기":"닫기"}</label>
                      {resultList.map((data,index)=>
                        {
                         if(!data.category) return (<ResultBoxAddress key={index} addressMain={data.mainAddress} addressRoad={data.roadAddress} roadFullAdd={data.roadFullAdd} lat={data.lat} lng={data.lng} hidden={resultHidden} onClick={createMarker} setAddress={setAddress}/>);
                         else return (<ResultBoxTarget key={index} title={data.title} category={data.category} addressData={data.address} lat={data.lat} lng={data.lng} hidden={resultHidden} onClick={createMarker} setAddress={setAddress}/>);
                        }
                      )}
                    </div>
                    <div id='map'></div>
                </div>
            </div>
        </div>
};

export default NaverMap;