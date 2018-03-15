import {ScopeIterator} from '../helpers/scope-iterator';
import {moveToScopeDetails, moveToUpdateScope, moveToDeleteScope, moveToListScopes, createScopeClick, updateScopeClick} from './elements-events-manager';
import { sortBy } from '../helpers/sort-helper';
import { setImage } from '../helpers/image-helper';
import * as CONSTANTS from '../constants';
import CalculatedScope from '../models/calculated-scope';


export function initImages(logo, banner){
    setImage(document.getElementById('logo'), logo, {height: 100, width: 150});
    setImage(document.getElementById('banner'), banner, {height: 100, width: 900});
}
export function createScopesTable(scopes){
        let table = document.getElementById(CONSTANTS.TABLE_ID);
        setSourtByHeaders(table, scopes);
        clearTable(table);
        ScopeIterator.scopes = scopes;

        for(let scope of ScopeIterator[Symbol.iterator]()){
            let tr = document.createElement('tr');
            tr.onclick = function(){
                moveToScopeDetails(scope.getId,scope.getTypeOfScope);
                return false;
            };
            tr.innerHTML = `<td>${scope.getPIN}</td>
                            <td>${scope.getBalance}</td>
                            <td>${scope.getDateOfCreate}</td>
                            <td>${scope.getChangeHistory}</td>
                            <td>${scope.getFName}</td>`;
            let tdEdit = document.createElement('td');
            let buttonEdit = createButton('Редактировать', function(){
                moveToUpdateScope(scope.getId);
                return false;
            },'btn btn-default');
            tdEdit.appendChild(buttonEdit);

            let tdDelete = document.createElement('td');
            let buttonDelete = createButton('Удалить', function(){
                moveToDeleteScope(scope.getId);
                return false;
            },'btn btn-danger');
            tdDelete.appendChild(buttonDelete);

            tr.appendChild(tdEdit);
            tr.appendChild(tdDelete);

            table.tBodies[0].appendChild(tr);
        }
	};

export function createScopeDetails(scope){
        let table = document.getElementById(CONSTANTS.DETAILS_TABLE_ID);
        let inner = "<tr><th>pin</th><td>" + scope.getPIN + "</td></tr>" +
        "<tr><th>balance</th><td>" + scope.getBalance + "</td></tr>" +
        `<tr><th>date of create</th><td>${scope.getDateOfCreate}</td></tr>` +
        "<tr><th>change history</th><td>" + scope.getChangeHistory + "</td></tr>" +
        "<tr><th>secret word</th><td>" + scope.getSecretWord + "</td></tr>" +
        "<tr><th>first name</th><td>" + scope.getFName + "</td></tr>" +
        "<tr><th>last name</th><td>" + scope.getLName + "</td></tr>" +
        "<tr><th>nationality</th><td>" + scope.getNationality + "</td></tr>" +
        "<tr><th>type of scope</th><td>" + (scope.getTypeOfScope == true || scope.getTypeOfScope == "true" ? "Calculated" : "Cumulative") + "</td></tr>";
        if (scope instanceof CalculatedScope){
            inner += 
            "<tr><th>persent inrate</th><td>" + scope.getPersentInarate + "</td></tr>" +
            "<tr><th>count of mounth</th><td>" + scope.getMounth + "</td></tr>";
        }else { inner += "<tr><th>count of year</th><td>" + scope.getYear + "</td></tr>"; }
        table.innerHTML = inner;
    };

