import * as React from 'react';
import {IRenderData} from '../interfaces/IRenderData';
import {IPost} from '../interfaces/IPost';
import {Post} from './Post';
import {PageNotFound} from './PageNotFound';
import {StateModes} from '../enums/StateModes';

declare let unescape;

interface IAppState {
    appState: IRenderData;
}

export const Page = (props:IAppState) => {
    let mainContent;
    let pageData = props.appState.pageData;
    let siteDetails = pageData.siteDetails;
    let content = pageData.content;

    if (props.appState.mode === StateModes.REST) {
        mainContent = <PageNotFound />;
    } else {
        mainContent = content.map((item:IPost, i) => <Post post={item} key={i} />);
    }

    return <div>
        <h1>{unescape(siteDetails.blogName)}</h1>
        {mainContent}
    </div>;
};
