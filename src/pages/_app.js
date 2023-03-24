import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "components/Navbar";
import { UserContext } from "lib/context";
import { useUserData } from "lib/hooks";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const userData = useUserData();
  const [queryClient] = useState(() => new QueryClient());
  return (
    <UserContext.Provider value={userData}>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Component {...pageProps} />
      </QueryClientProvider>
    </UserContext.Provider>
  );
}
