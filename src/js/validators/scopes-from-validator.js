import {createScopeClick} from '../managers/elements-events-manager'

export function initValidator(){
    jQuery.validator.addMethod(
        'regexp',
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );

    $('#formScope').validate({
        rules:{
            pin: {
                required: true,
                regexp: '[0-9][0-9][0-9][0-9]$',
            },
            balance: {
                required: true,
                regexp: '^[1-9][0-9]?[0-9]?[0-9]?[0-9]?$|^99999$',
                maxlength: 50
            },
            secretword: {
                required: true,
                regexp: '^[A-Za-z]+$',
                maxlength: 7
            },
            fname: {
                required: true,
                 regexp: '^[A-Za-z]+$',
            maxlength: 8
            },
            lname: {
                required: true,
                regexp: '^[A-Za-z]+$',
            maxlength: 8
            },
            nationality:{
                required: true,
                regexp: '[A-Za-z][A-Za-z]$'
            },
            persentinrate:{
                required: true,
                 regexp: '^[1-9][0-9]?$|^100$'
            },
            mounth:{
                required: true,
                regexp: '^[1-9]?$|^9$'
            },
            year:{
                required: true,
                regexp: '^[1-4]?$|^4$'
            },
            startDate: {
                required: true
            }
        },
        messages: {
            pin: {
                required: 'Reqiured',
                regexp: 'Value must contain only numbers and count of characters dont exceed 4.'
            },
            balance: {
                required: 'Reqiured',
                regexp: 'Value must contain only numbers and count of characters dont exceed 5 and common value dont exceed 99999.'
            },
            secretword: {
                required: 'Reqiured',
                regexp: 'Value must contain only symbols and count of characters dont exceed 7.'
            },
            fname: {
                required: 'Reqiured',
                 regexp: 'Value must contain only symbols and count of characters dont exceed 8.'
            },
            lname: {
                required: 'Reqiured',
                 regexp: 'Value must contain only symbols and count of characters dont exceed 8.'
            },
            nationality:{
                required: 'Reqiured',
                regexp: 'Value must contain only symbols and count of symbols must be two.'
            },
            persentinrate:{
                required: 'Reqiured',
                 regexp: 'Value must contain only numbers and count of characters dont exceed 3 and common value dont exceed 100.'
            },
            mounth:{
                required: 'Reqiured',
                regexp: 'Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 9.'
            },
            year:{
                required: 'Reqiured',
                regexp: 'Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 4.'
            },
            startDate: {
                required: 'Reqiured'
            }
        },
        submitHandler: function (event) {
            debugger;
            createScopeClick(event);
        },
        errorLabelContainer: '.error-label'
    });
}


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