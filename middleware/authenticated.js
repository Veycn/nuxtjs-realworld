/**
 * 验证是否登录的中间件,没有登录则跳转到登录页
 */
export default function({store, redirect}){
    if(!store.state.user) {
        return redirect('/login')
    }
}