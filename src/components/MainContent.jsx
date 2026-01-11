import PropTypes from "prop-types";
import CitySelector from "./CitySelector";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import { Button, Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useState, useEffect, useCallback, useMemo } from "react";

import "moment/dist/locale/ar-dz";

MainContent.propTypes = {
	darkMode: PropTypes.bool.isRequired,
	setDarkMode: PropTypes.func.isRequired
};


// Translations
const translations = {
	ar: {
		title: "أوقات الصلاة",
		remainingUntil: "متبقي حتى صلاة",
		city: "المدينة",
		saudiArabia: "السعودية",
		iraq: "العراق",
		language: "English",
		darkMode: "الوضع النهاري",
		lightMode: "الوضع الليلي",
		loading: "جاري التحميل...",
		errorLoading: "فشل تحميل الأوقات",
		retry: "إعادة المحاولة"
	},
	en: {
		title: "Prayer Times",
		remainingUntil: "Remaining until",
		city: "City",
		saudiArabia: "Saudi Arabia",
		iraq: "Iraq",
		language: "العربية",
		darkMode: "Light Mode",
		lightMode: "Dark Mode",
		loading: "Loading...",
		errorLoading: "Failed to load times",
		retry: "Retry"
	}
};

// Available cities with Arabic and English names + coordinates
const availableCities = [
	// Saudi Arabia
	{
		displayName: { ar: "مكة المكرمة", en: "Makkah" },
		apiName: "Makkah al Mukarramah",
		country: "SA",
		lat: 21.4225,
		lng: 39.8262
	},
	{
		displayName: { ar: "الرياض", en: "Riyadh" },
		apiName: "Riyadh",
		country: "SA",
		lat: 24.7136,
		lng: 46.6753
	},
	{
		displayName: { ar: "جدة", en: "Jeddah" },
		apiName: "Jeddah",
		country: "SA",
		lat: 21.5433,
		lng: 39.1728
	},
	{
		displayName: { ar: "الدمام", en: "Dammam" },
		apiName: "Dammam",
		country: "SA",
		lat: 26.4207,
		lng: 50.0888
	},
	// Iraq
	{
		displayName: { ar: "بغداد", en: "Baghdad" },
		apiName: "Baghdad",
		country: "IQ",
		lat: 33.3152,
		lng: 44.3661
	},
	{
		displayName: { ar: "أربيل", en: "Erbil" },
		apiName: "Erbil",
		country: "IQ",
		lat: 36.1911,
		lng: 44.0092
	},
	{
		displayName: { ar: "كركوك", en: "Kirkuk" },
		apiName: "Kirkuk",
		country: "IQ",
		lat: 35.4681,
		lng: 44.3922
	},
	{
		displayName: { ar: "البصرة", en: "Basra" },
		apiName: "Basra",
		country: "IQ",
		lat: 30.5085,
		lng: 47.7835
	}
];

