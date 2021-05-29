import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();
//posts라우트에 여러 종류의 라우터를 설정하고 모두 printInfo 함수를 호출한다
//문자열이 아닌 json객체를 반환한다
posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

//코드를 중복해 넣지 않고 한 번만 구현하여 여러 라우트에 쉽게 적용(미들웨어 만들기)
const post = new Router(); // api/posts/:id
//ObjectId 검증이 필요한 부분
post.get('/', postsCtrl.read);
post.delete('/',checkLoggedIn, postsCtrl.remove);
post.patch('/',checkLoggedIn, postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, post.routes());

export default posts;