# 驾驶舱基础规范

### 基础脚手架
```bash
// 脚手架初始化
$ ccli init project-cockpit

// 依赖安装
$ yarn

// 本地运行
$ npm run dev

// 打包
$ npm run build
```


项目安装前请自行新建 .gitignore 文件，示例：
```
.DS_Store
node_modules
dist

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.tar.gz
*.zip
*lock.json
``` 

### demo
![demo页](https://note.youdao.com/yws/api/personal/file/WEBee845ed6161eecbac77adf42be848c7f?method=download&shareKey=9692d49ad18937a42fc7be9db362e29c)


### 项目目录
```
|--public                    // 公共文件
|--src 
    |--api                   // api接口地址
    |--assets                // 静态文件
        |--images            // 基础图片或图标
    |--components            // 基础组件
    |--Layout                // 页面框架
    |--mixins                // 全局混入
    |--router                // 路由
    |--store                 // 状态管理
        |--modules           // 模块化状态
    |--styles                // 基础样式
        |--mixins.scss       // 样式混入
        |--index.scss        // 全局基础样式
        |--variables         // 全局样式变量在此文件中定义
    |--utils                 // 公共方法
        |--prototype.js      // 全局绑定的属性或方法处理
        |--index.js          // 公共方法封装
        |--request           // axios实例，请求封装
    |--views                 // 页面组件文件夹
    |--main.js               // 入口文件
    |--permission.js         // 权限三中心逻辑
|--.env.xxx                  // 环境变量
|--package.json
|--version.js                // 生成发布git版本控制文档
|--vue.config.js
```

### 框架功能

1. 图表组件、可视化组件
    参考[组件广场](http://10.162.12.172:8000/#/Charts)
    > 注：src/components/ 里的组件已全局引用，可直接进行使用，无须在组件里再次import，组件使用时，加上Base前缀。

2. 驾驶舱layout
    目前驾驶舱分为导航区和内容区，导航区由一个标题部分和两侧路由导航区组成；内容区为左右两侧有侧边栏图标内容区，中间为KV展示区。
    其中：
    
    `/src/components/selfAdaptionFrame` 下是主内容区的组件部分，里面划分了left-area、mid-area、right-area三个部分，并定义了侧边栏tab切换时的逻辑；
    
    `/src/components/independentForms` 下是侧边栏组件，可以在里面修改其样式。
    
    驾驶舱单张屏的侧边栏tab数据，可通过传递titleList数组来定制：
    
    在组件 BaseSelfAdaptionFrame 上，
    ```
    <BaseSelfAdaptionFrame :title-list="titleList" />
    
    titleList: [
        ['经济实力','增长潜力'],
        ['富裕程度','绿色水平']
      ]
    ```
    默认显示的，放在数组的第一位。
    
3. 地图方便，框架里默认引入高德地图，请根据项目需要自行切换

4. 目前屏幕适配方便主要是16：9与32：9的适配，请判断计算属性 is32 来进行适配（该属性存在store里）。特殊kv的适配，还增加了21：9的比例适配，可根据 is21 来进行。
