//import logo from './logo.svg';
import './App.css';
import React from 'react';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import { Route } from 'react-router';
import {Helmet} from 'react-helmet-async';

function App() {
  return (
    <>
    <Helmet>
      <title>A SMALL DAY</title>
    </Helmet>
    <Route component={PostListPage} path={['/@:username', '/']} exact />
    {/* 배열을 넣어서 한 라우트 컴포넌트에 여러 개 경로를 쉽게 설정가능함 */}
    {/* @:username - 사용자의 아이디를 username파라미터로 읽을 수 있게 한다 */}
    <Route component={LoginPage} path="/login" />
    <Route component={RegisterPage} path="/register" />
    <Route component={WritePage} path="/write" />
    <Route component={PostPage} path="/@:username/:postId" />
    </>
  );
};

export default App;
