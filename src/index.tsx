import React, { useState, useEffect } from "react";

var formState = {};
interface FormValidator {
  [key: string]: number;
}
var formValidator: FormValidator = {};
var list = {};
var trySubmit = false;

const excludeListDataAttr = (obj: object) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => k.slice(0, 4) !== "data")
  );
};

const validateForm = () => {
  return Object.values(formValidator).reduce((a, b) => a + b, 0) === 0;
};

const validateInput = (fieldState, name) => {
  let error: string = "";
  const regex: string =
    name in list && "data-pattern" in list[name]
      ? list[name]["data-pattern"]
      : "(.)*";
  if (fieldState && !new RegExp(`^${regex}$`, "is").test(fieldState)) {
    error =
      name in list && "data-error-message" in list[name]
        ? list[name]["data-error-message"]
        : "input must match allowed characters";
  } else {
    if (name in list && fieldState === "" && "data-required" in list[name])
      error =
        "data-required-message" in list[name]
          ? list[name]["data-required-message"]
          : "field is required";
  }
  formValidator[name] = error ? 1 : 0;
  return error ? <div>{error}</div> : "";
};

const Input = (props) => {
  const [fieldState, setFieldState] = useState(
    "name" in props && props.name in formState
      ? formState[props.name]
      : "value" in props
      ? props.value
      : ""
  );
  const changeState = (e) => {
    formState[props.name] = e.target.value;
    setFieldState(e.target.value);
  };
  const addListProps =
    "name" in props && props.name in list ? list[props.name] : {};

  return (
    <>
      <input
        {...props}
        {...excludeListDataAttr(addListProps)}
        onChange={changeState}
        onBlur={changeState}
        onFocus={changeState}
        value={fieldState}
      />
      {("name" in props &&
        props.name in formState &&
        validateInput(fieldState, props.name)) ||
        (trySubmit && "name" in props && validateInput(fieldState, props.name))}
    </>
  );
};

const Textarea = (props) => {
  const [fieldState, setFieldState] = useState(
    "name" in props && props.name in formState
      ? formState[props.name]
      : "value" in props
      ? props.value
      : ""
  );
  const changeState = (e) => {
    formState[props.name] = e.target.value;
    setFieldState(e.target.value);
  };
  const addListProps =
    "name" in props && props.name in list ? list[props.name] : {};

  return (
    <>
      <textarea
        {...props}
        {...excludeListDataAttr(addListProps)}
        onChange={changeState}
        onBlur={changeState}
        onFocus={changeState}
        value={fieldState}
      >
        {fieldState}
      </textarea>
      {("name" in props &&
        props.name in formState &&
        validateInput(fieldState, props.name)) ||
        (trySubmit && "name" in props && validateInput(fieldState, props.name))}
    </>
  );
};

const submitForm = (formRef) => {
  formRef.submit();
};

const checkClear = (e) => {
  return e.target.type === "reset" ? true : false;
};

const Formatron = (props) => {
  const [formComponentState, setFormComponentState] = useState(
    props.form.props.children
  );
  const [validSubmit, setValidSubmit] = useState(2);

  useEffect(() => {
    setFormComponentState(props.form.props.children);
  }, [props.form.props.children]);

  const action = "action" in props ? props.action : "/";
  const method = "method" in props ? props.method : "post";
  if ("list" in props) list = props.list;
  const FormBody = ({ componentsList }) => componentsList;

  return (
    <form
      method={method}
      action={action}
      onClick={(e) => {
        if (checkClear(e) && validSubmit > 0) {
          trySubmit = false;
          formState = {};
          setValidSubmit(new Date().getTime());
        }
      }}
      onSubmit={(e) => {
        trySubmit = true;
        e.preventDefault();
        setTimeout(() => {
          if (validateForm())
            if ("onSubmit" in props) props.onSubmit(formState);
            else submitForm(e.target);
        }, 0);
        setValidSubmit(new Date().getTime());
        return;
      }}
    >
      <FormBody componentsList={formComponentState} />
    </form>
  );
};
export { Formatron, Input, Textarea };
