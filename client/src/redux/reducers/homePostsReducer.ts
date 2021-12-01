import {
  GET_HOME_POSTS,
  IGetHomePostsType,
  IHomePosts,
} from '../types/postType';

const homePostsReducer = (
  state: IHomePosts[] = [],
  action: IGetHomePostsType
): IHomePosts[] => {
  switch (action.type) {
    case GET_HOME_POSTS:
      return action.payload;

    default:
      return state;
  }
};

export default homePostsReducer;
