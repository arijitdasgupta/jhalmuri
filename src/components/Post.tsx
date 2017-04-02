import * as React from 'react';
import {IPost} from '../interfaces/IPost';
import {PostLink} from './PostLink';

export const Post = (props) => {
    let post = props.post as IPost;

    return (
        <div>
            <h2><PostLink post={post} /></h2>
            <p dangerouslySetInnerHTML={{__html : post.postContent}} />
        </div>
    );
};
