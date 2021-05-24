import Joi from 'joi';//객체를 수월하게 검증하기 위한 라이브러리
import User from '../../models/user';

/*
POST /api/user/register
{
    username: 'velopert',
    password: 'mypass123'
}
*/

export const register = async ctx =>{
    //회원가입
    //Request Body 검증하기
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const { username, password } = ctx.request.body;
    try{
        //username이 이미 존재하는지 확인
        //회원가입을 할때 중복되는 계정이 생성되지 않도록 findByUsername으로 처리
        const exists = await User.findByUsername(username);//static메서드
        if(exists){
            ctx.status = 409; //Conflict
            return;
        }
        const user = new User({
            username,
        });
        await user.setPassword(password);//비밀번호 설정할 때 setPassword 인스턴스 함수 사용
        await user.save(); //데이터베이스에 저장

        //응답할 데이터에서 hashedPassword필드 제거
        //hashedPassword가 응답되지 않도록 데이터를 JSON으로 변환, delete로 해당
        //필드를 삭제
        // const data = user.toUSON();
        // delete data.hashedPassword;
        // ctx.body = data;
        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, //7일
            httpOnly: true,
        });
    }catch(e){
        ctx.throw(500, e);
    }
};

/*
POST api/user/login
{
    username: 'velopert',
    password: 'mypass123'
}
*/
export const login = async ctx =>{
    //로그인
    const {username, password} = ctx.request.body;

    //username, password가 없으면 에러 처리
    if(!username || !password){
        ctx.status = 401; //Unauthorized
        return;
    }
    try{
        const user = await User.findByUsername(username);
        //findByUsername = 사용자 데이터를 찾는다 (만약 없으면 에러처리)
        //계정이 존재하지 않으면 에러 처리
        if(!user){
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        //checkPassword = 계정이 유효하면 비밀번호를 검사, 성공하면 계정 정보 응답
        //잘못된 비밀번호
        if(!valid){
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, //7일
            httpOnly: true,
        });
    }catch(e){
        ctx.sthrow(500, e);
    }
};

/*
    GET /api/user/check
*/
export const check = async ctx =>{
    //로그인 상태 확인
    const{user} = ctx.state;
    if(!user){
        //로그인 중 아님
        ctx.status = 401;//Unauthorized
        return;
    }
    ctx.body = user;
};
export const logout = async ctx =>{
    //로그아웃
};