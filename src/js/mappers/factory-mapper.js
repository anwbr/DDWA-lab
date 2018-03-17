import CalculatedScope from '../models/calculated-scope';
import CumulativeScope from '../models/cumulative-scope';

export function mapJSONToScope(data){
    let scope;
        if (data.typeofscope == true || data.typeofscope == 'true') {
            scope = new CalculatedScope(data);
        } else {
            scope = new CumulativeScope(data);
        }
        return scope;
}
