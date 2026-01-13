// الترجمات
export const translations = {
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

// المدن المتاحة
export const availableCities = [
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

// مصفوفة الصلوات
export const prayersArray = [
    { key: "Fajr", displayName: { ar: "الفجر", en: "Fajr" } },
    { key: "Dhuhr", displayName: { ar: "الظهر", en: "Dhuhr" } },
    { key: "Asr", displayName: { ar: "العصر", en: "Asr" } },
    { key: "Sunset", displayName: { ar: "المغرب", en: "Maghrib" } },
    { key: "Isha", displayName: { ar: "العشاء", en: "Isha" } },
];

// المدينة الافتراضية
export const defaultCity = {
    displayName: { ar: "مكة المكرمة", en: "Makkah" },
    apiName: "Makkah al Mukarramah",
    country: "SA",
    lat: 21.4225,
    lng: 39.8262
};

// أوقات الصلاة الافتراضية
export const defaultTimings = {
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Sunset: "18:03",
    Isha: "19:33",
};