export function createScopeForm(scope, isUpdate){
        let form = document.getElementById(CONSTANTS.FORM_SCOPE_ID);
        let button;
        let inner = 
        '<div class="form-group">'+
        '<label>pin</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 4.</label >' +
        `<input name="pin" class="form-control" pattern="[0-9][0-9][0-9][0-9]$" type="text" value="${getValueForField(scope.getPIN)}" required/>` +
        '</div>' +
        '<div class="form-group">'+
        '<label>balance</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 5 and common value dont exceed 99999.</label >' +
        `<input name="balance" class="form-control" pattern="^[1-9][0-9]?[0-9]?[0-9]?[0-9]?$|^99999$" type="text" value="${getValueForField(scope.getBalance)}" required/>` +
        '</div>' +
        '<div class="form-group">'+
        '<label>secret word</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 7.</label >' +
        `<input name="secretword" class="form-control" pattern="^[A-Za-z]+$" type="text" value="${getValueForField(scope.getSecretWord)}" required maxlength="7"/>` +
        '</div>' +
        '<div class="form-group">'+
        '<label>first name</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 8.</label >' +
        `<input name="fname" class="form-control" pattern="^[A-Za-z]+$" type="text" value="${getValueForField(scope.getFName)}" required maxlength="8"/>` +
        '</div>' +
        '<div class="form-group">'+
        '<label>last name</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 8.</label >' +
        `<input name="lname" class="form-control" pattern="^[A-Za-z]+$" type="text" value="${getValueForField(scope.getLName)}" required maxlength="8"/>` +
        '</div>' +
        '<div class="form-group">'+
        '<label>nationality</label >' +
        '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of symbols must be two.</label >' +
        `<input name="nationality" class="form-control" pattern="[A-Za-z][A-Za-z]$" type="text" value="${getValueForField(scope.getNationality)}" required/>` +
        '</div>' ;
        if (scope instanceof CalculatedScope ){
            inner += 
            '<div class="form-group">'+
            '<label>persentinrate</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 3 and common value dont exceed 100.</label >' +
            `<input name="persentinrate" class="form-control" pattern="^[1-9][0-9]?$|^100$" type="text" value="${getValueForField(scope.getPersentInarate)}" required/>` +
            '</div>' +
            '<div class="form-group">'+
            '<label>count of mounth</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 9.</label >' +
            `<input name="mounth" class="form-control" pattern="^[1-9]?$|^9$" type="text" value="${getValueForField(scope.getMounth)}" required/>` +
            '</div>' +
            '<div class="form-group">' +
            '<input class="form-control" name="typeofscope" style="display: none;" value="true"/>' +
            '</div>' ;
        } else {
            inner += 
            '<div class="form-group">' +
            '<input class="form-control" name="typeofscope" style="display: none;" value="false"/>' +
            '</div>' +
            '<div class="form-group">'+
            '<label>count of year</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 4.</label >' +
            `<input name="year" class="form-control" pattern="^[1-4]?$|^4$" type="text" value="${getValueForField(scope.getYear)}" required/>` +
            '</div>' ;
        }
    if (!isUpdate) {
        button = createSubmit("Create", function(){
            createScopeClick(this.form);
        });
    } else {
        button = createSubmit("Save", function(){
            updateScopeClick(this.form, scope.getId);
        });
    }
    form.innerHTML = inner;
    form.appendChild(button);
};

export function setSourtByHeaders(table, array){
    for(let i =0 ; i< table.tHead.rows[0].cells.length-2; i++)
    {
        let cellsName = table.tHead.rows[0].cells[i].getAttribute('data-name');
        console.log(cellsName);
        table.tHead.rows[0].cells[i].onclick = function(){
            debugger;
            let sortedArray = sortBy(array, cellsName);
            console.log(sortedArray);
            createScopesTable(sortedArray);
        };
    }
}

function createSubmit(value, onclick){
    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('class', "btn btn-default");
    submit.value = value;
    submit.onclick = onclick;

    return submit;
}

function createButton(value, onclick, classAttr){
    let button = document.createElement('button');
    button.setAttribute('class',classAttr);
    button.innerText = value;
    button.onclick = onclick;

    return button;
}

function getValueForField(data) {
    return typeof data == 'undefined' ? '' : data;
}
function clearTable(table) {
    table.tBodies[0].innerHTML = "";
}