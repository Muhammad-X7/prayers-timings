import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { memo } from "react";

const Header = memo(({
    today,
    cityName,
    loading,
    remainingUntil,
    nextPrayerName,
    remainingTime,
    language,
    darkMode,
    onToggleLanguage,
    onToggleDarkMode,
    t
}) => {
    return (
        <Grid container spacing={2} alignItems="center">
            {/* التاريخ والمدينة */}
            <Grid xs={12} sm={5}>
                <h2 className="today">{today}</h2>
                <h1 className="city">
                    {cityName}
                    {loading && (
                        <CircularProgress
                            size={20}
                            style={{ color: "#00b040ff" }}
                        />
                    )}
                </h1>
                {/* <h2 style={{ margin: "8px 0 12px" }}>{today}</h2>
                <h1 style={{
                    margin: "8px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    {cityName}
                    {loading && (
                        <CircularProgress
                            size={20}
                            style={{ color: "#00b040ff" }}
                        />
                    )}
                </h1> */}
            </Grid>

            {/* العد التنازلي */}
            <Grid xs={12} sm={5}>
                <div>
                    <h2 className="remaining-until">
                        {remainingUntil} {nextPrayerName}
                    </h2>
                    <h1 className="remaining-time">
                        {remainingTime}
                    </h1>
                </div>
                {/* <div>
                    <h2 style={{ margin: "8px 0" }}>
                        {remainingUntil} {nextPrayerName}
                    </h2>
                    <h1 style={{ color: "#00b040ff", margin: "8px 0", fontSize: "2.3rem" }}>
                        {remainingTime}
                    </h1>
                </div> */}
            </Grid>

            {/* أزرار اللغة والوضع */}
            <Grid xs={12} sm={2}>
                <Stack className="stack-btn" direction="row" style={{ gap: "20px" }} spacing={1} justifyContent="center">
                    <Button
                        onClick={onToggleLanguage}
                        variant="outlined"
                        size="small"
                        className="btn-mode"
                        style={{
                            color: darkMode ? "white" : "#242424",
                            borderColor: darkMode ? "white" : "#242424",
                        }}
                    >
                        {t("language")}
                    </Button>
                    <Button
                        onClick={onToggleDarkMode}
                        variant="outlined"
                        size="small"
                        className="btn-language"
                        style={{
                            color: darkMode ? "white" : "#242424",
                            borderColor: darkMode ? "white" : "#242424",
                        }}
                    >
                        {darkMode ? t("darkMode") : t("lightMode")}
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
});

Header.displayName = "Header";

Header.propTypes = {
    today: PropTypes.string.isRequired,
    cityName: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    remainingUntil: PropTypes.string.isRequired,
    nextPrayerName: PropTypes.string.isRequired,
    remainingTime: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    darkMode: PropTypes.bool.isRequired,
    onToggleLanguage: PropTypes.func.isRequired,
    onToggleDarkMode: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

export default Header;