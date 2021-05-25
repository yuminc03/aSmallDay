import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeField, initializeForm} from '../../modules/user';
import UserForm from '../../components/user/UserForm';

const LoginForm = () =>{
    const dispatch = useDispatch();
    const {form} = useSelector(({user}) => ({
        form: user.login
    }));
    //input 변경 이벤트 핸들러
    const onChange = e => {
        const {value, name} = e.target;
        dispatch(
            changeField({
                form: 'login',
                key: name,
                value
            })
        );
    };
    //폼 등록 이벤트 핸들러
    const onSubmit = e => {
        e.preventDefault();
        //구현 예정
    };

    //컴포넌트가 처음 렌더링 될 때 form을 초기화함
    //이 작업을 안하면 로그인 페이지에서 값을 입력한 후 다른 페이지로 이동했다가 돌아왔
    //을 때 값이 유지된 상태로 보임
    useEffect(() => {
        dispatch(initializeForm('login'));
    }, [dispatch]);
    
    return (
        <UserForm
            type = "login"
            form = {form}
            onChange={onChange}
            onSubmit={onSubmit}
            // 필요한 액션을 디스패치한다
        />
    );
};

export default LoginForm;