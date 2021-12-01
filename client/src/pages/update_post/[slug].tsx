import React from 'react';
import { useParams } from 'react-router-dom';

import { IParams } from '../../utils/TypeScript';

import CreatePost from '../create_post';

const UpdatePost = () => {
  const { slug } = useParams<IParams>();

  return <CreatePost id={slug} />;
};

export default UpdatePost;
