/***
 * 这个文件如果以plugin引入的话，
 * server端会在每个页面请求之后执行一遍export default的函数部分，并由于进程守护其余部分仅执行一遍
 * client端会在每个页面请求之后执行一遍所有代码
 * 所以要注意【重复注册】的问题
 */
import axios from 'axios';
import api from '~/utils/api.js';

console.log('插件导入');
export let httpFns = {}
export let req = null
export default (ctx, inject) => {
  console.log('注册插件到上下文');
  req = axios.create({
    baseURL: 'https://conduit.productionready.io',
  })

  // 添加响应拦截器
  req.interceptors.response.use(function (res) {
    return res.data
  }, function (error) {
    return Promise.reject(error?.response?.data);
  });

  // 添加请求拦截器
  req.interceptors.request.use(function (config) {
    // console.log(config);
    // console.log(ctx);
    if (ctx.store.state.user) {
      config.headers.Authorization = 'Token ' + ctx.store.state.user.token
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });


  // 处理接口方法
  Object.keys(api).forEach(key => {
    let valarr = api[key].split(':')

    httpFns[key] = (data1, ...args) => {
      let data2, rewriteAxiosConfigFn

      if (args.length === 1) {
        if (typeof args[0] === 'function') {
          rewriteAxiosConfigFn = args[0]
        } else {
          data2 = args[0]
        }
      } else if (args.length === 2) {
        [data2, rewriteAxiosConfigFn] = args
      }


      let p = {
        method: valarr[0],
        url: valarr[1],
      }

      // 处理url中{}的参数，输入参数名为{}内的字母
      if (/{/.test(valarr[1])) {
        p.url = valarr[1].replace(/{(\w+)}/g, w => {
          // console.log(args);
          // console.log(data1,w);
          return data1[w.slice(1, w.length - 1)]
        })
        if (valarr[0] === 'get' && data2) {
          p.params = data2
        }
        if ((valarr[0] === 'post' || valarr[0] === 'put') && data2) {
          p.data = data2
        }
      } else {
        if (valarr[0] === 'get' && data1) {
          p.params = data1
        }
        if ((valarr[0] === 'post' || valarr[0] === 'put') && data1) {
          p.data = data1
        }
      }

      // 允许重写axios的参数
      if (rewriteAxiosConfigFn) {
        // console.log(rewriteAxiosConfigFn);
        p = rewriteAxiosConfigFn(p)
      }
      // console.log(p);
      return req(p)
    }
  });

  ctx.$axios = req
  inject('axios', req)

  ctx.$httpFns = httpFns
  inject('httpFns', httpFns)
}

