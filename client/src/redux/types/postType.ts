import { IPost } from '../../utils/TypeScript';

export const GET_HOME_POSTS = 'GET_HOME_POSTS';
export const GET_POSTS_CATEGORY_ID = 'GET_POSTS_CATEGORY_ID';
export const GET_POSTS_USER_ID = 'GET_POSTS_USER_ID';
export const CREATE_POSTS_USER_ID = 'CREATE_POSTS_USER_ID';
export const DELETE_POSTS_USER_ID = 'DELETE_POSTS_USER_ID';

export interface IHomePosts {
  _id: string;
  name: string;
  count: number;
  posts: IPost[];
}

export interface IGetHomePostsType {
  type: typeof GET_HOME_POSTS;
  payload: IHomePosts[];
}

export interface IPostsCategory {
  id: string;
  posts: IPost[];
  total: number;
  search: string;
}

export interface IGetPostsCategoryType {
  type: typeof GET_POSTS_CATEGORY_ID;
  payload: IPostsCategory;
}

export interface IPostsUser {
  id: string;
  posts: IPost[];
  total: number;
  search: string;
}

export interface IGetPostsUserType {
  type: typeof GET_POSTS_USER_ID;
  payload: IPostsUser;
}

export interface ICreatePostsUserType {
  type: typeof CREATE_POSTS_USER_ID;
  payload: IPost;
}

export interface IDeletePostsUserType {
  type: typeof DELETE_POSTS_USER_ID;
  payload: IPost;
}

export type IPostUserType =
  | IGetPostsUserType
  | ICreatePostsUserType
  | IDeletePostsUserType;
