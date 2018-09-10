import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';
import {Select} from 'antd';
import _ from 'lodash';

const Option = Select.Option;

@observer
class MultiSelectField extends Component {
  @observable selectIds = [];

  constructor(props) {
    super(props);
    this.changeSelectIds(props.value || [_.get(props, 'defaultOption.id') || 'all']);
  } 
  @action
  componentWillReceiveProps(nextProps) {
    if (nextProps.moreOptionIds && nextProps.moreOptionIds.length !== this.props.moreOptionIds.length) {
      const addItems = nextProps.moreOptionIds.filter(id => this.props.moreOptionIds.indexOf(id) === -1);
      const oldSelectId = this.selectIds.slice();
      if (typeof oldSelectId === 'string') {
        this.selectIds = [oldSelectId, ...addItems];
      } else {
        this.selectIds = [...oldSelectId, ...addItems];
      }
    }
    if (nextProps.value !== this.props.value) {
      if (nextProps.value.indexOf('all') === -1) {
        this.selectIds = nextProps.value;
      } else {
        this.selectIds = ['all'];
      }
    }
  }
  @action changeSelectIds = value => {
    this.selectIds = value;
  }

  @action
  change = value => {
    const {options, moreOptionIds = [], moreOptionChange, opposite} = this.props;
    // 处理change是否为更多选项的
    let moreChangeOk = [];
    let moreChangeCancel = [];
    if (moreOptionChange) {
      moreOptionIds.forEach(id => {
        if (value.indexOf(id) === -1) {
          moreChangeCancel.push(id);
        } else {
          moreChangeOk.push(id);
        }
      });
    }
    // 处理是否全选
    if (value.indexOf('all') === -1) {
      this.selectIds = value;
    } else {
      this.selectIds = ['all', ...moreChangeOk];
    }
    // 反选的值
    let oppositeValue = [];
    if(opposite && value.indexOf('opposite') !== -1) {
      options.forEach(o => {
        if(!_.includes(value, o.key) && o.key !== 'all') {
          oppositeValue.push(o.key);
        }
      });
      this.selectIds = oppositeValue;
    }

    if (this.props.onChange) {
      if(value.indexOf('opposite') === -1) {
        this.props.onChange(value);
      }else {
        this.props.onChange(oppositeValue);
      }
    }
  }

  render() {
    const {options, wrapStyle, label, reset, opposite, defaultOption, moreOptionIds, value, ...other} = this.props;
    let finalOptions = _.map(options, option => (
      <Option key={option.key}>{option.name}</Option>
    ));
    if(this.selectIds.length > 0 && this.selectIds.indexOf('all') === -1 && opposite) {
      finalOptions.unshift(<Option key='opposite'>反选</Option>);
    }
    finalOptions.unshift(
      <Option key={_.get(defaultOption, 'id') || 'all'}>{_.get(defaultOption, 'name') || '全部'}</Option>
    );
    return (
      <div className='qn-form-item' style={wrapStyle}>
      {label ? <label>{label}：</label> : null}
        <Select
          mode="multiple"
          style={{minWidth: 160}}
          optionFilterProp='children'
          notFoundContent='无法找到'
          {...other}
          onChange={this.change}
          value={reset ? ['all'] : this.selectIds.slice()}
        >
          {finalOptions}
        </Select>
      </div>
    );
  }
}

export default MultiSelectField;
