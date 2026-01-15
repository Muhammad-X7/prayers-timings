import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ar";

// تحويل الوقت إلى دقائق
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

// تحويل الأرقام إلى عربية
const toArabicDigits = (str) =>
    str.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

// Hook لجلب أوقات الصلاة مع caching
export const usePrayerTimings = (selectedCity, t) => {
    const [timings, setTimings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memory cache في الجلسة الحالية
    const cacheRef = useRef({});

    const getTimings = useCallback(async () => {
        if (!selectedCity) return;

        const cacheKey = `${selectedCity.country}-${selectedCity.apiName}`;
        const todayKey = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // --- 1️⃣ التحقق من Memory Cache ---
        if (cacheRef.current[cacheKey]?.date === todayKey) {
            setTimings(cacheRef.current[cacheKey].data);
            return;
        }

        // --- 2️⃣ التحقق من LocalStorage ---
        const storageKey = `timings-${cacheKey}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.date === todayKey) {
                    cacheRef.current[cacheKey] = parsed;
                    setTimings(parsed.data);
                    return;
                }
            } catch {
                // تجاهل أي خطأ في parsing
            }
        }

        // --- 3️⃣ جلب البيانات من API ---
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://api.aladhan.com/v1/timings", {
                params: {
                    latitude: selectedCity.lat,
                    longitude: selectedCity.lng,
                    method: 4,
                },
            });

            const times = response.data.data.timings;
            const cityTimings = {
                Fajr: times.Fajr,
                Dhuhr: times.Dhuhr,
                Asr: times.Asr,
                Sunset: times.Maghrib,
                Isha: times.Isha,
            };

            const cacheData = { data: cityTimings, date: todayKey };

            // حفظ في Memory Cache
            cacheRef.current[cacheKey] = cacheData;

            // حفظ في LocalStorage
            localStorage.setItem(storageKey, JSON.stringify(cacheData));

            setTimings(cityTimings);
        } catch (err) {
            setError(err.response?.data?.message || t("errorLoading"));
        } finally {
            setLoading(false);
        }
    }, [selectedCity, t]);

    useEffect(() => {
        getTimings();
    }, [getTimings]);

    return { timings, loading, error, refetch: getTimings };
};


// Hook للعد التنازلي (مُصلح)
export const useCountdown = (timings) => {
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState("");

    // حفظ أوقات الصلاة بالدقائق لتجنب الحساب كل ثانية
    const prayerMinutesRef = useRef([]);

    useEffect(() => {
        if (!timings) return;

        prayerMinutesRef.current = [
            { key: "Fajr", minutes: timeToMinutes(timings.Fajr) },
            { key: "Dhuhr", minutes: timeToMinutes(timings.Dhuhr) },
            { key: "Asr", minutes: timeToMinutes(timings.Asr) },
            { key: "Sunset", minutes: timeToMinutes(timings.Sunset) },
            { key: "Isha", minutes: timeToMinutes(timings.Isha) },
        ];
    }, [timings]);

    useEffect(() => {
        // ⚠️ الحل: التأكد من وجود timings قبل بدء العد التنازلي
        if (!timings || prayerMinutesRef.current.length === 0) return;

        const updateCountdown = () => {
            const now = dayjs();
            const currentMinutes = now.hour() * 60 + now.minute();

            const prayers = prayerMinutesRef.current;

            // التأكد من وجود بيانات الصلوات
            if (!prayers || prayers.length === 0) return;

            // إيجاد الصلاة القادمة
            let index = prayers.findIndex(p => currentMinutes < p.minutes);
            if (index === -1) index = 0; // بعد آخر صلاة

            setNextPrayerIndex(index);

            let diff = prayers[index].minutes - currentMinutes;
            if (diff <= 0) diff += 24 * 60;

            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;
            const seconds = (60 - now.second()) % 60;

            setRemainingTime(
                `${hours.toString().padStart(2, "0")} : ${minutes
                    .toString()
                    .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`
            );
        };

        // تنفيذ فوري
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [timings]); // ⚠️ إضافة timings كـ dependency

    return { nextPrayerIndex, remainingTime };
};

// Hook للتاريخ والوقت (معدل)
export const useDateTime = (language) => {
    const [today, setToday] = useState("");

    useEffect(() => {
        dayjs.locale(language === "ar" ? "ar" : "en");

        const updateDate = () => {
            const now = dayjs();

            if (language === "ar") {
                const datePart = now.format("dddd، D MMMM YYYY");
                const timePart = now.format("hh:mm");
                const meridiem = now.format("A")
                    .replace("AM", "ص")
                    .replace("PM", "م");

                setToday(
                    `${toArabicDigits(datePart)} | ${toArabicDigits(timePart)} ${meridiem}`
                );
            } else {
                setToday(
                    now.format("dddd, D MMMM YYYY | HH:mm")
                );
            }
        };

        updateDate();
        const interval = setInterval(updateDate, 60000);

        return () => clearInterval(interval);
    }, [language]);

    return today;
};