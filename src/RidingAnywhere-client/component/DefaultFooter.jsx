import { Link } from 'react-router-dom';

const DefaultFooter = () => {
    return(
        <footer>
            <h3>Riding Anywhere 는 모든 라이더들의 안전한 라이딩을 기원합니다!</h3>
                <h3>문의 사항은 IG :
                <Link to="https://www.instagram.com/lee.traveler92?igsh=bm1ibWVxczR3YzRt" >LeeTraveler92</Link> 로 DM 남겨주시길 바랍니다.</h3>
        </footer>
    );
};

export default DefaultFooter;