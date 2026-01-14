import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import useMediaQuery from "@mui/material/useMediaQuery";
import Prayer from "./Prayer";
import { memo } from "react";

const PrayerGrid = memo(({ prayersArray, timings, language, darkMode }) => {
    const isLargeScreen = useMediaQuery("(min-width:900px)");

    return (
        <Grid container spacing={2} style={{ marginTop: "12px" }}>
            {prayersArray.map((prayer, index) => (
                <Grid key={prayer.key} xs={12} sm={6} md={4} lg={2.4}>
                    <Prayer
                        name={prayer.displayName[language]}
                        time={timings[prayer.key]}
                        image={prayer.key}
                        darkMode={darkMode}
                        isPriority={isLargeScreen || index === 0}
                    />
                </Grid>
            ))}
        </Grid>
    );
});

PrayerGrid.displayName = "PrayerGrid";

PrayerGrid.propTypes = {
    prayersArray: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            displayName: PropTypes.object.isRequired
        })
    ).isRequired,
    timings: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    darkMode: PropTypes.bool.isRequired
};

export default PrayerGrid;