export default function MainContent({ darkMode, setDarkMode }) {
	// STATES مع القيم المحفوظة من localStorage
	const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
	const [timings, setTimings] = useState({
		Fajr: "04:20",
		Dhuhr: "11:50",
		Asr: "15:18",
		Sunset: "18:03",
		Isha: "19:33",
	});

	const [remainingTime, setRemainingTime] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// تحميل اللغة المحفوظة أو الافتراضية
	const [language, setLanguage] = useState(() => {
		const savedLanguage = localStorage.getItem('prayerApp_language');
		return savedLanguage ? savedLanguage : 'ar';
	});

	// تحميل المدينة المحفوظة أو الافتراضية
	const [selectedCity, setSelectedCity] = useState(() => {
		const savedCity = localStorage.getItem('prayerApp_selectedCity');
		return savedCity ? JSON.parse(savedCity) : {
			displayName: { ar: "مكة المكرمة", en: "Makkah" },
			apiName: "Makkah al Mukarramah",
			country: "SA",
			lat: 21.4225,
			lng: 39.8262
		};
	});

	const [today, setToday] = useState("");


	const prayersArray = [
		{ key: "Fajr", displayName: { ar: "الفجر", en: "Fajr" } },
		{ key: "Dhuhr", displayName: { ar: "الظهر", en: "Dhuhr" } },
		{ key: "Asr", displayName: { ar: "العصر", en: "Asr" } },
		{ key: "Sunset", displayName: { ar: "المغرب", en: "Maghrib" } },
		{ key: "Isha", displayName: { ar: "العشاء", en: "Isha" } },
	];


	// const t = (key) => translations[language][key];

	const t = useCallback(
		(key) => translations[language]?.[key] ?? key,
		[language]
	);

	useEffect(() => {
		// حفظ اللغة
		localStorage.setItem('prayerApp_language', language);
		moment.locale(language);

		// حفظ المدينة فقط إذا كانت موجودة
		if (selectedCity) {
			localStorage.setItem(
				'prayerApp_selectedCity',
				JSON.stringify(selectedCity)
			);
		}
	}, [language, selectedCity]);


	// استخدام aladhan.com API فقط - الأكثر موثوقية
	const getTimings = useCallback(async () => {
		setLoading(true);
		setError(null);
		if (!selectedCity) return;

		try {
			const response = await axios.get(
				"https://api.aladhan.com/v1/timings",
				{
					params: {
						latitude: selectedCity.lat,
						longitude: selectedCity.lng,
						method: 4 // Umm Al-Qura
					}
				}
			);

			const times = response.data.data.timings;

			setTimings({
				Fajr: times.Fajr,
				Dhuhr: times.Dhuhr,
				Asr: times.Asr,
				Sunset: times.Maghrib,
				Isha: times.Isha
			});

		} catch (err) {
			setError(err.response?.data?.message || t("errorLoading"));
		} finally {
			setLoading(false);
		}
	}, [selectedCity, t]);


	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	// جلب أوقات الصلاة عند تغيير المدينة
	useEffect(() => {
		getTimings();
	}, [getTimings]);

	// دالة العد التنازلي للصلاة القادمة
	const setupCountdownTimer = useCallback(() => {
		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();

		const prayerTimes = [
			{ key: "Fajr", minutes: timeToMinutes(timings.Fajr) },
			{ key: "Dhuhr", minutes: timeToMinutes(timings.Dhuhr) },
			{ key: "Asr", minutes: timeToMinutes(timings.Asr) },
			{ key: "Sunset", minutes: timeToMinutes(timings.Sunset) },
			{ key: "Isha", minutes: timeToMinutes(timings.Isha) },
		];

		let prayerIndex = 0;
		for (let i = 0; i < prayerTimes.length; i++) {
			if (currentTime < prayerTimes[i].minutes) {
				prayerIndex = i;
				break;
			}
		}

		if (currentTime >= prayerTimes[prayerTimes.length - 1].minutes) {
			prayerIndex = 0; // next day Fajr
		}

		setNextPrayerIndex(prayerIndex);

		let timeDiff = prayerTimes[prayerIndex].minutes - currentTime;
		if (timeDiff <= 0) timeDiff += 24 * 60;

		const hours = Math.floor(timeDiff / 60);
		const minutes = timeDiff % 60;
		const seconds = 60 - now.getSeconds();

		setRemainingTime(
			`${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`
		);
	}, [timings]);


	useEffect(() => {
		let interval = setInterval(() => {
			setupCountdownTimer();
		}, 1000);

		const now = new Date();
		setToday(
			now.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			}) +
			" | " +
			now.toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US", {
				hour: "2-digit",
				minute: "2-digit",
			})
		);

		return () => clearInterval(interval);
	}, [language, setupCountdownTimer]);

	const timeToMinutes = (time) => {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	};


	const handleCityChange = useCallback((event) => {
		const [country, apiName] = event.target.value.split('-');
		const cityObject = availableCities.find((city) => {
			return city.country === country && city.apiName === apiName;
		});
		setSelectedCity(cityObject);
	}, []);

	const toggleLanguage = () => {
		setLanguage(language === "ar" ? "en" : "ar");
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const containerStyle = useMemo(() => ({
		direction: language === "ar" ? "rtl" : "ltr",
		backgroundColor: darkMode ? "#1f1f1fff" : "#e9e9e9ff",
		color: darkMode ? "#e9e9e9ff" : "#1f1f1fff",
		minHeight: "calc(100vh - 40px)",
		padding: "12px 18px"
	}), [language, darkMode]);
	return (
		<div style={containerStyle}>
			{/* رسالة خطأ مع زر إعادة المحاولة */}
			{error && (
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
							onClick={getTimings}
							disabled={loading}
						>
							{t("retry")}
						</Button>
					}
				>
					{t("errorLoading")}: {error}
				</Alert>
			)}

			{/* TOP ROW */}
			<Grid container spacing={2} alignItems="center">
				{/* التاريخ */}
				<Grid xs={12} sm={5}>
					<h2>{today}</h2>
					<h1>
						{selectedCity.displayName[language]}
						{loading && (
							<CircularProgress
								size={20}
								style={{
									marginRight: language === "ar" ? "10px" : "0",
									marginLeft: language === "en" ? "10px" : "0",
									color: "#00b040ff"
								}}
							/>
						)}
					</h1>
				</Grid>
				<Grid xs={12} sm={5}>
					<div>
						<h2>
							{t("remainingUntil")} {prayersArray[nextPrayerIndex].displayName[language]}
						</h2>
						<h1 style={{ color: "#00b040ff" }}>{remainingTime}</h1>
					</div>
				</Grid>

				{/* أزرار اللغة والوضع */}
				<Grid xs={12} sm={2}>
					<Stack direction="row" spacing={2}>
						<Button
							onClick={toggleLanguage}
							variant="outlined"
							size="small"
							style={{
								color: darkMode ? "white" : "#242424",
								borderColor: darkMode ? "white" : "#242424",
								fontSize: "12px",
								marginLeft: "10px",
								padding: "8px 8px"

							}}
						>
							{t("language")}
						</Button>
						<Button
							onClick={toggleDarkMode}
							variant="outlined"
							size="small"
							style={{
								color: darkMode ? "white" : "#242424",
								borderColor: darkMode ? "white" : "#242424",
								fontSize: "12px",
								marginRight: "10px",
								padding: "8px 8px"
							}}
						>
							{darkMode ? t("darkMode") : t("lightMode")}
						</Button>
					</Stack>
				</Grid>
			</Grid>

			<Divider style={{ borderColor: darkMode ? "white" : "#242424", opacity: "0.1" }} />

			{/* PRAYERS CARDS */}
			<Grid container spacing={2} style={{ marginTop: "20px" }}>
				{prayersArray.map((prayer) => (
					<Grid key={prayer.key} xs={12} sm={6} md={4} lg={2.4}>
						<Prayer
							name={prayer.displayName[language]}
							time={timings[prayer.key]}
							// هنا نفترض أن الصور بنفس أسماء المفاتيح
							image={`${prayer.key}`}
							darkMode={darkMode}
						/>
					</Grid>
				))}
			</Grid>
			{/* SELECT CITY */}
			<Stack
				direction="row"
				justifyContent={"center"}
				style={{ marginTop: "20px" }}
			>
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