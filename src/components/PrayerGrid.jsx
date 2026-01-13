import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import Prayer from "./Prayer";
import { memo, useState, useEffect } from "react";

const PrayerGrid = memo(({ prayersArray, timings, language, darkMode }) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // تحديث عرض الشاشة عند تغيير الحجم
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Grid container spacing={2} style={{ marginTop: "12px" }}>
            {prayersArray.map((prayer, index) => (
                <Grid key={prayer.key} xs={12} sm={6} md={4} lg={2.4}>
                    <Prayer
                        name={prayer.displayName[language]}
                        time={timings[prayer.key]}
                        image={prayer.key}
                        darkMode={darkMode}
                        isPriority={
                            screenWidth > 900 // الشاشات الكبيرة → كل الصور eager
                                ? true
                                : index === 0 // الشاشات الصغيرة والمتوسطة → الصورة الأولى فقط
                        }
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
