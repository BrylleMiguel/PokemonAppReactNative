import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { queryClient } from "./react-query/queryClient";

export default function RootLayout() {
  return <QueryClientProvider client={queryClient}>
    <Stack />
  </QueryClientProvider>
}
