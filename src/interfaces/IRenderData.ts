import {ISiteOptions} from './ISiteData';
import {IPost} from './IPost';
export interface IRenderData {
    mode: string;
    pageNumber: number;
    totalPages: number;
    pageData: {
        siteDetails: ISiteOptions;
        content: any;
    }
}
