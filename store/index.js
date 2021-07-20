
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined
// const Cookie = require('js-cookie')
const cookieparser = process.server ? require('cookieparser') : undefined
// 在服务端渲染期间运行都是同一个实例
// 为防止数据冲突,务必要把state 定义成一个函数,返回数据对象
export const state = () => {
    return {
        // 用户信息
        user: null
    }
}

export const mutations = {
    setUser(state, data) {
        state.user = data
        Cookie?.set('user', data)
    },

    logout(state) {
        state.user = null
        Cookie.remove('user')
        this.$router.push('/login')
    }
}

export const actions = {
    // nuxtServerInit 是一个特殊的 action 方法
    // 这个action会在服务端渲染期间自动调用
    // 作用：初始化容器数据，传递数据给客户端使用
    nuxtServerInit({ commit }, { req }) {
        let user = null

        if (req && req.headers.cookie) {
            const parsed = cookieparser.parse(req.headers.cookie)

            try {
                user = JSON.parse(parsed.user)
            } catch (error) {

            }
            console.log('nuxtServerInit');
            // console.log('user:',user);
            commit('setUser', user)
        }
    }
}