import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({});

export const ReactQueryProvider = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export const invalidateQueriesCached = (queryKey) => {
    queryClient.invalidateQueries({
        queryKey,
    });
};
