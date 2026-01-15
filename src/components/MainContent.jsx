import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useState, useCallback, useMemo, useEffect } from "react";

import Header from "./Header";
import ErrorAlert from "./ErrorAlert";
import PrayerGrid from "./PrayerGrid";
import CitySelector from "./CitySelector";

import {
	translations,
	availableCities,
	prayersArray,
	defaultCity
} from "../constants/constants";

import {
	usePrayerTimings,
	useCountdown,
	useDateTime
} from "../hooks/hooks";

MainContent.propTypes = {
	darkMode: PropTypes.bool.isRequired,
	setDarkMode: PropTypes.func.isRequired
};

export default function MainContent({ darkMode, setDarkMode }) {
	// اللغة مع التخزين في localStorage
	const [language, setLanguage] = useState(() => {
		return localStorage.getItem("language") || "ar";
	});

	useEffect(() => {
		localStorage.setItem("language", language);
	}, [language]);

	// المدينة مع التخزين في localStorage
	const [selectedCity, setSelectedCity] = useState(() => {
		const savedCity = localStorage.getItem("selectedCity");
		if (savedCity) {
			try {
				const parsedCity = JSON.parse(savedCity);
				// التحقق من أن المدينة المحفوظة موجودة في القائمة
				const cityExists = availableCities.find(
					city => city.country === parsedCity.country &&
						city.apiName === parsedCity.apiName
				);
				return cityExists || defaultCity;
			} catch {
				return defaultCity;
			}
		}
		return defaultCity;
	});

	// حفظ المدينة المختارة في localStorage عند التغيير
	useEffect(() => {
		localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
	}, [selectedCity]);

	const t = useCallback(
		(key) => translations[language]?.[key] ?? key,
		[language]
	);

	const { timings, loading, error, refetch } = usePrayerTimings(selectedCity, t);
	const { nextPrayerIndex, remainingTime } = useCountdown(timings, prayersArray);
	const today = useDateTime(language);

	const handleCityChange = useCallback((event) => {
		const [country, apiName] = event.target.value.split('-');
		const cityObject = availableCities.find((city) => city.country === country && city.apiName === apiName);
		setSelectedCity(cityObject);
	}, []);

	const toggleLanguage = () => setLanguage(prev => (prev === "ar" ? "en" : "ar"));

	// DarkMode toggle فقط يغير القيمة في App.jsx
	const toggleDarkMode = () => setDarkMode(prev => !prev);

	const containerStyle = useMemo(() => ({
		direction: language === "ar" ? "rtl" : "ltr",
		backgroundColor: darkMode ? "#1f1f1fff" : "#e9e9e9ff",
		color: darkMode ? "#e9e9e9ff" : "#1f1f1fff",
		minHeight: "calc(100vh - 40px)",
		padding: "12px 18px"
	}), [language, darkMode]);

	return (
		<div style={containerStyle}>
			<ErrorAlert error={error} darkMode={darkMode} loading={loading} onRetry={refetch} t={t} />

			<Header
				today={today}
				cityName={selectedCity.displayName[language]}
				loading={loading}
				remainingUntil={t("remainingUntil")}
				nextPrayerName={prayersArray[nextPrayerIndex].displayName[language]}
				remainingTime={remainingTime}
				language={language}
				darkMode={darkMode}
				onToggleLanguage={toggleLanguage}
				onToggleDarkMode={toggleDarkMode}
				t={t}
			/>

			<Divider style={{ borderColor: darkMode ? "white" : "#242424", opacity: "0.1", margin: "16px 0" }} />

			<PrayerGrid prayersArray={prayersArray} timings={timings} language={language} darkMode={darkMode} />

			<Stack direction="row" justifyContent="center" style={{ marginTop: "20px" }}>
				<CitySelector
					selectedCity={selectedCity}
					handleCityChange={handleCityChange}
					availableCities={availableCities}
					language={language}
					darkMode={darkMode}
					loading={loading}
					t={t}
				/>
			</Stack>
		</div>
	);
}