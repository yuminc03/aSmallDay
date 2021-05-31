import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
import {Helmet} from 'react-helmet-async';

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
`;
const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${palette.gray[8]};
`;

const PostViewer = ({post, error, loading, actionButtons}) => {
  //actionButtons: postViewer의 PostHead 하단에서 보여줄 때 PostViewer에서 렌더링하면
  //무조건 PostViewer을 거쳐야해서 불편함
  //따라서 JSX형태로 받아 렌더링 하는 방법이 편하다 // 수정/삭제 버튼

  // 에러 발생 시
  if (error) {
    if (error.response && error.response.status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    }
    return <PostViewerBlock>오류 발생!</PostViewerBlock>;
  }

  // 로딩중이거나, 아직 포스트 데이터가 없을 시
  if (loading || !post) {
    return null;
  }

  const { title, body, user, publishedDate, tags } = post;
  return (
    <PostViewerBlock>
      <Helmet>
        <title>{title} - A SMALL DAY</title>
      </Helmet>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo 
          username={user.username} 
          publishedDate={publishedDate}
          hasMarginTop
        />
        <Tags tags={tags}/>
      </PostHead>
      {actionButtons}
      <PostContent dangerouslySetInnerHTML={{ __html: body}} />
      {/* dangerouslySetInnerHTML으로 HTML을 적용해줄수 있다 */}
    </PostViewerBlock>
  );
};

export default PostViewer;