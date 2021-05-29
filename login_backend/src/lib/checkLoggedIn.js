//로그인 해야한 일기쓰기, 수정, 삭제를 할 수 있도록 하는 코드
//lib리렉터리에 저장하는 이유 - 다른 라우트에서도 사용될 수 있기 때문
//더 쉽게 재사용할 수 있도록 lib디렉터리에 저장
const checkLoggedIn = (ctx, next) => {
    if(!ctx.state.user){
        ctx.status = 401; //Unauthorized
        return;//로그인 상태가 아니면 401 HTTP Status를 반환
    }
    return next();
};

export default checkLoggedIn;