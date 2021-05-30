import React from 'react';
import styled from 'styled-components';
import qs from 'qs';
import Button from '../common/Button';

const PaginationBlock = styled.div`
  width: 320px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
`;
const PageNumber = styled.div``;

const buildLink = ({ username, tag, page }) => {
  const query = qs.stringify({ tag, page });
  return username ? `/@${username}?${query}` : `/?${query}`;
};

const Pagination = ({ page, lastPage, username, tag }) => {//props로 현재 선택된 계정명, 태그, 현재 페이지 숫자, 마지막 페이지 숫자를 가져옴
  return (
    <PaginationBlock>
      {/* button을 클릭하면 props로 받아 온 값을 사용하여 이동해야할 다음경로를 설정한다 */}
      <Button
        disabled={page === 1}
        to={
          page === 1 ? undefined : buildLink({ username, tag, page: page - 1 })
        }
      >
        이전
      </Button>
      
      <PageNumber>{page}</PageNumber>
      <Button
        disabled={page === lastPage}
        to={
          page === lastPage
            ? undefined
            : buildLink({ username, tag, page: page + 1 })
        }
      >
        다음
      </Button>
      {/* 마지막 페이지일 땐 다음 버튼이 비활성화됨 */}
    </PaginationBlock>
  );
};

export default Pagination;