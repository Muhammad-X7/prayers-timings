import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { memo } from "react";

const ErrorAlert = memo(({
    error,
    darkMode,
    loading,
    onRetry,
    t
}) => {
    if (!error) return null;

    return (
        <Alert
            severity="error"
            style={{
                marginBottom: "20px",
                backgroundColor: darkMode ? "#5c2020" : "#f8d7da",
                color: darkMode ? "#ff5252" : "#721c24"
            }}
            action={
                <Button
                    color="inherit"
                    size="small"
                    onClick={onRetry}
                    disabled={loading}
                >
                    {t("retry")}
                </Button>
            }
        >
            {t("errorLoading")}: {error}
        </Alert>
    );
});

ErrorAlert.displayName = "ErrorAlert";

ErrorAlert.propTypes = {
    error: PropTypes.string,
    darkMode: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onRetry: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

export default ErrorAlert;