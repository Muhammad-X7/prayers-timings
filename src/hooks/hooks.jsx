import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";

// تحويل الوقت إلى دقائق
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Hook لجلب أوقات الصلاة
export const usePrayerTimings = (selectedCity, t) => {
    const [timings, setTimings] = useState({
        Fajr: "04:20",
        Dhuhr: "11:50",
        Asr: "15:18",
        Sunset: "18:03",
        Isha: "19:33",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                        method: 4
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

    useEffect(() => {
        getTimings();
    }, [getTimings]);

    return { timings, loading, error, refetch: getTimings };
};

// Hook للعد التنازلي
export const useCountdown = (timings, prayersArray) => {
    const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
    const [remainingTime, setRemainingTime] = useState("");

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
            prayerIndex = 0;
        }

        setNextPrayerIndex(prayerIndex);

        let timeDiff = prayerTimes[prayerIndex].minutes - currentTime;
        if (timeDiff <= 0) timeDiff += 24 * 60;

        const hours = Math.floor(timeDiff / 60);
        const minutes = timeDiff % 60;
        const seconds = (60 - now.getSeconds()) % 60;

        // setRemainingTime(
        //     `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`
        // );

        setRemainingTime(
            `${hours.toString().padStart(2, "0")} : 
                ${minutes.toString().padStart(2, "0")} : 
                ${seconds.toString().padStart(2, "0")}`
        );

    }, [timings]);

    useEffect(() => {
        if (!timings) return;

        setupCountdownTimer(); // ← تنفيذ فوري بدون انتظار

        const interval = setInterval(setupCountdownTimer, 1000);
        return () => clearInterval(interval);
    }, [setupCountdownTimer]);

    return { nextPrayerIndex, remainingTime };
};

// Hook للتاريخ والوقت
export const useDateTime = (language) => {
    const [today, setToday] = useState("");

    useEffect(() => {
        moment.locale(language);

        const updateDate = () => {
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
        };

        updateDate();
        const interval = setInterval(updateDate, 60000); // تحديث كل دقيقة

        return () => clearInterval(interval);
    }, [language]);

    return today;
};