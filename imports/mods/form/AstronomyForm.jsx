import React, { createContext, useContext } from 'react';
import { Form } from 'antd';
import { connect, Field as FormikField, Formik, getIn } from 'formik';
import map from 'lodash/map';
import { Astro } from 'meteor/treenity:astronomy';

import { warn } from '../../utils/log';
import { T } from '../../i18n';

import componentManager from './component-manager';
import { getTypeName } from '../tree';

export const FormContext = createContext(null);
const FormProvider = FormContext.Provider;
export const useField = () => useContext(FormContext);

const getInputByType = (name, type, field = {}, props) => {
  const typeName = typeof type === 'string'
    ? type
    : (field instanceof Astro.ListField) // support arrays fields
      ? [field.type.name]
      : (type instanceof Astro.Type)
        ? type.name
        : getTypeName(type);

  const formAttrs = field.form;
  const Component = componentManager.getComponent(typeName, formAttrs);

  const fieldProps = {};
  if (field.type && field.type.class && field.type.class.getPropertyFields) {
    const fields = type.class.getPropertyFields();

    if (Array.isArray(fields)) {
      fields.forEach(item => {
        if (field[item]) {
          fieldProps[item] = field[item];
        }
      });
    } else if (field[fields]) {
      fieldProps[fields] = field[fields];
    }
  }

  // if (!Component.useSubmitFormHandler) {
  //   delete props['submitFormHandler'];
  // }
  //
  if (formAttrs && formAttrs.attrs) {
    Object.assign(fieldProps, formAttrs.attrs);
  }

  if (!Component) {
    console.warn('Component not found for astronomy field', name, 'of type', typeName);
    return null;
  }
  const supportType = Component.supportType
    ? typeName
    : undefined;

  return <Component name={name} type={supportType} {...fieldProps} {...props} onChange={props.onChange(name)} />;
};

const LABEL_COL = { span: 8 };
const WRAPPER_COL = { span: 16 };


class AstronomyFormComponent extends React.PureComponent {
  static defaultProps = {
    value: {},
    layout: 'horizontal',
  };

  componentDidMount() {
    if (this.props.onFormSubscribe) {
      this.props.onFormSubscribe(this.submitForm);
    }
  }

  submitForm = handler => {
    const form = this.props.form;

    form.validateFields(handler);
  };

  onSubmit = (values, actions) => {
    // event.preventDefault();
    // const form = this.props.form;
    actions.setSubmitting(false);
    actions.validateForm(values);
    // form.validateFields(() =>
    this.props.onSubmit(values, actions);
  };

  Field = connect(({
    label,
    name,
    formik,
    validate,
    colon,
    wrapperCol = WRAPPER_COL,
    labelCol = LABEL_COL,
    field,
    type,
    layout,
    extra,
    itemStyle,
    ...rest
  }) => {
    const touched = getIn(formik.touched, name) || formik.submitCount > 0;
    const error = touched ? getIn(formik.errors, name) : null;
    const l = getIn(field, 'form.label', (label || label === '') ? label : name);

    // if (layout === 'inline') {
    //   wrapperCol = null;
    //   labelCol = null;
    //   l = null;
    // }

    return (
      <Form.Item
        label={T(l)}
        colon={colon}
        wrapperCol={wrapperCol}
        labelCol={labelCol}
        hasFeedback={!!(touched && error)}
        validateStatus={error && 'error'}
        help={error}
        style={itemStyle}
        extra={extra}
      >
        <FormikField
          name={name}
          render={
            ({ field: formikField }) => {
             return getInputByType(name, type || field.type, field, { ...formikField, ...rest });
            }
          }
          validate={validate}
        />
      </Form.Item>
    );
  });


  render() {
    const { children, value, validate, layout, ...rest } = this.props;
    return (
      <Formik
        initialValues={value}
        onSubmit={this.onSubmit}
        validate={validate}
        ref="formik"
        render={props => (
          <FormProvider value={this.Field}>
          <Form
            {...rest}
            layout={layout}
            onSubmit={props.handleSubmit}
          >
            {typeof children === 'function' ? children(this, props) : children}
          </Form>
          </FormProvider>
        )}
      />
    );
  }
}

export class AstronomyAutoForm extends React.Component {
  submitFormHandler = (handler, field) => {
    if (!this.handler) {
      this.handler = [];
    }
    this.handler.push([handler, field]);
  };

  onSubmit = (data, actions) => {
    const { doc, onSubmit } = this.props;
    if (this.handler) {
      this.handler.forEach(([h, f]) => h(doc, f));
    }
    onSubmit(data, actions);
  };

  onValidate = values => {
    const Type = this.getType();
    // cleanup optional fields if empty in form
    Type.getFields().forEach(f => {
      if (f.optional && values[f.name] === '')
        values[f.name] = undefined;
    });
    const obj = new Type(values);
    return new Promise(res => obj.validate(errs => {
      res(errs);
    }));
  };

  getType() {
    const { value, type } = this.props;
    return type || value.constructor;
  }

  render() {
    const { value, children, labelCol, wrapperCol, type, fields, itemStyle, ...props } = this.props;
    const t = this.getType();

    let typeFields = t.getFields()
      .filter(f => !(f.name.startsWith('_') || f.name === 'createdAt' || f.name === 'updatedAt' || f.name === 'id'));

    // merge in form options
    if (fields) {
      const temp = [];
      map(fields, (val, key) => {
        const field = typeFields.find(f => f.name === key);
        if (!field) return warn('field', key, 'not found in', t.className);
        // if just true - add field as is, else extend form prop
        temp.push(val === true
          ? field
          : ((field.form = { ...field.form, ...val }), field)
        );
      });
      typeFields = temp;
    }

    return (
      <AstronomyFormComponent
        {...props}
        value={value}
        onSubmit={this.onSubmit}
        validate={this.onValidate}
      >{({ Field }) => (
        <>
          {typeFields.map(field => (
            <Field
              name={field.name}
              key={field.name}
              field={field}
              labelCol={labelCol || { span: 8 }}
              wrapperCol={wrapperCol || { span: 16 }}
              // submitFormHandler={handler => this.submitFormHandler(handler, field.name)}
              validate={v => new Promise((res, rej) => {
                t.validate(
                  { [field.name]: v },
                  { fields: [field.name] },
                  err => (err ? rej(err.reason) : res()),
                );
              })}
              layout={props.layout}
              itemStyle={itemStyle}
            />
          ))}
          {children}
        </>
      )}
      </AstronomyFormComponent>
    );
  }
}

const AstronomyForm = AstronomyFormComponent;

export default AstronomyForm;


// ///////////////////////////////////////////////
// Custom form
// export const AstronomyCustomForm
