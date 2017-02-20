import {MySqlQueries} from '../sql/MySqlQueries';
import { forEach } from 'lodash';
import {ISqlSiteOptions} from '../interfaces/ISiteData';
import {IAuthorSqlData} from '../interfaces/IAuthorData';

export class SitesRepository {
    constructor(private queries:MySqlQueries){}

    public getSiteDetails = ():Promise<ISqlSiteOptions> => {
        return this.queries.getOptionsTable().then((results) => {
            const siteDetails:ISqlSiteOptions = <ISqlSiteOptions>{};
            forEach(results, (item) => {
               siteDetails[item.option_name] = item.option_value;
            });
            return siteDetails;
        });
    };

    public getAuthorDetails = (authorId:number):Promise<IAuthorSqlData> => {
        return this.queries.getAuthorDetail(authorId).then((results) => {
            return results[0];
        });
    }
}
