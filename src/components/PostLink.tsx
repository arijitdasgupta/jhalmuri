import * as React from 'react';
import {IPost} from '../interfaces/IPost';

export const PostLink = (props) => {
    let post = props.post as IPost;

    return (<a href={post.postName}>{post.postTitle}</a>);
};
