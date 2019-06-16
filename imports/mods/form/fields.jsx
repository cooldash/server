import React, { useMemo } from 'react';
import {
  Slider,
  Select,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Input,
  InputNumber,
  Radio,
  Button,
} from 'antd';
import { get } from 'lodash';

import moment from 'moment';
import { T } from '../../i18n';
import componentManager, { DEFAULT_TYPE } from './component-manager';

export class Date extends React.Component {
  render() {
    const { value, onChange, ...props } = this.props;
    return (<DatePicker
      value={value && (value.isMoment ? value : moment(value))}
      onChange={date => {
        onChange(date && date.toDate());
      }}
      {...props}
    />);
  }
}

export class DateField extends React.Component {
  render() {
    const { value, onChange, component, ...props } = this.props;
    const Picker = component || DatePicker;
    return (<Picker
      value={value && (value.isMoment ? value : moment(value))}
      onChange={date => {
        onChange(date && date.toDate());
      }}
      {...props}
    />);
  }
}

export class RangeDateField extends React.Component {
  render() {
    const { value, onChange, ...props } = this.props;
    return (<RangePicker
      value={value && [moment(value[0]), moment(value[1])]}
      onChange={date => {
        onChange([date[0].startOf('day').toDate(), date[1].endOf('day').toDate()]);
      }}
      {...props}
    />);
  }
}

const indexOr = (ind, def) => (ind >= 0 ? ind : def);

export const Selector = ({ options, value, onChange, ...props }) => {
  const opt = useMemo(() => options.map(o => (typeof o === 'object' ? o : { value: o, label: o })), [options]);
  const change = i => onChange(opt[i].value);
  const val = indexOr(opt.findIndex(o => o.value === value), '');
  return (
    <Select
      {...props}
      value={val}
      onChange={change}
    >
      {opt.map((o, i) => (
        <Select.Option value={i} key={i}>{o.label}</Select.Option>
      ))}
    </Select>
  );
};

export class SelectTags extends React.Component {
  render() {
    const { options, onChange, ...props } = this.props;
    return (
      <Select
        mode="tags"
        {...props}
        onChange={value => {
          onChange(value);
        }}
      >
        {options && options.map(o => (
          <Select.Option value={o} key={o}>{o}</Select.Option>
        ))}
      </Select>
    );
  }
}

const verticalStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

export class SelectRadio extends React.Component {
  render() {
    const { options, onChange, layout = 'vertical', ...props } = this.props;
    const style = layout === 'vertical' ? verticalStyle : undefined;
    return (
      <Radio.Group
        {...props}
        onChange={evt => {
          onChange(evt.target.value);
        }}
      >
        {options.map(o => (
          typeof o === 'object'
            ? <Radio style={style} value={o.value} key={o.label}>{o.label}</Radio>
            : <Radio style={style} value={o} key={o}>{o}</Radio>
        ))}
      </Radio.Group>
    );
  }
}

export const createEnumSelector = enm => props => {
  const options = enm.getValues().map(value => ({ label: T(value), value }));

  return <Selector
    options={options}
    {...props}
  />;
};

export class SliderField extends React.Component {
  componentDidMount() {
    // reset value to min if not set
    const { min, value, onChange } = this.props;
    onChange(value || min);
  }

  render() {
    const { min, max, value, onChange, ...props } = this.props;
    return (
      <Row>
        <Col span={7}>
          <InputNumber
            min={min}
            max={max}
            style={{ marginRight: 16 }}
            value={value}
            onChange={onChange}
          />
        </Col>
        <Col span={16}>
          <Slider
            {...props}
            min={min}
            max={max}
            onChange={onChange}
            value={value}
          />
        </Col>
      </Row>
    );
  }
}

export class SliderVerticalField extends React.Component {
  render() {
    const { min, max, value, onChange, defaultMarks, marks, ...props } = this.props;

    const _marks = marks || {};

    if (defaultMarks) {
      if (min < 0) {
        _marks[0] = '0';
      }

      _marks[min] = `${min}`;
      _marks[max] = `${max}`;
    }
    const sliderMargin = (!props.range) ? { marginRight: (props.inputSize || 60) / 2 } : {};

    return (
      <div>
        {props.range
          ? <Row type="flex" justify="center" align="top">
            <Col span={12}>
              <InputNumber
                size="small"
                min={min}
                max={max}
                value={value[0]}
                step={props.step}
                style={{ width: props.inputSize }}
                onChange={val => onChange([val, value[1]])}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                size="small"
                min={min}
                max={max}
                step={props.step}
                value={value[1]}
                style={{ width: props.inputSize }}
                onChange={val => onChange([value[0], val])}
              />
            </Col>
          </Row>
          :
          <Row type="flex" justify="left" align="top">
            <Col span={12}>
              <InputNumber
                size="small"
                min={min}
                max={max}
                step={props.step}
                value={value}
                onChange={onChange}
              />
            </Col>
          </Row>
        }
        <Row type="flex" justify="center" align="top"
             style={{ marginTop: props.sliderMarginTop || 16, ...sliderMargin }}>
          <Col span={4}>
            <Slider
              {...props}
              marks={_marks}
              vertical
              min={min}
              max={max}
              defaultValue={props.range ? [value[0], value[1]] : value}
              step={props.step}
              style={{ height: props.sliderHeight || 200 }}
              onChange={onChange}
              value={value}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export class CheckboxField extends React.PureComponent {
  render() {
    const { value, ...props } = this.props;
    return (<Checkbox {...props} checked={value} />);
  }
}

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// Registration default components
componentManager.registerComponent('textarea', Input.TextArea);
componentManager.registerComponent('String', props => <Input {...props} style={{ width: '100%' }} />);
componentManager.registerComponent('Number', props => <InputNumber {...props} style={{ width: '100%' }} />);
componentManager.registerComponent('Boolean', CheckboxField);
componentManager.registerComponent('Date', props => (
  <DateField
    format="DD.MM.YYYY"
    {...props}
    style={{ width: '100%' }}
  />
));
componentManager.registerComponent('date.month', props => <DateField component={MonthPicker} {...props}
                                                                     style={{ width: '100%' }} />);
componentManager.registerComponent('date.range', props => <RangeDateField {...props}
                                                                          style={{ width: '100%' }} />);
componentManager.registerComponent('date.week', props => <DateField component={WeekPicker} {...props}
                                                                    style={{ width: '100%' }} />);
componentManager.registerComponent('slider', SliderField);
componentManager.registerComponent('slider.vertical', SliderVerticalField);
componentManager.registerComponent('select', props => <Selector {...props} style={{ width: '100%' }} />);
componentManager.registerComponent('select.tags', SelectTags);
componentManager.registerComponent('select.radio', SelectRadio);
componentManager.registerComponent('submit', props => (
  <Button htmlType="submit" type="primary">
    {props.title || 'Submit'}
  </Button>
));
componentManager.registerComponent(DEFAULT_TYPE, Input);
