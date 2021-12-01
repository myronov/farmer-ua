import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { IPost, IParams, RootStore } from '../../utils/TypeScript';

import { deletePost } from '../../redux/actions/postAction';

interface IProps {
  post: IPost;
}

const CardHoriz: React.FC<IProps> = ({ post }) => {
  const { slug } = useParams<IParams>();
  const { auth } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (!auth.user || !auth.access_token) return;

    if (slug !== auth.user._id)
      return dispatch({
        type: 'ALERT',
        payload: { errors: 'Invalid Authentication.' },
      });

    if (window.confirm('Do you want to delete this post?')) {
      dispatch(deletePost(post, auth.access_token));
    }
  };

  return (
    <div className="card mb-3" style={{ minWidth: '260px' }}>
      <div className="row g-0 p-2">
        <div
          className="col-md-4"
          style={{
            minHeight: '150px',
            maxHeight: '170px',
            overflow: 'hidden',
          }}
        >
          {post.thumbnail && (
            <>
              {typeof post.thumbnail === 'string' ? (
                <Link to={`/post/${post._id}`}>
                  <img
                    src={post.thumbnail}
                    className="w-100 h-100"
                    alt="thumbnail"
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
              ) : (
                <img
                  src={URL.createObjectURL(post.thumbnail)}
                  className="w-100 h-100"
                  alt="thumbnail"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </>
          )}
        </div>

        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              <Link
                to={`/post/${post._id}`}
                className="text-capitalize text-decoration-none"
              >
                {post.title}
              </Link>
            </h5>
            <p className="card-text">{post.description}</p>

            {post.title && (
              <div
                className="card-text d-flex justify-content-between
                align-items-center"
              >
                {auth.user && slug === auth.user._id && (
                  <div style={{ cursor: 'pointer' }}>
                    <Link to={`/update_post/${post._id}`}>
                      <i className="fas fa-edit" title="edit" />
                    </Link>

                    <i
                      className="fas fa-trash text-danger mx-3"
                      title="edit"
                      onClick={handleDelete}
                    />
                  </div>
                )}
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleString()}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHoriz;
