import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import { useCallback, useMemo } from "react";

import Header from "./Header";
import ErrorAlert from "./ErrorAlert";
import PrayerGrid from "./PrayerGrid";
import CitySelector from "./CitySelector";
import { useLocalStorage } from "../hooks/useLocalStorage";

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
	// اللغة مخزنة في localStorage
	const [language, setLanguage] = useLocalStorage("language", "ar");

	// المدينة مختارة مخزنة في localStorage
	const [selectedCity, setSelectedCity] = useLocalStorage(
		"selectedCity",
		defaultCity
	);

	// نسخة آمنة من المدينة للتحقق من صحتها
	const safeCity = useMemo(() => {
		const exists = availableCities.find(
			c =>
				c.country === selectedCity?.country &&
				c.apiName === selectedCity?.apiName
		);
		return exists || defaultCity;
	}, [selectedCity]);

	// دالة ترجمة
	const t = useCallback(
		(key) => translations[language]?.[key] ?? key,
		[language]
	);

	// Hooks الرئيسية
	const { timings, loading, error, refetch } = usePrayerTimings(safeCity, t);
	const { nextPrayerIndex, remainingTime } = useCountdown(timings, prayersArray);
	const today = useDateTime(language);

	// تغيير المدينة
	const handleCityChange = useCallback((event) => {
		const [country, apiName] = event.target.value.split("-");
		const cityObject = availableCities.find(
			city => city.country === country && city.apiName === apiName
		);
		setSelectedCity(cityObject);
	}, [setSelectedCity]);

	// تغيير اللغة
	const toggleLanguage = () => setLanguage(prev => (prev === "ar" ? "en" : "ar"));

	// تبديل الوضع الليلي فقط في App.jsx
	const toggleDarkMode = () => setDarkMode(prev => !prev);

	// ستايل الحاوية حسب اللغة والوضع
	const containerStyle = useMemo(() => ({
		direction: language === "ar" ? "rtl" : "ltr",
		backgroundColor: darkMode ? "#1f1f1fff" : "#e9e9e9ff",
		color: darkMode ? "#e9e9e9ff" : "#1f1f1fff",
		minHeight: "calc(100vh - 40px)",
		padding: "12px 18px"
	}), [language, darkMode]);

	return (
		<div style={containerStyle}>
			<ErrorAlert
				error={error}
				darkMode={darkMode}
				loading={loading}
				onRetry={refetch}
				t={t}
			/>

			<Header
				today={today}
				cityName={safeCity.displayName[language]}
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

			<Divider
				style={{
					borderColor: darkMode ? "white" : "#242424",
					opacity: "0.1",
					margin: "16px 0"
				}}
			/>

			<PrayerGrid
				prayersArray={prayersArray}
				timings={timings}
				language={language}
				darkMode={darkMode}
			/>

			<CitySelector
				selectedCity={safeCity}
				handleCityChange={handleCityChange}
				availableCities={availableCities}
				language={language}
				darkMode={darkMode}
				loading={loading}
				t={t}
			/>
		</div>
	);
}
