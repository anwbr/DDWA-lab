export function getDataForm(form){
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
    data.startDate = form["startDate"].value;
    return data;
};

function getDataFormCumulativeScope(form) {
    let data = getCommonDataFromForm(form);
    
    data.year = form["year"].value;

    return data;
};
