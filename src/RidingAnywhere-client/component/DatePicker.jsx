import ReactDatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import '../css/DatePicker.css';
import ko from 'date-fns/locale/ko'; // 또는 원하는 언어 설정
import '/node_modules/react-datepicker/dist/react-datepicker.module.css';

const DatePicker = ({className, placeholderText ,value, onChange, disabled}) => {
    registerLocale('ko', ko); // 사용할 로케일 등록
    setDefaultLocale('ko'); // 기본 로케일 설정

    // const changedDate = (data) => {
    //     if(props.isStartDate){
    //         props.setBoardData(props.dateEqual?
    //             {...props.boardData,startDate:data,endDate:data}:
    //             {...props.boardData,startDate:data});
    //     }
    //     !props.isStartDate&&props.setBoardData({...props.boardData,endDate:data});
    // }

    return (
        <div className={className}>
            <ReactDatePicker
                id='DatePicker'
                placeholderText={placeholderText}
                className='DatePicker'
                selected={value}
                onChange={onChange}
                dateFormat="yyyy .MM .dd (EEEE)"
                value={value}
                disabled={disabled}
            />
        </div>
    );
};

export default DatePicker;