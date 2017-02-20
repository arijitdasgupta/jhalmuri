import * as React from 'react';
import {IRenderData} from '../interfaces/IRenderData';

interface IAppState {
    appState: IRenderData;
}

export const Page = (props:IAppState) => {
    let stuff;
    let pageData = props.appState.pageData;
    if (pageData.content instanceof Array) {
        stuff = pageData.content.map((item, i) => <pre key={i}>{JSON.stringify(item)}</pre>)
    } else {
        stuff = <pre>{JSON.stringify(pageData.content)}</pre>;
    }

    return <div>
        <p>{props.appState.mode}</p>
        {stuff}
    </div>;
};
