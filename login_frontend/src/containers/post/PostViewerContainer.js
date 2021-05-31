import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';//URL 파라미터로 받아 온 id값을 조회하는데 필요
import { readPost, unloadPost } from '../../modules/post';
import PostViewer from '../../components/post/PostViewer';
import PostActionButtons from '../../components/post/PostActionButtons';// 수정/삭제 버튼
import {setOriginalPost} from '../../modules/write';//수정 버튼 클릭시 글쓰기 페이지로 이동
import {removePost} from '../../lib/api/posts';

const PostViewerContainer = ({ match, history}) => {//PostViewer를 위한 컨테이너 컴포넌트
    // 처음 마운트될 때 포스트 읽기 API 요청
    const { postId } = match.params;
    const dispatch = useDispatch();
    const { post, error, loading, user} = useSelector(({ post, loading, user }) => ({
        post: post.post,
        error: post.error,
        loading: loading['post/READ_POST'],
        user: user.user,
    }));

    useEffect(() => {
        dispatch(readPost(postId));
        // 언마운트될 때 리덕스에서 포스트 데이터 없애기
        return () => {
          dispatch(unloadPost());
        };
    }, [dispatch, postId]);

    const onEdit = () => {
      dispatch(setOriginalPost(post));
      history.push('/write');
    };

    const onRemove = async () => {
      try{
        await removePost(postId);
        history.push('/');// 홈으로 이동
      }catch(e){
        console.log(e);
      }
    }

    const ownPost = (user && user._id) === (post && post.user._id); 
    //현재 사용자가 보고 있는 포스트가 자신의 포스트일 때만 PostActionButtons가 나타남

    return (
      <PostViewer
      post = {post} 
      loading={loading} 
      error={error}
      actionButtons={ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />}
      />
    );
};

export default withRouter(PostViewerContainer);