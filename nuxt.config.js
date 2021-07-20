// import path from 'path';
module.exports = {
    // target: 'static',
    // 服务器部署配置
    server:{
        host: '0.0.0.0',
        port: 3000,
    },
    generate: {
        fallback: '404.html',
        // subFolders: false
    },
    // 全局css
    css: [
        '~/static/css/main.css',
        '~/static/font/googlefont.css',
    ],

    modules: [
        '~/modules/index.js'
    ],
    plugins:[
        '~/plugins/dayjs.js',
    ],
    axios: {
        // proxy: true
    },
    // build:{
    //     extend(config, {isClient}){
    //         if (isClient) {
    //             // config.devtool = 'eval-source-map'
    //             console.log(config.devtool);
    //         }
    //     }
    // },
    router:{
        mode: 'history',
        linkActiveClass:'active',
        
        // 自定义路由
        extendRoutes(routes, resolve) {
            routes.splice(0)
            // routes.length = 0
            console.log(routes);
            // 这里不能routes = [...]
            routes.push(...[
                {
                    path: '/',
                    redirect: { name: 'home' },
                    component : resolve(__dirname, 'layouts/index.vue'),
                    children: [
                        {
                            name: 'home',
                            path: '',
                            component : resolve(__dirname, 'pages/index.vue'),
                        },
                        {
                            name: 'settings',
                            path: 'settings',
                            component : resolve(__dirname, 'pages/settings.vue')
                        },
                        {
                            name: 'login',
                            path: 'login',
                            component : resolve(__dirname, 'pages/login.vue')
                        },
                        {
                            name: 'register',
                            path: 'register',
                            component : resolve(__dirname, 'pages/login.vue')
                        },
                        {
                            name: 'editor',
                            path: 'editor',
                            component : resolve(__dirname, 'pages/editor.vue')
                        },
                        {
                            name: 'article',
                            path: 'article',
                            component : resolve(__dirname, 'pages/article.vue')
                        },
                        {
                            name: 'profile',
                            path: 'profile',
                            component : resolve(__dirname, 'pages/profile.vue')
                        },
                        
                    ]
                },
            ])
        }
    }
}