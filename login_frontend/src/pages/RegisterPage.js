import React from 'react';
import UserTemplate from '../components/user/UserTemplate';
import RegisterForm from '../containers/user/RegisterForm';

const RegisterPage = () => {
    return (
        <UserTemplate>
            <RegisterForm/>
        </UserTemplate>
    );
};

export default RegisterPage;