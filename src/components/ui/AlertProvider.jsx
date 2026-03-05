import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert, Snackbar, Box } from "@mui/material";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    const addAlert = useCallback((severity, message) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, severity, message, open: true }]);
    }, []);

    const closeAlert = useCallback((id) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === id ? { ...alert, open: false } : alert
            )
        );
        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, 300);
    }, []);

    return (
        <AlertContext.Provider value={{ addAlert }}>
            {children}

            {/* Stacked alerts fixed at top center */}
            <Box
                sx={{
                    position: "fixed",
                    top: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "auto",
                    maxWidth: "90vw",
                    minWidth: 300,
                    pointerEvents: "none",
                }}
            >
                {alerts.map((alert) => (
                    <Snackbar
                        key={alert.id}
                        open={alert.open}
                        autoHideDuration={6000}
                        onClose={() => closeAlert(alert.id)}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        sx={{
                            position: "relative",
                            top: "unset",
                            left: "unset",
                            right: "unset",
                            transform: "none",
                            pointerEvents: "all",
                        }}
                    >
                        <Alert
                            onClose={() => closeAlert(alert.id)}
                            severity={alert.severity}
                            variant="filled"
                            sx={{ width: "100%", boxShadow: 3 }}
                        >
                            {alert.message}
                        </Alert>
                    </Snackbar>
                ))}
            </Box>
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
}