import React from 'react';
import styled, {css} from 'styled-components';
import {Link} from 'react-router-dom';
import palette from '../../lib/styles/palette';

const SubInfoBlock = styled.div`
  ${props =>
    props.hasMarginTop &&
    css`
      margin-top: 1rem;
    `}
  color: ${palette.gray[6]};
  /* span 사이에 가운뎃점 문자 보여주기*/
  span + span:before {
    color: ${palette.gray[4]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: '\\B7'; /* 가운뎃점 문자 */
  }
`;

const SubInfo = ({username, publishedDate, hasMarginTop}) => {
    //hasMarginTop값이 true이면 상단 여백을 주고 그렇지 않으면 여백이 없음
    //username, publishedDate를 props로 받아와서 보여준다
    return (
        <SubInfoBlock hasMarginTop={hasMarginTop}>
          <span>
            <b>
              <Link to={`/@${username}`}>{username}</Link>
            </b>
          </span>
          <span>{new Date(publishedDate).toLocaleDateString()}</span>
        </SubInfoBlock>
      );
};

export default SubInfo;