'use strict';

let DDWAApp = (function () {
	return {
		Models: {
            Scope:{},
            CalculatedScope:{},
            CumulativeScope:{}
		},
		MakeupManager: {
			MakeupCreator: {},
			FormReader: {},
            ElementsEventsProvider: {},
            ScopesFormValidator: {}
        },
        Mappers: {
            MapperFactory: {}
        },
        Helpers: {
            ScopeIterator:{},
            SearchHelper: {},
            WebScope: {}
        },
		ScopesService: {},
		CONSTANTS: { 
			SERVICE_URL: 'http://localhost:3000/scopes',
			TABLE_ID: 'scopesList',
            DETAILS_TABLE_ID: 'tableDetails',
            FORM_SCOPE_ID: 'formScope',
            CREATE_PART: 'createPart',
            LIST_PART: 'showPart',
            CREATE_SCOPE_BUTTON: 'createScope',
            CREATE_BUTTONS_ID: 'createButtons',
            SEARCH_INPUT_ID: 'searchinputValue',
            SEARCH_SECTION_ID: 'searchSection'
		}
	};
})();

DDWAApp.Models.Scope = class {
    constructor(data, type){
        this._id = data.id;
        this._pin = data.pin;
        this._balance = data.balance;
        this._dateofcreate = data.dateofcreate;
        this._changehistory = data.changehistory;
        this._typeofscope = data.typeofscope;
        this._secretword = data.secretword;
        this._fname = data.fname;
        this._lname = data.lname;
        this._nationality = data.nationality;
    }

	get getId(){
		return this._id;
    }    

	get getPIN(){
		return this._pin;
    }
    
	set setPIN(pin) {
		this._pin = pin;
	}

	get getBalance(){
		return this._balance;
	}
	set setBalance(balance) {
		this._balance = balance;
	}

	get getDateOfCreate(){
		return this._dateofcreate;
	}
	set setDateOfCreate(dateofcreate) {
		this._dateofcreate = dateofcreate;
	}

	get getChangeHistory(){
		return this._changehistory;
	}
	set setChangeHistory(changehistory) {
		this._changehistory = changehistory;
    }

    get getTypeOfScope(){
		return this._typeofscope;
    }
    
	set setTypeOfScope(typeofscope) {
		this._typeofscope = typeofscope;
    }
    get getSecretWord(){
		return this._secretword;
	}
	set setSecretWord(secretword) {
		this._secretword = secretword;
    }
    get getFName(){
		return this._fname;
	}
	set setFName(fname) {
		this._fname = fname;
    }
    get getLName(){
		return this._lname;
	}
	set setLName(lname) {
		this._lname = lname;
    }
    get getNationality(){
		return this._nationality;
	}
	set setNationality(nationality) {
		this._nationality = nationality;
	}
}

DDWAApp.Models.CalculatedScope = class extends DDWAApp.Models.Scope {
    constructor(data) {
        super(data, true);
        this._persentinrate = data.persentinrate;
        this._mounth = data.mounth;
    }
    
    get getPersentInarate(){
		return this._persentinrate;
    }
    
	set setPersentInarate(persentinrate) {
		this._persentinrate = persentinrate;
    }
    
    get getMounth() {
		return this._mounth;
    }
    
	set setMounth(mounth) {
		this._mounth = mounth;
	}
}

DDWAApp.Models.CumulativeScope =  class extends DDWAApp.Models.Scope {
    constructor(data) {
        super(data, true);
        this._year = data.year;
    }

    get getYear() {
		return this._year;
    }
    
	set setYear(year) {
		this._year = year;
	}
}

