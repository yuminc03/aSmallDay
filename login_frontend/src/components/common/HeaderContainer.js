import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/common/Header';
import { logout } from '../../modules/user';

const HeaderContainer = () => {
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
  };
  return <Header user={user} onLogout={onLogout}/>;
};

export default HeaderContainer;
//로그인 페이지에서 로그인 성공하면 헤더 컴포넌트에서 로그인 중인 상태를 보여주고 새로고침
//해도 상태 유지되도록 하기