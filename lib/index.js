"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textarea = exports.Input = exports.Formatron = void 0;
const react_1 = __importStar(require("react"));
var formState = {};
var formValidator = {};
var list = {};
var trySubmit = false;
const excludeListDataAttr = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => k.slice(0, 4) !== "data"));
};
const validateForm = () => {
    return Object.values(formValidator).reduce((a, b) => a + b, 0) === 0;
};
const validateInput = (fieldState, name) => {
    let error = "";
    const regex = name in list && "data-pattern" in list[name]
        ? list[name]["data-pattern"]
        : "(.)*";
    if (fieldState && !new RegExp(`^${regex}$`, "is").test(fieldState)) {
        error =
            name in list && "data-error-message" in list[name]
                ? list[name]["data-error-message"]
                : "input must match allowed characters";
    }
    else {
        if (name in list && fieldState === "" && "data-required" in list[name])
            error =
                "data-required-message" in list[name]
                    ? list[name]["data-required-message"]
                    : "field is required";
    }
    formValidator[name] = error ? 1 : 0;
    return error ? react_1.default.createElement("div", null, error) : "";
};
const Input = (props) => {
    const [fieldState, setFieldState] = (0, react_1.useState)("name" in props && props.name in formState
        ? formState[props.name]
        : "value" in props
            ? props.value
            : "");
    const changeState = (e) => {
        formState[props.name] = e.target.value;
        setFieldState(e.target.value);
    };
    const addListProps = "name" in props && props.name in list ? list[props.name] : {};
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("input", { ...props, ...excludeListDataAttr(addListProps), onChange: changeState, onBlur: changeState, onFocus: changeState, value: fieldState }),
        ("name" in props &&
            props.name in formState &&
            validateInput(fieldState, props.name)) ||
            (trySubmit && "name" in props && validateInput(fieldState, props.name))));
};
exports.Input = Input;
const Textarea = (props) => {
    const [fieldState, setFieldState] = (0, react_1.useState)("name" in props && props.name in formState
        ? formState[props.name]
        : "value" in props
            ? props.value
            : "");
    const changeState = (e) => {
        formState[props.name] = e.target.value;
        setFieldState(e.target.value);
    };
    const addListProps = "name" in props && props.name in list ? list[props.name] : {};
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("textarea", { ...props, ...excludeListDataAttr(addListProps), onChange: changeState, onBlur: changeState, onFocus: changeState, value: fieldState }, fieldState),
        ("name" in props &&
            props.name in formState &&
            validateInput(fieldState, props.name)) ||
            (trySubmit && "name" in props && validateInput(fieldState, props.name))));
};
exports.Textarea = Textarea;
const submitForm = (formRef) => {
    formRef.submit();
};
const checkClear = (e) => {
    return e.target.type === "reset" ? true : false;
};
const Formatron = (props) => {
    const [formComponentState, setFormComponentState] = (0, react_1.useState)(props.form.props.children);
    const [validSubmit, setValidSubmit] = (0, react_1.useState)(2);
    (0, react_1.useEffect)(() => {
        setFormComponentState(props.form.props.children);
    }, [props.form.props.children]);
    const action = "action" in props ? props.action : "/";
    const method = "method" in props ? props.method : "post";
    if ("list" in props)
        list = props.list;
    const FormBody = ({ componentsList }) => componentsList;
    return (react_1.default.createElement("form", { method: method, action: action, onClick: (e) => {
            if (checkClear(e) && validSubmit > 0) {
                trySubmit = false;
                formState = {};
                setValidSubmit(new Date().getTime());
            }
        }, onSubmit: (e) => {
            trySubmit = true;
            e.preventDefault();
            setTimeout(() => {
                if (validateForm())
                    if ("onSubmit" in props)
                        props.onSubmit(formState);
                    else
                        submitForm(e.target);
            }, 0);
            setValidSubmit(new Date().getTime());
            return;
        } },
        react_1.default.createElement(FormBody, { componentsList: formComponentState })));
};
exports.Formatron = Formatron;
//# sourceMappingURL=index.js.map