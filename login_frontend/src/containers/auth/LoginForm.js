import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {changeField, initializeForm, login} from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import {check} from '../../modules/user';

const LoginForm = (history) =>{
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const {form, auth, authError, user} = useSelector(({auth, user}) => ({
        form: auth.login,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user
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
        const {username, password} = form;
        dispatch(login({username, password}));
    };

    //컴포넌트가 처음 렌더링 될 때 form을 초기화함
    //이 작업을 안하면 로그인 페이지에서 값을 입력한 후 다른 페이지로 이동했다가 돌아왔
    //을 때 값이 유지된 상태로 보임
    useEffect(() => {
        dispatch(initializeForm('login'));
    }, [dispatch]);

    useEffect(() => {
        if(authError){
            console.log('오류 발생!');
            console.log(authError);
            setError('로그인 실패');
            return;
        }
        if(auth){
            console.log('로그인 성공!');
            dispatch(check());
        }
    },[auth, authError, dispatch]);

    useEffect(() => {
        if(user){
            history.push('/');
            try{
                localStorage.setItem('user', JSON.stringify(user));//로그인 상태 유지 코드
            }catch(e){
                console.log('localStorage is not working');
            }
        }
    }, [history, user]);
    return (
        <AuthForm
            type = "login"
            form = {form}
            onChange={onChange}
            onSubmit={onSubmit}
            // 필요한 액션을 디스패치한다
            error={error}
        />
    );
};

export default withRouter(LoginForm);