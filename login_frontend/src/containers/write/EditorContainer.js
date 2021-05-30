import React, { useEffect, useCallback } from 'react';
import Editor from '../../components/write/Editor';
import { useSelector, useDispatch } from 'react-redux';
import { changeField, initialize } from '../../modules/write';

//./write에 있는 컴포넌트 각각의 컨테이너 컨포넌트 만들기
const EditorContainer = () => {
    const dispatch = useDispatch();
    const { title, body } = useSelector(({ write }) => ({
      title: write.title,
      body: write.body,
    }));
    const onChangeField = useCallback(payload => dispatch(changeField(payload)), [
      dispatch,
    ]);//changeField를 useCallback로 감싸면 userErrect에서 onChangeFeild를 사용할 수 있다
    // 언마운트될 때 초기화
    useEffect(() => {
      return () => {
        dispatch(initialize());
      };
    }, [dispatch]);
    return <Editor onChangeField={onChangeField} title={title} body={body} />;
  };
  
  export default EditorContainer;