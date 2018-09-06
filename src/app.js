import React from 'react';
import ReactDOM from 'react-dom';
import MultiSelect from '@/MultiSelect/MultiSelect';
import 'antd/dist/antd.css';

const options = [
  {key: '1', name: '盗梦空间'},
  {key: '2', name: '禁闭岛'},
  {key: '3', name: '荒野猎人'},
  {key: '4', name: '泰坦尼克号'}
]
ReactDOM.render(
  <div style={{textAlign: 'center'}}>
    <h1>Smile, Bug!</h1>
    <span>你喜欢那些电影</span>
    <MultiSelect options={options} opposite/>
  </div>,
  document.getElementById('app')
);