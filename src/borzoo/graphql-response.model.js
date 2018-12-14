export type GraphQLResponse<T> = {
    data: T,
    errors?: GraphQLError[]
};

export type GraphQLError = {
    message: string,
    path?: (string | number)[]
};