DDWAApp.MakeupManager.ElementsEventsProvider = function(){
    let self = this || {};
    let isUpdateEvent = false;

    self.moveToScopeDetails = (id, type) => {
        if (isUpdateEvent === true) {
            isUpdateEvent = false;
            return;
        }
        setDisplaySettings('none', 'none', '', 'none', 'none');
		DDWAApp.ScopesService.getDetails(id).then((scope)=>{
            DDWAApp.MakeupManager.MakeupCreator.createScopeDetails(scope);
        });
    }
    

    self.moveToChangeScope = (id) => {
        isUpdateEvent = true;
        setDisplaySettings('none', '', 'none', 'none', 'none');
        DDWAApp.ScopesService.getDetails(id).then((scope)=>{
            DDWAApp.MakeupManager.MakeupCreator.createScopeForm(scope, true);
        });
    }

    self.moveToDeleteScope = (id) => {
        isUpdateEvent = true;
        DDWAApp.ScopesService.deleteScope(id).then(function(data){
            DDWAApp.WorkersService.getAll().then((data)=>{
                DDWAApp.MakeupManager.MakeupCreator.createScopesTable(data);
            });
        });
    }

    self.moveToCreateScopeForm = (isTypeOfScope) => {
        setDisplaySettings('none', '', 'none', 'none', '', isTypeOfScope);
        DDWAApp.MakeupManager.MakeupCreator.createScopeForm(isTypeOfScope ? new DDWAApp.Models.CalculatedScope({}) : new DDWAApp.Models.CumulativeScope({}), false);
    }

    self.moveToListScopes = () => {
        setDisplaySettings('', 'none', 'none', '', 'none');
        DDWAApp.ScopesService.getAll().then((data)=>{
            DDWAApp.MakeupManager.MakeupCreator.createScopesTable(data);
        });
    };

    self.createScope = (event) => {
        if (DDWAApp.MakeupManager.ScopesFormValidator.isValidForm(event)) {
            DDWAApp.ScopesService.addScope(DDWAApp.MakeupManager.FormReader.getDataForm(event)).then(function(data){
                DDWAApp.MakeupManager.ElementsEventsProvider.moveToListScopes();                
            });
        } else {
            if (event.preventDefault) event.preventDefault();
        }
    }

    function setDisplaySettings(listTable, scopeForm, detailsTable, createScopeButton, createButtons, isTypeOfScope) {
        document.getElementById(DDWAApp.CONSTANTS.LIST_PART).style.display = listTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_PART).style.display = scopeForm;
        document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID).style.display = detailsTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_SCOPE_BUTTON).style.display = createScopeButton;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_BUTTONS_ID).style.display = createButtons;
    }

	return self;
}();

DDWAApp.MakeupManager.MakeupCreator  = function () {

	let self = this || {};

	self.createScopesTable = (scopes)=>{
        let table = document.getElementById(DDWAApp.CONSTANTS.TABLE_ID);
        clearTable(table);
        DDWAApp.Helpers.ScopeIterator.scopes = scopes;       
        let iterator = DDWAApp.Helpers.ScopeIterator[Symbol.iterator]();
        for(let scope of DDWAApp.Helpers.ScopeIterator[Symbol.iterator]()){
            let tr = document.createElement('tr');
            tr.setAttribute('onclick', "DDWAApp.MakeupManager.ElementsEventsProvider.moveToScopeDetails(" + scope.getId +"," + scope.getTypeOfScope + ");return false;");
            tr.innerHTML += 
                "<td>" + scope.getPIN + "</td>"+
                "<td>" + scope.getBalance + "</td>"+
                "<td>" + scope.getDateOfCreate + "</td>"+
                "<td>" + scope.getChangeHistory + "</td>"+
                "<td>" + (scope.getTypeOfScope == true || scope.getTypeOfScope == "true" ? "Calculated" : "Cumulative") + "</td>"+
                "<td><a style='cursor: pointer;' onclick='DDWAApp.MakeupManager.ElementsEventsProvider.moveToChangeScope(" + scope.getId + ");return false;'>Change</a>"+
                "<a style='color:red; cursor: pointer;' onclick = 'DDWAApp.MakeupManager.ElementsEventsProvider.moveToDeleteScope('" + scope.getId + ");return false;'>Delete</a></td>";
                
            table.tBodies[0].appendChild(tr);
		}
	};

	self.createScopeDetails = (scope) => {
        let table = document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID);
        let inner = "<tr><th>pin</th><td>" + scope.getPIN + "</td></tr>" +
        "<tr><th>balance</th><td>" + scope.getBalance + "</td></tr>" +
        `<tr><th>date of create</th><td>${scope.getDateOfCreate}</td></tr>` +
        "<tr><th>change history</th><td>" + scope.getChangeHistory + "</td></tr>" +
        "<tr><th>secret word</th><td>" + scope.getSecretWord + "</td></tr>" +
        "<tr><th>first name</th><td>" + scope.getFName + "</td></tr>" +
        "<tr><th>last name</th><td>" + scope.getLName + "</td></tr>" +
        "<tr><th>nationality</th><td>" + scope.getNationality + "</td></tr>" +
        "<tr><th>type of scope</th><td>" + (scope.getTypeOfScope == true || scope.getTypeOfScope == "true" ? "Calculated" : "Cumulative") + "</td></tr>";
        if (scope instanceof DDWAApp.Models.CalculatedScope ) {
            inner += 
            "<tr><th>persent inrate</th><td>" + scope.getPersentInarate + "</td></tr>" +
            "<tr><th>count of mounth</th><td>" + scope.getMounth + "</td></tr>";
        }else { inner += "<tr><th>count of year</th><td>" + scope.getYear + "</td></tr>"; }
        table.innerHTML = inner;
    };

    self.createScopeForm = (scope, isUpdate) => {
        let form = document.getElementById(DDWAApp.CONSTANTS.FORM_SCOPE_ID);
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
            if (scope instanceof DDWAApp.Models.CalculatedScope  ){
                inner += 
                '<div class="form-group">'+
                '<label>persentinrate</label >' +
                '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 3 and common value dont exceed 100.</label >' +
                `<input name="persentinrate" class="form-control" pattern="^[1-9][0-9]?$|^100$" type="text" value="${getValueForField(scope.getPerseintInarate)}" required/>` +
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
            inner += '<input type="submit" value="Create"  class="btn btn-default" onclick="DDWAApp.MakeupManager.ElementsEventsProvider.createScope(this.form);" />';
        } else {
            inner += `<input type="submit" value="Save"  class="btn btn-default" onclick="DDWAApp.ScopesService.updateScope(this.form, ${scope.getId});" />`;
        }
        form.innerHTML = inner;
    };

    function getValueForField(data) {
        return typeof data == 'undefined' ? '' : data;
    }

	function clearTable(table) {
        table.tBodies[0].innerHTML = "";
	}

	return self;
}();

