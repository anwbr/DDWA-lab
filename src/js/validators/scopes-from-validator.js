export function isValidForm(event){
    event = (event ? event : window.event);
    let form = event;
    let field;
    let formvalid = true;

    for (let i = 0; i < form.elements.length; i++) {
        field = form.elements[i];
        if (!isInputField(field)) continue;

        if (typeof field.willValidate !== "undefined") {
            if (field.nodeName === "INPUT") {
                field.setCustomValidity(LegacyValidation(field) ? "" : "error");
            }

            field.checkValidity();
        } else {

            field.validity = field.validity || {};

            field.validity.valid = LegacyValidation(field);
        }

        if (field.validity.valid) {
            field.style.border = "1px solid rgba(0, 0, 0, 0.15)";
            if (field.parentElement.children[1].nodeName !== "INPUT")
                field.parentElement.children[1].style.display = "none";

        } else {

            field.style.border = "1px solid red";
            field.parentElement.children[1].style.display = "inline-table";

            formvalid = false;
        }

    }

    return formvalid;
}

function isInputField(field) {
    return (field.nodeName === "INPUT" || field.nodeName === "TEXTAREA" || field.nodeName !== "SELECT") && field.style.display !== "none" && field.type != "submit";
}

function LegacyValidation(field) {

    let
        valid = true,
        val = field.value,
        type = field.getAttribute("type"),
        chkbox = (type === "checkbox" || type === "radio"),
        required = field.getAttribute("required"),
        minlength = field.getAttribute("minlength"),
        maxlength = field.getAttribute("maxlength"),
        pattern = field.getAttribute("pattern");

    if (field.disabled) return valid;

    valid = valid && (!required ||
        (chkbox && field.checked) ||
        (!chkbox && val !== "")
    );

    valid = valid && (chkbox || (
        (!minlength || val.length >= minlength) &&
        (!maxlength || val.length <= maxlength)
    ));

    if (valid && pattern) {
        pattern = new RegExp(pattern);
        valid = pattern.test(val);
    }

    return valid;
}