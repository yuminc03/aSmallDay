import React from 'react';
import Editor from '../components/write/Editor';
import Responsive from '../components/common/Responsive';

const WritePage = () => {//일기쓰기 화면
    return (
        <Responsive>
            <Editor/>
        </Responsive>
    );
};

export default WritePage;