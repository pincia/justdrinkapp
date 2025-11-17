import { createContext, useContext, useState, ReactNode } from "react";
import Snackbar from "../components/ui/snackbar/Snackbar";

type SnackbarType = "success" | "error" | "warning" | "info";

type SnackbarContextType = {
  showSnackbar: (message: string, type?: SnackbarType) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<{ message: string; type: SnackbarType } | null>(null);

  function showSnackbar(message: string, type: SnackbarType = "info") {
    setSnackbar({ message, type });

    setTimeout(() => {
      setSnackbar(null);
    }, 3000);
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar && (
        <Snackbar message={snackbar.message} type={snackbar.type} />
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
