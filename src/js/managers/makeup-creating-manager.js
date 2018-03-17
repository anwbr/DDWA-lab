import { ScopeIterator } from '../helpers/scope-iterator';
import { moveToScopeDetails, moveToUpdateScope, moveToDeleteScope, moveToListScopes, createScopeClick, updateScopeClick, initTableHendlers } from './elements-events-manager';
import { sortBy } from '../helpers/sort-helper';
import { setImage } from '../helpers/image-helper';
import * as CONSTANTS from '../constants';
import CalculatedScope from '../models/calculated-scope';
let table;

export function initImages(logo, banner) {
    setImage($('#logo'), logo, { height: 100, width: 150 });
    setImage($('#banner'), banner, { height: 100, width: 900 });
}

export function createScopesTable(scopes) {
    table = $(CONSTANTS.TABLE_ID).dataTable({
        'ajax': {
            url: CONSTANTS.SERVICE_URL,
            dataSrc: ''
        },
        'columns': [
            { data: 'pin' },
            { data: 'balance' },
            { data: 'dateofcreate' },
            { data: 'fname' },
            {
                data: 'id',
                render: (id, type, full) => `<button class="deleteScopeBtn btn btn-danger" style="background-color: #d42525;
                border-color: #d42525;" value="${id}">Delete</button>`
            },
            {
                data: 'id',
                render: (id, type, full) => `<button class="detailsScopeBtn btn btn-primary" value="${id}">Info</button>`
            },
            {
                data: 'id',
                render: (id, type, full) => `<button class="editScopeBtn btn btn-info" style="background-color: cadetblue;
                border-color: cadetblue;" value="${id}">Edit</button>`
            }
        ],
        initComplete: function () {
            this.api().columns().every(function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo($(column.footer()).empty())
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });

                column.data().unique().sort().each(function (d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                });
            });
        }
    });

    table.on('draw.dt', function () {
        initTableHendlers();
        // PageFunction.SetHandler();
    });
};

export function createScopeDetails(scope) {
    let table = $('#' + CONSTANTS.DETAILS_TABLE_ID);
    let inner = `<td>${scope.getPIN}</td>
                            <td>${scope.getBalance}</td>
                            <td>${scope.getDateOfCreate}</td>
                            <td>${scope.getChangeHistory}</td>
                            <td>${scope.getFName}</td>
                            <td>${scope.getLName}</td>
                            <td>${scope.getNationality}</td>
                            <td>${scope.getSecretWord}</td>
                            <td>${scope.getStartDate}</td>
                            `;
    if (scope instanceof CalculatedScope) {
        inner += `<td>${scope.getPersentInarate}</td>
        <td>${scope.getMounth}</td>`;
    } else { inner += `<td>${scope.getYear}</td>`; }

    table.html(inner);
};

