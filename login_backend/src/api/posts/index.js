import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

//posts라우트에 여러 종류의 라우터를 설정하고 모두 printInfo 함수를 호출한다
//문자열이 아닌 json객체를 반환한다

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.read);
posts.delete('/:id', postsCtrl.remove);
posts.put('/:id', postsCtrl.replace);
posts.patch('/:id', postsCtrl.update);

export default posts;