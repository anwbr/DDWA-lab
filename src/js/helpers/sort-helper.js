export function sortBy(array, column){
    console.log(array);
    switch (column){
        case 'pin':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getPIN, b.getPIN);
            });
        }
        break;
        case 'balance':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getBalance, b.getBalance);
            });
        }
        break;
        case 'dateofcreate':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getDateOfCreate, b.getBalance);
            });
        }
        break;
        case 'changehistory':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getChangeHistory, b.getChangeHistory);
            });
        }
        break;
        case 'fname':{
            debugger;
            array.sort(function(a, b){
                return stringCompare(a.getFName, b.getFName);
            });
        }
        break;
    }

    return array;
}

function stringCompare(a, b){
    if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
}