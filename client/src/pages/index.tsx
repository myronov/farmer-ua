import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootStore } from '../utils/TypeScript';

import CardVert from '../components/cards/CardVert';
import Loading from '../components/global/Loading';

const Home = () => {
  const { homePosts } = useSelector((state: RootStore) => state);

  if (homePosts.length === 0) return <Loading />;
  return (
    <div className="home_page">
      {homePosts.map((homePost) => (
        <div key={homePost._id}>
          {homePost.count > 0 && (
            <>
              <h3>
                <Link to={`/posts/${homePost.name.toLowerCase()}`}>
                  {homePost.name} <small>({homePost.count})</small>
                </Link>
              </h3>
              <hr className="mt-1" />

              <div className="home_posts">
                {homePost.posts.map((post) => (
                  <CardVert key={post._id} post={post} />
                ))}
              </div>
            </>
          )}

          {homePost.count > 4 && (
            <Link
              className="text-end d-block mt-2 mb-3 
              text-decoration-none"
              to={`/posts/${homePost.name}`}
            >
              Read more &gt;&gt;
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
