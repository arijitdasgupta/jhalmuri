import {MySqlQueries} from '../sql/MySqlQueries';
import { forEach } from 'lodash';

export class SitesRepository {
    constructor(private queries:MySqlQueries){}

    public getSiteDetails = () => {
        return this.queries.getOptionsTable().then((results) => {
            const siteDetails = {};
            forEach(results, (item) => {
               siteDetails[item.option_name] = item.option_value;
            });
            return siteDetails;
        });
    }
}
