import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

const StyledButton = styled.button `
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.25rem 1rem;
    color: white;
    outline: none;
    cursor: pointer;
    
    background: ${palette.gray[8]};
    &:hover{
        background: ${palette.gray[6]};
    }
`;

const Button = props => <StyledButton {...props} />;

export default Button;
//굳이 리엑트 컴포넌트를 만들어서 StyledButton을 렌더링한 이유: 
//이 컴포넌트를 사용할 때 자동 import가 되게 하기 위해서.