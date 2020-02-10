import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  history: 'hash', // url模式
  base: '/admin/',
  publicPath: '/admin/',
  routes: [
    {
      path: '/login',
      component: '../layouts/LoginLayout',
      routes: [{ path: '/login', component: '../pages/Auth/Login' }]
    },
    {
      path: '/',
      component: '../layouts/AdminLayout',
      routes: [
        { path: '/', component: '../pages/Dashboard/Index' },
        { path: '/index', component: '../pages/Dashboard/Index' },
        { path: '/dashboard/index', component: '../pages/Dashboard/Index' },
        { path: '/quark/engine', component: '../pages/Quark/Engine' }
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'quark',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  proxy: {
    '/api': {
      target: 'http://www.project.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    }
  }
}

export default config;
