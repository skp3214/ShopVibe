import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from '../../types/api.types';
import { User } from '../../types/types';
import axios from 'axios';

export const UserApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/` }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: 'new',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    delete: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({userId,adminId}) =>({
        url: `${userId}?id=${adminId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    allUsers: builder.query<AllUsersResponse,string>({
      query: (id) => 'all?id='+id,
      providesTags: ['User'],
    })
  }),
});

export const getUser=async(id:string)=>{
  try {
    const {data}:{data:UserResponse}=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
}
export const { useLoginMutation, useAllUsersQuery, useDeleteMutation } = UserApi;