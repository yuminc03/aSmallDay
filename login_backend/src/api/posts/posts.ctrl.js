import Post from "../../models/post";
import mongoose from 'mongoose';
import Joi from 'joi';

const {ObjectId} = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400; //Bad Request
        return;
    }
    return next();
};

//posts 배열 초기 데이터
const posts = [
    {
        id: 1,
        title: '제목',
        body: '내용',
    },  
];

/*포스트 작성
POST /api/posts
블로그 포스트 작성하는 API
    {
        title: '제목',
        body: '내용',
        tags: ['태그1', '태그2']
    }
*/
export const write = async ctx => {
    //REST API의 Request Body는 ctx.request.body에서 조회할 수 있습니다
    //Request Body에 필요한 필드가 빠져 있다면 400오류 응답, 에러 함께 반환s
    const schema = Joi.object().keys({
        //객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), //required가 있으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array()
        .items(Joi.string())
        .required(), //문자열로 이루어진 배열
    });

    //검증하고 나서 검증 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400; //Bad Request
        ctx.body = result.error;
        return;
    }
    const {title, body, tags} = ctx.request.body;
    const post = new Post({//Post인스턴스 만들기
        title,
        body,
        tags,
    });
    try{
        await post.save();//이때 데이터베이스에 저장됨
        ctx.body = post;
    }catch(e){
        ctx.throw(500, e);
    }
};

/* 데이터 조회
GET /api/posts
모델 인스턴스의 find()함수를 사용한다
*/
export const list = async ctx => {
    //query는 문자열이기 때문에 숫자로 변환해 주어야 한다
    //값이 주어지지 않았다면 1을 기본으로 사용한다
    const page = parseInt(ctx.query.page || '1', 10);
    //페이지 기능: 처음 열 개를 불러오고 2페이지에서 그 다음 10개를 불러옴

    if(page < 1){
        ctx.status = 400;
        return;
    }

    try{
        const posts = await Post.find()
        .sort({_id: -1})//포스트를 역순으로 불러오기 - 1: 오름차순, -1: 내림차순
        .limit(10)//포스트가 한 번에 보이는 개수는 10개로 한다
        .skip((page - 1) * 10)
        .lean()//데이터를 처음부터 json형태로 조회할 수 있다
        .exec();//find함수를 호출하고 exec()를 붙여야 서버에 쿼리를 요청한다
    const postCount = await Post.countDocuments().exec();//마지막 페이지 번호 알려주기
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts.map(post => ({
        ...post,
        body:
            post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
            //내용 길이 제한 (body의 길이가 200자 이상이면 뒤에 ...을 붙이고 문자열을 자르는 기능)
    }));
    }catch(e){
        ctx.throw(500, e);
    }
};

/*특정 포스트 조회
GET /api/posts/:id
read 함수를 통해 특정 포스트를 id로 찾아서 조회하는 기능 구현
findById()를 사용하여 특정 id를 가진 데이터를 찾는다
*/
export const read = async ctx => {
    const {id} = ctx.params;
    try{
        const post = await Post.findById(id).exec();
        if(!post){
            ctx.status = 404; //Not Found
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(500, e);
    }
};

/*특정 포스트 제거
DELETE /api/posts/:id
remove() : 특정 조선을 만족하는 데이터를 모두 지우기
findByIdAndRemove(): id를 찾아서 지운다
findOneAndRemove(): 특정 조건을 만족하는 데이터 하나를 찾아서 제거
*/
export const remove = async ctx => {
    const {id} = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; //No Content (성공하기는 했지만 응답할 데이터는 없음)
    }catch(e){
        ctx.throw(500, e);
    }
};

/*포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{
    title: '수정',
    body: '수정 내용',
    tags: ['수정', '태그']
}

findByIdAndUpdate()함수를 사용,
세 가지 파라미터를 넣는다 1. id, 2. 업데이트 내용, 3. 업데이트 옵션
*/
export const update = async ctx => {
    const {id} = ctx.params;
    //write에서 사용한 schema와 비슷한데 required()가 없음
    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    });

    //검증하고 나서 검증 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;//Bad Request
        ctx.body = result.error;
        return;
    }

    try{
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, //이 값을 설정하면 업데이트된 데이터를 반환합니다.
            //false일 때는 업데이트되기 전의 데이터를 반환합니다.
        }).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(500, e);
    }
};