export function createScopeForm(scope, isUpdate) {
    let form = $('#' + CONSTANTS.FORM_SCOPE_ID);
    let button;
    let inner =
        '<div class="form-group">' +
        '<label>pin</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 4.</label >' +
        `<input name="pin" class="form-control" pattern="[0-9][0-9][0-9][0-9]$" type="text" value="${getValueForField(scope.getPIN)}" required/>` +
        '</div>' +
        '<div class="form-group">' +
        '<label>balance</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 5 and common value dont exceed 99999.</label >' +
        `<input name="balance" class="form-control" pattern="^[1-9][0-9]?[0-9]?[0-9]?[0-9]?$|^99999$" type="text" value="${getValueForField(scope.getBalance)}" required/>` +
        '</div>' +
        '<div class="form-group">' +
        '<label>secret word</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 7.</label >' +
        `<input name="secretword" class="form-control" pattern="^[A-Za-z]+$" type="text" value="${getValueForField(scope.getSecretWord)}" required maxlength="7"/>` +
        '</div>' +
        '<div class="form-group">' +
        '<label>first name</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 8.</label >' +
        `<input name="fname" class="form-control" pattern="^[A-Za-z]+$" type="text" value="${getValueForField(scope.getFName)}" required maxlength="8"/>` +
        '</div>' +
        '<div class="form-group">' +
        '<label>last name</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 8.</label >' +
        `<input name="lname" class="form-control" pattern="^[A-Za-z]+$" type="text" value="${getValueForField(scope.getLName)}" required maxlength="8"/>` +
        '</div>' +
        '<div class="form-group">' +
        '<label>nationality</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of symbols must be two.</label >' +
        `<input name="nationality" class="form-control" pattern="[A-Za-z][A-Za-z]$" type="text" value="${getValueForField(scope.getNationality)}" required/>` +
        '</div>';
    if (scope instanceof CalculatedScope) {
        inner +=
            '<div class="form-group">' +
            '<label>persentinrate</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 3 and common value dont exceed 100.</label >' +
            `<input name="persentinrate" class="form-control" pattern="^[1-9][0-9]?$|^100$" type="text" value="${getValueForField(scope.getPersentInarate)}" required/>` +
            '</div>' +
            '<div class="form-group">' +
            '<label>count of mounth</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 9.</label >' +
            `<input name="mounth" class="form-control" pattern="^[1-9]?$|^9$" type="text" value="${getValueForField(scope.getMounth)}" required/>` +
            '</div>' +
            '<div class="form-group">' +
            '<input class="form-control" name="typeofscope" style="display: none;" value="true"/>' +
            '</div>';
            inner +=
            `<div class="form-group">
            <label for="startDate">Date</label>
        <div class="input-group date" id="datetimepicker4" data-target-input="nearest">
        <div class="input-group-append" data-target="#datetimepicker4" data-toggle="datetimepicker">
            <div class="input-group-text">
            <span class="input-group-addon">
                 <span class="glyphicon glyphicon-calendar"></span>
            </span>
            </div>
            </div>
            <input type="text" id="startDate" name="startDate" class="form-control datetimepicker-input date" data-target="#datetimepicker4" style="width: 90%" value="${getValueForField(scope.getStartDate)}" />
         
        </div>
    </div>`;
    } else {
        inner +=
            '<div class="form-group">' +
            '<input class="form-control" name="typeofscope" style="display: none;" value="false"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<label>count of year</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 4.</label >' +
            `<input name="year" class="form-control" pattern="^[1-4]?$|^4$" type="text" value="${getValueForField(scope.getYear)}" required/>` +
            '</div>';
    }
    if (!isUpdate) {
        button = $('#formScope').innerHTML = "<input type=" + 'submit' + " class=" + 'btn btn-default' + "  aria-controls=" + 'scopesList' + " value=" + 'Create' + " name=" + 'Create' + ">";
        // button = createSubmit("Create", function(){
        //     createScopeClick(this.form);
        // });
    } else {
        button = $('#formScope').innerHTML = "<input type=" + 'submit' + " class=" + 'btn btn-default' + "  aria-controls=" + 'scopesList' + " value=" + 'Save' + " name=" + 'Save' + ">"
        // button = createSubmit("Save", function(){
        //     updateScopeClick(this.form, scope.getId);
        // });
    }
    form.html(inner);
    form.append(button);

    if (scope instanceof CalculatedScope) {
        $('#datetimepicker4').datetimepicker();
    }
};

export function reloadTable() {
    table.dataTable().api().ajax.reload();
}

export function setSourtByHeaders(table, array) {
    for (let i = 0; i < table.tHead.rows[0].cells.length - 2; i++) {
        let cellsName = table.tHead.rows[0].cells[i].getAttribute('data-name');
        table.tHead.rows[0].cells[i].onclick = function () {
            debugger;
            let sortedArray = sortBy(array, cellsName);
            createScopesTable(sortedArray);
        };
    }
}

function createSubmit(value, onclick) {
    let submit = $('input');
    submit.attr('type', 'submit');
    submit.attr('class', "btn btn-default");
    submit.attr('name', value);
    submit.val(value);

    return submit;
}

function createButton(value, onclick, classAttr) {
    let button = $('button');
    button.attr('class', classAttr);
    button.attr('name', value);
    button.val(value);
    // button.click(onclick);

    return button;
}

function getValueForField(data) {
    return typeof data == 'undefined' ? '' : data;
}
function clearTable(table) {
    table.tBodies[0].innerHTML = "";
}