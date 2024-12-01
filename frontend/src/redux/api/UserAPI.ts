import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MessageResponse } from '../../types/apitypes';
import { User } from '../../types/types';

export const UserApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/` }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: 'new',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation } = UserApi;