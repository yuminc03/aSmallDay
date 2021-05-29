import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import LoginForm from '../containers/auth/LoginForm';

const LoginPage = () =>{
    return (
        <AuthTemplate>
            <LoginForm/>
            {/* type이 없으면 로그인 텍스트가 안 나타남.. UserForm.js참고! */}
        </AuthTemplate>
    );
};

export default LoginPage;