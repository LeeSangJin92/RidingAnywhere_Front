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
import "../src/RidingAnywhere-client/css/Default.css"
import RiderBoard from "./RidingAnywhere-client/page/RiderBoard";
import RiderBoardWrite from "./RidingAnywhere-client/page/RiderBoardWrite";
import RiderBoardDetail from "./RidingAnywhere-client/page/RiderBoardDetail";
import PageLock from "./RidingAnywhere-client/page/PageLock";

const RidingAnywhereApp = () => {

  const navigate = useNavigate();

  document.title = "Riding AnyWhere";

  return (
      <Container>
        <Routes>
              <Route path="/" element={<Navigate to="/RA/Home"/>}></Route>
              <Route path="/RA/" element={<Navigate to="/RA/Home" />}></Route>
              <Route path="/RA/PageLock" element={<PageLock/>}></Route>
              <Route path="/RA/Home" element={<HomePage/>}></Route>
              <Route path="/RA/Login" element={<LoginPage/>}></Route>
              <Route path="/RA/AddBike" element={<AddBike/>}></Route>
              <Route path="/RA/SignUp" element={<SignupPage/>}></Route>
              <Route path="/RA/AddBike" element={<AddBike/>}></Route>
              <Route path="/RA/MyPage" element={<MyPage/>}></Route>
              <Route path="/RA/Board" element={<RiderBoard/>}></Route>
              <Route path="/RA/Board/Write" element={<RiderBoardWrite/>}></Route>
              <Route path="/RA/Board/Detail/:boardId" element={<RiderBoardDetail/>}></Route>
              <Route path="/CR/Manager" element={<CrewManager/>}></Route>
              <Route path="/CR/Join" element={<CrewJoinBoard/>}></Route>
              <Route path="/CR/Board" element={<CrewBoard/>}></Route>
              <Route path="/CR/Board/Write" element={<CrewBoardWrite/>}></Route>
              <Route path="/CR/Board/Detail/:boardId" element={<CrewBoardDetail/>}></Route>
        </Routes>
    </Container>
  );
};

export default RidingAnywhereApp;