DDWAApp.MakeupManager.FormReader = function(){
	let self = this || {};

	self.getDataForm = (form) => {
        let type = form["typeofscope"].value;
		let data = {};

		if (type == 'true') {
			data = getDataFormCalculatedScope(form);
		} else {
			data = getDataFormCumulativeScope(form);
		};

		return data;
	};

	function getCommonDataFromForm(form) {
        let d = new Date();
        
		let body = {
			pin: form["pin"].value,
            balance: form["balance"].value,
            dateofcreate: d.getFullYear() +" "+ (d.getMonth() + 1) +" "+ d.getDate(),
            changehistory: d.getFullYear() +" "+ (d.getMonth() + 1) +" "+ d.getDate(),
            secretword: form["secretword"].value,
            fname: form["fname"].value,
            lname: form["lname"].value,
            nationality: form["nationality"].value,
			typeofscope: form["typeofscope"].value
		};

		return body
	};

	function getDataFormCalculatedScope(form) {
		let data = getCommonDataFromForm(form);

        data.persentinrate = form["persentinrate"].value;
        data.mounth = form["mounth"].value;

		return data;
	};

	function getDataFormCumulativeScope(form) {
        let data = getCommonDataFromForm(form);
        
        data.year = form["year"].value;

		return data;
	};

	return self;
}();

