import React from 'react';
import styled, {css} from 'styled-components';
import {Link} from 'react-router-dom';
import palette from '../../lib/styles/palette';

const buttonStyle = css `
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.25rem 1rem;
    color: white;
    outline: none;
    cursor: pointer;
    
    background: ${palette.purple[1]};
    &:hover{
        background: ${palette.purple[0]};
    }
    
    ${props => 
    props.fullWidth &&
    css`
        padding-top: 0.75rem;
        padding-bottom:0.75rem;
        width: 100%;
        font-size: 1.125rem;
    `}

    ${props => 
        props.cyan &&
        css`
        background: ${palette.cyan[5]};
        &:hover{
            background: ${palette.cyan[4]};
        }
    `}

    &: disabled{
        background: ${palette.gray[3]};
        color: ${palette.gray[5]};
        cursor: not-allowed;
    }
`;

const StyledButton = styled.button`
    ${buttonStyle}
`;

const StyledLink = styled(Link)`
    ${buttonStyle}
`;

const Button = props =>{
    return props.to ? (
       <StyledLink {...props} cyan={props.cyan ? 1 : 0} />
    ):(
        <StyledButton {...props}/>
    );
};
    
export default Button;
//굳이 리엑트 컴포넌트를 만들어서 StyledButton을 렌더링한 이유: 
//이 컴포넌트를 사용할 때 자동 import가 되게 하기 위해서.