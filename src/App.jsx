// import BaseRoutes from "./routes";
import { ReactQueryProvider } from "./helpers/react-query";
import { ToastContainer } from "react-toastify";
import { Layout } from "./components/Layout";
import BaseRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";

function App() {
    return (
        <ReactQueryProvider>
            <ToastContainer />
            <AuthProvider>
                <WebSocketProvider>
                    <BaseRoutes />
                </WebSocketProvider>
            </AuthProvider>
        </ReactQueryProvider>
    );
}

export default App;
