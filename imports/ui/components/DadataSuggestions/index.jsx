import React, { PureComponent, Fragment } from 'react';
import { AutoComplete } from 'antd';
import DaData from '../../../utils/dadata';

// import './styles.css'

function debounce(fn, delay) {
  let timer = null;

  return delay
    ? function () {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    }
    : fn;
}

const initialState = {
  value: '',
  suggestions: [],
  // focusedIndex: -1,
  // isOpen: false,
};

class DadataSuggestions extends PureComponent {
  static defaultProps = {
    token: '',
    value: '',
    min: 2,
    count: 10,
    delay: 1000,
  };

  constructor(props) {
    super(props);

    this.state = initialState;

    if (!props.token) {
      console.warn('react-suggestions: You need pass dadata api-key to props. See https://dadata.ru/api/suggest/');
    }

    this.dadata = new DaData({ token: props.token });
  };

  componentDidMount() {
    this.setState({
      value: this.props.value,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  };

  loadSuggestions = debounce((value, token, count, locations = []) => {
    return this.dadata.suggestions('address', value, { count, locations })
      .then(suggestions => {
        if (suggestions) {
          this.setState({ suggestions });
        }
      });
  }, this.props.delay);

  handleChange = (value) => {
    const { min, token, count, delay, locations } = this.props;

    if (!token) {
      return;
    }

    const state = { value, isOpen: true };

    if (value.length < min) {
      state.suggestions = [];
    } else {
      this.loadSuggestions(value, token, count, locations);
    }

    this.setState(state);
  };

  handleFocus = (evt) => {
    const { onFocus } = this.props;

    this.setState({ isOpen: true });

    if (typeof onFocus === 'function') onFocus(evt);
  };

  handleBlur = (event) => {
    const { onBlur } = this.props;
    const { suggestions } = this.state;

    this.setState({
      isOpen: false,
      focusedIndex: -1,
    });

    if (typeof onBlur === 'function') onBlur(event, suggestions[0]);
  };


  handleSelect = (value) => {
    const { onChange } = this.props;
    const { suggestions } = this.state;

    const suggestion = suggestions.find(s => s.value === value);
    if (!suggestion) {
      return;
    }

    this.setState({
      value,
      isOpen: false,
    });

    if (typeof onChange === 'function') {
      onChange({
        ...suggestion.data,
        value: suggestion.value,
        unrestricted_value: suggestion.unrestricted_value,
      });
    }
  };

  render() {
    const { value: omit, placeholder, token, min, count, suggestionsClass, delay, locations, renderSuggestions, ...rest } = this.props;
    const { value, suggestions, isOpen, focusedIndex } = this.state;

    return (
      <AutoComplete
        dataSource={suggestions}
        value={value}
        delay={500}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        placeholder={placeholder}
      />
    );
  };
}

export default DadataSuggestions;
