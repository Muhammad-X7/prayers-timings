import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ar";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);

// تخصيص locale العربي
dayjs.updateLocale("ar", {
  months: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
  weekdays: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ],
  meridiem: (hour) => (hour < 12 ? "ص" : "م"),
});

export default dayjs;
