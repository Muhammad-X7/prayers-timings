import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useState, useCallback, useMemo } from "react";

// Components
import Header from "./Header";
import ErrorAlert from "./ErrorAlert";
import PrayerGrid from "./PrayerGrid";
import CitySelector from "./CitySelector";

// Constants & Hooks
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
	// State
	const [language, setLanguage] = useState('ar');
	const [selectedCity, setSelectedCity] = useState(defaultCity);

	// Translation function
	const t = useCallback(
		(key) => translations[language]?.[key] ?? key,
		[language]
	);

	// Custom Hooks
	const { timings, loading, error, refetch } = usePrayerTimings(selectedCity, t);
	const { nextPrayerIndex, remainingTime } = useCountdown(timings, prayersArray);
	const today = useDateTime(language);

	// Handlers
	const handleCityChange = useCallback((event) => {
		const [country, apiName] = event.target.value.split('-');
		const cityObject = availableCities.find((city) => {
			return city.country === country && city.apiName === apiName;
		});
		setSelectedCity(cityObject);
	}, []);

	const toggleLanguage = useCallback(() => {
		setLanguage(prev => prev === "ar" ? "en" : "ar");
	}, []);

	const toggleDarkMode = useCallback(() => {
		setDarkMode(prev => !prev);
	}, [setDarkMode]);

	// Styles
	const containerStyle = useMemo(() => ({
		direction: language === "ar" ? "rtl" : "ltr",
		backgroundColor: darkMode ? "#1f1f1fff" : "#e9e9e9ff",
		color: darkMode ? "#e9e9e9ff" : "#1f1f1fff",
		minHeight: "calc(100vh - 40px)",
		padding: "12px 18px"
	}), [language, darkMode]);

	return (
		<div style={containerStyle}>
			{/* رسالة الخطأ */}
			<ErrorAlert
				error={error}
				darkMode={darkMode}
				loading={loading}
				onRetry={refetch}
				t={t}
			/>

			{/* الرأسية */}
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

			{/* الفاصل */}
			<Divider
				style={{
					borderColor: darkMode ? "white" : "#242424",
					opacity: "0.1",
					margin: "16px 0"
				}}
			/>

			{/* شبكة الصلوات */}
			<PrayerGrid
				prayersArray={prayersArray}
				timings={timings}
				language={language}
				darkMode={darkMode}
			/>

			{/* اختيار المدينة */}
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