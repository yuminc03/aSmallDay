import React from 'react';
import Responsive from '../components/common/Responsive';
import EditorContainer from '../containers/write/EditorContainer';
import TagBoxContainer from '../containers/write/TagBoxContainer';
import WriteActionButtonsContainer from '../containers/write/WriteActionButtonsContaner';
import {Helmet} from 'react-helmet-async';

const WritePage = () => {//일기쓰기 화면
    return (
        <Responsive>
            <Helmet>
                <title>글 작성하기 - A SMALL DAY</title>
            </Helmet>
            <EditorContainer/>
            <TagBoxContainer/>
            <WriteActionButtonsContainer/>
        </Responsive>
    );
};

export default WritePage;