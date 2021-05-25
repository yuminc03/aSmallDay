import React from 'react';
import UserTemplate from '../components/user/UserTemplate';
import LoginForm from '../containers/user/LoginForm';

const LoginPage = () =>{
    return (
        <UserTemplate>
            <LoginForm/>
            {/* type이 없으면 로그인 텍스트가 안 나타남.. UserForm.js참고! */}
        </UserTemplate>
    );
};

export default LoginPage;