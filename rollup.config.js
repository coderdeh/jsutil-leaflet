/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import json from '@rollup/plugin-json'
import postcss from "rollup-plugin-postcss" // 分离css
import cssnano from "cssnano" //压缩css代码
import postcssurl from 'postcss-url' // 图片转base64

export default {
  // 要打包的文件
  input: "src/jsutil-leaflet.js",
  output: {
    // 输出的文件 如果没有这个参数，则直接输出到控制台
    file: "dist/sgup-jsutil-leaflet.js",
    // Rollup 输出的文件类型
    format: "esm",
    name: 'sgup-jsutil-leaflet'
  },
  plugins: [
    json(),
    resolve(),
    postcss({
      plugins: [
        postcssurl({
          url: 'inline',
        }),
        cssnano(),
      ],
      extract: 'leaflet.css'
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    uglify()
  ]
}