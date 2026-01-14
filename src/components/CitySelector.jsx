import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
//
const CitySelector = React.memo(({
    selectedCity,
    handleCityChange,
    availableCities,
    language,
    darkMode,
    loading,
    t
}) => {
    return (
        <Stack direction="row" justifyContent="center" style={{ marginTop: "20px" }}>
            <FormControl style={{ width: "280px" }}>
                <Select
                    aria-label={t("city")} // ترجمة اسم العنصر
                    labelId="city-select-label"
                    value={`${selectedCity.country}-${selectedCity.apiName}`}
                    onChange={handleCityChange}
                    displayEmpty
                    disabled={loading}
                    style={{
                        color: darkMode ? "white" : "#242424",
                        backgroundColor: darkMode ? "#424242" : "#ffffff"
                    }}
                >
                    <MenuItem disabled style={{ fontWeight: "bold", color: "#666" }}>
                        {t("saudiArabia")}
                    </MenuItem>
                    {availableCities.filter(city => city.country === "SA").map(city => (
                        <MenuItem key={`${city.country}-${city.apiName}`} value={`${city.country}-${city.apiName}`}>
                            {city.displayName[language]}
                        </MenuItem>
                    ))}

                    <MenuItem disabled style={{ fontWeight: "bold", color: "#666" }}>
                        {t("iraq")}
                    </MenuItem>
                    {availableCities.filter(city => city.country === "IQ").map(city => (
                        <MenuItem key={`${city.country}-${city.apiName}`} value={`${city.country}-${city.apiName}`}>
                            {city.displayName[language]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    );
});

CitySelector.displayName = "CitySelector";

CitySelector.propTypes = {
    selectedCity: PropTypes.shape({
        country: PropTypes.string.isRequired,
        apiName: PropTypes.string.isRequired
    }).isRequired,
    handleCityChange: PropTypes.func.isRequired,
    availableCities: PropTypes.arrayOf(
        PropTypes.shape({
            country: PropTypes.string.isRequired,
            apiName: PropTypes.string.isRequired,
            displayName: PropTypes.object.isRequired
        })
    ).isRequired,
    language: PropTypes.string.isRequired,
    darkMode: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired
};

export default CitySelector;