DDWAApp.MakeupManager.ScopesFormValidator = function() {
    let self = this || {};

    self.isValidForm = (event) => {
        event = (event ? event : window.event);
        let form = event;
        let field;
        let formvalid = true;

        for (var i = 0; i < form.elements.length; i++) {
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

    return self;
} ();

DDWAApp.Mappers.FactoryMapper = function () {
    let self = this || {};

    self.mapJSONToScope = (data)=>{
        let scope;
        if (data.typeofscope == true || data.typeofscope == 'true') {
            scope = new DDWAApp.Models.CalculatedScope(data);
        } else {
            scope = new DDWAApp.Models.CumulativeScope(data);
        }
        return scope;
    }

    return self;
}();

DDWAApp.Helpers.ScopeIterator = {
    scopes: [],
    [Symbol.iterator]() {
        return this;
    },
    next() {
        if (this.current === undefined) {
            this.current = 0
        } else {
            this.current++;
        }
        if (this.current < this.scopes.length) {
            return {
                done: false,
                value: this.scopes[this.current]
            };
        } else {
            delete this.current;
            return {
                done: true
            };
        }
    }
};

DDWAApp.Helpers.WebWorker = function (){
    let self = this || {};
    
    self.worker= {};

    
    self.worker = new Worker('./web-worker.js');

    self.worker.addEventListener('message', function(e) {
        document.getElementById('count').textContent = e.data;
        localStorage.setItem('DDWAApp_last_update_time', new Date());
        localStorage.setItem('DDWAApp_last_update_value', e.data);
    }, false);

    self.start = ()=>{
        let lastUpdateDate = localStorage.getItem('DDWAApp_last_update_time')? new Date(localStorage.getItem('DDWAApp_last_update_time')) : new Date();
        let nextUpdateDate =  new Date(lastUpdateDate);
        nextUpdateDate.setMinutes(lastUpdateDate.getMinutes() + (localStorage.getItem('DDWAApp_last_update_time')? 1: 0));

        document.getElementById('count').innerText = ('' + localStorage.getItem('DDWAApp_last_update_value')) || '';

        if (new Date() >= nextUpdateDate) {
            startUpdate();
        } else {
            setTimeout(startUpdate, getNextTimeStart(lastUpdateDate));
        }
    };

    function getNextTimeStart(datetime){
        debugger;
        let nextUpdate =  new Date(datetime);
        nextUpdate.setMinutes(datetime.getMinutes() + 1);

        return nextUpdate - new Date();
    }
    function startUpdate(){
       self. worker.postMessage({'cmd': 'start'});
    }

    return self;
}();


DDWAApp.Helpers.SearchHelper = function(){
    let self = this || {};

    self.searchByValue = ()=>{
        let searchData = document.getElementById(DDWAApp.CONSTANTS.SEARCH_INPUT_ID).value;
        DDWAApp.ScopesService.getAll().then((data)=>{
            let scopes = data.filter(item=>{
                if(item.getFName.includes(searchData) || item.getLName.includes(searchData) || item.getPIN.includes(searchData)  )
                    return true;
            });

            DDWAApp.MakeupManager.MakeupCreator.createScopesTable(scopes);
        });
    };

    return self;
}();

DDWAApp.ScopesService = function() {
	let self = this || {};

	self.deleteScope = async function(id)  {
        let data = await sendGetMethod('DELETE', '/' + id);
        return data;
	};

	self.getAll = async function() {
        let data = await sendGetMethod('GET','');
        let scopes = [];
        DDWAApp.Helpers.ScopeIterator.scopes = data;
        for(let item of DDWAApp.Helpers.ScopeIterator[Symbol.iterator]()){
            let scope = DDWAApp.Mappers.FactoryMapper.mapJSONToScope(item);
            scopes.push(scope);
        }
        return scopes;
    };

	self.addScope = async (data)=>{
        let result = await sendPostMethod('POST', DDWAApp.CONSTANTS.SERVICE_URL, data);
        return result;
};

	self.updateWorker = async (data, id)=>{
        let result = await sendPostMethod('PUT', DDWAApp.CONSTANTS.SERVICE_URL +"/"+id, data)
        return result;
};
	
	self.getDetails = async (id)=>{
        let data = await sendGetMethod('GET', '/' + id);
        let worker = DDWAApp.Mappers.FactoryMapper.mapJSONToScope(data);
        return worker;
};

	function sendGetMethod(method, params) {
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest();

            xhr.open(method, DDWAApp.CONSTANTS.SERVICE_URL + params, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

            xhr.send();
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState != 4) return;
                if (xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    resolve(data);
                }
            }
        });
    }

    function sendPostMethod(method, url, body) {
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest();

            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                resolve(xhr.responseText);
            };

            xhr.send(JSON.stringify(body));
        });
    }

	return self;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	DDWAApp.ScopesService.getAll().then((data)=>{
        DDWAApp.MakeupManager.MakeupCreator.createScopesTable(data);
        DDWAApp.Helpers.WebWorker.start();
    });
});