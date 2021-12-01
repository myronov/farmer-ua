import React from 'react';
import { Link } from 'react-router-dom';

import { IPost } from '../../utils/TypeScript';

interface IProps {
  post: IPost;
}

const CardVert: React.FC<IProps> = ({ post }) => {
  return (
    <div className="card">
      {typeof post.thumbnail === 'string' && (
        <img
          src={post.thumbnail}
          className="card-img-top"
          alt="..."
          style={{ height: '180px', objectFit: 'cover' }}
        />
      )}

      <div className="card-body">
        <h5 className="card-title">
          <Link
            to={`/post/${post._id}`}
            style={{
              textDecoration: 'none',
              textTransform: 'capitalize',
            }}
          >
            {post.title.slice(0, 50) + '...'}
          </Link>
        </h5>
        <p className="card-text">{post.description.slice(0, 100) + '...'}</p>

        <p className="card-text d-flex justify-content-between">
          <small className="text-muted text-capitalize">
            {typeof post.user !== 'string' && (
              <Link
                to={`/profile/${post.user._id}`}
                style={{
                  textDecoration: 'none',
                  textTransform: 'capitalize',
                }}
              >
                By: {post.user.name}
              </Link>
            )}
          </small>

          <small className="text-muted">
            {new Date(post.createdAt).toLocaleString()}
          </small>
        </p>
      </div>
    </div>
  );
};

export default CardVert;
