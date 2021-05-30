//포스트들을 배열로 받아 와서 렌더링한다
//사용자가 로그인 중이라면 페이지 상단 우측에 새글 작성하기 버튼을 보여 준다
import React from 'react';
import styled from 'styled-components';
import Responsive from '../common/Responsive';
import Button from '../common/Button';
import palette from '../../lib/styles/palette';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
// import { Link } from 'react-router-dom';

const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
`;

const PostItemBlock = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  /* 맨 위 포스트는 padding-top 없음 */
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }
  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[6]};
    }
  }
  p {
    margin-top: 2rem;
  }
`;

const PostItem = () => {
//   const { publishedDate, user, tags, title, body, _id } = post;

  return (
    <PostItemBlock>
        {/* <Link to={`/@${user.username}/${_id}`}>{title}</Link> */}
        <h2>제목</h2>
        <SubInfo username="username" publishedDate={new Date()} />
          <Tags tags={['태그1', '태그2', '태그3']}/>
          <p>포스트 내용의 일부분</p>
    </PostItemBlock>
  );
};

const PostList = () => {
//   // 에러 발생 시
//   if (error) {
//     return <PostListBlock>에러가 발생했습니다.</PostListBlock>;
//   }

  return (
    <PostListBlock>
      <WritePostButtonWrapper>
          <Button cyan to="/write">
            새 글 작성하기
          </Button>
      </WritePostButtonWrapper>
      <div>
          <PostItem/>
          <PostItem/>
          <PostItem/>
      </div>
    </PostListBlock>
  );
};

export default PostList;