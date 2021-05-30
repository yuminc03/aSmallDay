import React, { useEffect } from 'react';
import WriteActionButtons from '../../components/write/WriteActionButtons';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { writePost } from '../../modules/write';

//
const WriteActionButtonsContainer = ({ history }) => {
  const dispatch = useDispatch();
  const { title, body, tags, post, postError } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    post: write.post,
    postError: write.postError,
  }));

  // 포스트 등록
  //현재 리덕스 스토어 안에 들어 있는 값을 사용하여 새 포스트를 작성한다 
  const onPublish = () => {
    dispatch(
      writePost({
        title,
        body,
        tags,
      }),
    );
  };

  // 취소
  //history객체를 사용하여 취소버튼을 누르면 브라우저에서 뒤로 가기 한다
  //라우터가 아닌 컴포넌트에서 history객체를 사용하기 위해 widthRouter로 컴포넌트를 감싸고 컨테이너를 만듦
  const onCancel = () => {
    history.goBack();
  };

  // 성공 혹은 실패시 할 작업
  useEffect(() => {
    if (post) {//일기 작성에 성공하면  서버에서 응답한 포스트 정보의 
        //_id와 username값을 참조하여 포스트를 읽을 수 있는 경로를 만들고
        //history.push를 사용하여 경로로 이동한다
      const { _id, user } = post;
      history.push(`/@${user.username}/${_id}`);
    }
    if (postError) {
      console.log(postError);
    }
  }, [history, post, postError]);
  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} />;
};

export default withRouter(WriteActionButtonsContainer);