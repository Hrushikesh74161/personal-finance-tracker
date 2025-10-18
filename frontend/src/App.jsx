import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";

function App() {
  //reactQuery config
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        //refetch on window focus must be turned off to avoid unecessary api calls
        refetchOnWindowFocus: false,
        //retry must be turned off to avoid unecessary api calls
        retry: false,
      },
    },
  });

  return (
    // <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </QueryClientProvider>
    // </Provider>
  );
}

export default App;
