import * as React from 'react';

export const Page = (props) => {
    let stuff;

    if (props.pageData instanceof Array) {
        stuff = props.pageData.map((item, i) => <pre key={i}>{JSON.stringify(item)}</pre>)
    } else {
        stuff = <pre>{JSON.stringify(props.pageData)}</pre>;
    }

    return <div>
        <p>{props.mode}</p>
        {stuff}
    </div>;
};
