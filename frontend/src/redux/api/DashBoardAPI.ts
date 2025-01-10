import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarResponse, LineResponse, PieResponse, StatsResponse } from "../../types/api.types";

export const DashBoardApi = createApi({
    reducerPath: "dashBoardApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/dashboard/` }),
    tagTypes: ["DashBoard"],
    endpoints: (builder) => ({
        stats: builder.query<StatsResponse, string>({
            query: (id) => "stats?id=" + id,
            providesTags: ["DashBoard"]
        }),
        pie: builder.query<PieResponse, string>({
            query: (id) => "pie?id=" + id,
            providesTags: ["DashBoard"]
        }),
        line: builder.query<LineResponse, string>({
            query: (id) => "line?id=" + id,
            providesTags: ["DashBoard"]
        }),
        bar: builder.query<BarResponse, string>({
            query: (id) => "bar?id=" + id,
            providesTags: ["DashBoard"]
        })
    })
});

export const { useStatsQuery, useBarQuery, usePieQuery, useLineQuery,useLazyBarQuery,useLazyLineQuery,useLazyPieQuery } = DashBoardApi;