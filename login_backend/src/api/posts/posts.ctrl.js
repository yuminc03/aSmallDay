import Post from "../../models/post";
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';//HTML을 작성하고 보여 주어야 하는 서비스에서 유용함
//HTML을 제거하는 기능, HTML만 허용하는 기능도 있어 글쓰기 API에서 악성 스크립트 삽입을 막을 수 있음

const {ObjectId} = mongoose.Types;

const sanitizedOption = {//HTMl을 필터링 할 때 허용할 것을 설정한다 
    allowedTags: [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p', 
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
    ],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemas: ['data', 'http'],
};

export const getPostById = async (ctx, next) => {
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400; //Bad Request
        return;
    }
    try{
        const post = await Post.findById(id);
        //포스트가 존재하지 않을 때
        if(!post){
            ctx.status = 404;//Not Found
            return;
        }
        ctx.state.post = post;
        return next();
    }catch(e){
        ctx.throw(500, e);
    }
};

//posts 배열 초기 데이터
// const posts = [
//     {
//         id: 1,
//         title: '제목',
//         body: '내용',
//     },  
// ];

/*포스트 작성
POST /api/posts
블로그 포스트 작성하는 API
    {
        title: '제목',
        body: '내용',
        tags: ['태그1', '태그2']
    }
*/
export const write = async (ctx) => {
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
        body: sanitizeHtml(body, sanitizedOption),
        tags,
        user: ctx.state.user, //일기를 쓸 때 사용자 정보를 넣어 DB에 저장
    });
    try{
        await post.save();//이때 데이터베이스에 저장됨
        ctx.body = post;
    }catch(e){
        ctx.throw(500, e);
    }
};

//html을 없애고 내용이 너무 길면 200자로 제한하는 함수
const removeHtmlAndShorten = body => {
    const filtered = sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length < 200 ? filtered: `${filtered.slice(0, 200)}...`;
    //내용 길이 제한 (body의 길이가 200자 이상이면 뒤에 ...을 붙이고 문자열을 자르는 기능)
};

/* 데이터 조회
GET /api/posts?username=&tag=&page=
모델 인스턴스의 find()함수를 사용한다
*/
export const list = async (ctx) => {
    //query는 문자열이기 때문에 숫자로 변환해 주어야 한다
    //값이 주어지지 않았다면 1을 기본으로 사용한다
    const page = parseInt(ctx.query.page || '1', 10);
    //페이지 기능: 처음 열 개를 불러오고 2페이지에서 그 다음 10개를 불러옴

    if(page < 1){
        ctx.status = 400;
        return;
    }
    const {tag, username} = ctx.query;
    //tag, username값이 유효하면 객체 안에 넣고 그렇지 않으면 넣지 않음
    const query = {//특정 사용자가 작성한 포스트만 조회하거나 특정 태그가 있는 포스트만 조회
        ...(username ? { 'user.username': username} : {}),
        ...(tag ? {tags: tag} : {}),
    };//username 이나 tag값이 유효할 때만 객체안에 해당 값을 넣는다

    try{
        const posts = await Post.find(query)
        .sort({_id: -1})//포스트를 역순으로 불러오기 - 1: 오름차순, -1: 내림차순
        .limit(10)//포스트가 한 번에 보이는 개수는 10개로 한다
        .skip((page - 1) * 10)
        .lean()//데이터를 처음부터 json형태로 조회할 수 있다
        .exec();//find함수를 호출하고 exec()를 붙여야 서버에 쿼리를 요청한다
    const postCount = await Post.countDocuments(query).exec();//마지막 페이지 번호 알려주기
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts.map(post => ({
        ...post,
        body: removeHtmlAndShorten(post.body),
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
export const read = async (ctx) => {
    ctx.body = ctx.state.post;
};

/*특정 포스트 제거
DELETE /api/posts/:id
remove() : 특정 조선을 만족하는 데이터를 모두 지우기
findByIdAndRemove(): id를 찾아서 지운다
findOneAndRemove(): 특정 조건을 만족하는 데이터 하나를 찾아서 제거
*/
export const remove = async (ctx) => {
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
export const update = async (ctx) => {
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

    const nextData = {...ctx.request.body}; //객체를 복사하고
    //body값이 주어졌으면 HTML 필터링
    if(nextData.body){
        nextData.body = sanitizeHtml(nextData.body, sanitizedOption);
    }
    try{
        const post = await Post.findByIdAndUpdate(id, nextData, {
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
//id로 찾은 포스트가 로그인 중인 사용자가 작성한 포스트인지 확인한다.
export const checkOwnPost = (ctx, next) => {
    const {user, post} = ctx.state;
    if(post.user._id.toString() !== user._id){
        ctx.status = 403;
        return;
    }
    return next();
};