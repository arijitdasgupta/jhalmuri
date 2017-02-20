import * as React from 'react';
import {IPost} from '../interfaces/IPost';

export const Post = (props) => {
    let post = props.post as IPost;

    return (
        <div>
            <h2>{post.postTitle}</h2>
            <p dangerouslySetInnerHTML={{__html : post.postContent}} />
        </div>
    );
};
