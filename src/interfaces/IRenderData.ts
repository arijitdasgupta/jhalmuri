import {ISiteOptions} from './ISiteData';
import {IPost} from './IPost';
export interface IRenderData {
    mode: string;
    pageData: {
        siteDetails: ISiteOptions;
        content: IPost | IPost[];
    }
}
