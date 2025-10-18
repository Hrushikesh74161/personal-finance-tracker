import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { Toast } from "./components/toast/Toast";
import store from "./redux/store";

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
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes />
          <Toast />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
