import { Container } from "react-bootstrap";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AddBike from "./RidingAnywhere-client/page/AddBike";
import HomePage from "./RidingAnywhere-client/page/HomePage";
import LoginPage from "./RidingAnywhere-client/page/LoginPage";
import SignupPage from "./RidingAnywhere-client/page/SignupPage";
import MyPage from "./RidingAnywhere-client/page/MyPage";
import CrewManager from "./RidingAnywhere-client/page/CrewManager";
import CrewJoinBoard from "./RidingAnywhere-client/page/CrewJoinBoard";
import CrewBoard from "./RidingAnywhere-client/page/CrewBoard";
import CrewBoardWrite from "./RidingAnywhere-client/page/CrewBoardWrite";
import CrewBoardDetail from "./RidingAnywhere-client/page/CrewBoardDetail";
import "../src/RidingAnywhere-client/css/Default.css";
import RiderBoard from "./RidingAnywhere-client/page/RiderBoard";
import RiderBoardWrite from "./RidingAnywhere-client/page/RiderBoardWrite";
import RiderBoardDetail from "./RidingAnywhere-client/page/RiderBoardDetail";
import PageLock from "./RidingAnywhere-client/page/PageLock";

const RidingAnywhereApp = () => {
  const navigate = useNavigate();

  document.title = "Riding AnyWhere";

  const connect_Api = async (location, option) => {
    console.log("🛜 서버 연결 요청");
    return await fetch(`https://ridinganywhere.site/RA/LoadRiderBoard`, option).then(
      (response) => {
        if (response.status === 200) {
          console.log("✅ 서버 연결 완료");
          return response.json();
        } else if (response.status === 401) {
          console.log("⚠️ 로그인 토큰 만료");
          alert(
            "🚨 토큰이 만료 되었습니다. \n - 로그인 페이지로 이동합니다. -"
          );
          sessionStorage.removeItem("accessToken");
          navigate("/RA/Login");
        }
      }
    );
    // .catch(error=>{
    //   alert("🚨 서버가 중단되었습니다.");
    //   navigate("/RA/PageLock");
    // })
  };

  return (
    <Container>
      <Routes>
        <Route path="/" element={<Navigate to="/RA/Home" />}></Route>
        <Route path="/RA/" element={<Navigate to="/RA/Home" />}></Route>
        <Route path="/RA/PageLock" element={<PageLock />}></Route>
        <Route
          path="/RA/Home"
          element={<HomePage connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/Login"
          element={<LoginPage connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/AddBike"
          element={<AddBike connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/SignUp"
          element={<SignupPage connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/AddBike"
          element={<AddBike connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/MyPage"
          element={<MyPage connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/Board"
          element={<RiderBoard connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/Board/Write"
          element={<RiderBoardWrite connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/RA/Board/Detail/:boardId"
          element={<RiderBoardDetail connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/CR/Manager"
          element={<CrewManager connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/CR/Join"
          element={<CrewJoinBoard connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/CR/Board"
          element={<CrewBoard connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/CR/Board/Write"
          element={<CrewBoardWrite connect_Api={connect_Api} />}
        ></Route>
        <Route
          path="/CR/Board/Detail/:boardId"
          element={<CrewBoardDetail connect_Api={connect_Api} />}
        ></Route>
      </Routes>
    </Container>
  );
};

export default RidingAnywhereApp;
