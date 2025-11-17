import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { SnackbarProvider } from "./context/SnackbarContext";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <SnackbarProvider>
                    <AppWrapper>
                        <AuthProvider>
                            <Toaster position="top-right" reverseOrder={false} />
                            <App />
                        </AuthProvider>
                    </AppWrapper>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
);
