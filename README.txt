MOURIS WATCH PWA - نسخه کامل اصلاح‌شده

محتویات:
- index.html: صفحه اصلی
- repair.html: فرم تعمیرات
- new-order.html: فرم سفارش جدید
- assets/app.js و assets/style.css: منطق و ظاهر سایت
- manifest.json و sw.js: تنظیمات PWA، نصب و کش
- assets/mouris-logo.png: لوگوی اصلی
- assets/icon-192.png و assets/icon-512.png: آیکون‌های نصب PWA
- assets/fonts: فونت سایت

نکات:
1) تمام فایل‌ها و پوشه‌ها را با همین ساختار روی هاست/گیت‌هاب قرار دهید.
2) شماره مقصد پیامک تعمیرات، شماره‌ای است که مشتری در فرم وارد می‌کند.
3) پیامک سفارش جدید به شماره فروشگاه 09126022112 آماده می‌شود.
4) سایت فقط برنامه پیامک گوشی را با متن آماده باز می‌کند؛ ارسال نهایی را کاربر در برنامه پیامک تأیید می‌کند.
5) شماره تماس و واتساپ فروشگاه: 09126022112
6) اینستاگرام: https://www.instagram.com/morriswatch1/
7) پس از انتشار نسخه جدید، در صورت نمایش نسخه قدیمی، کش مرورگر/PWA را به‌روزرسانی کنید.


به‌روزرسانی اصلاحات رابط کاربری (نسخه v9):
- حداقل زمان نمایش لودینگ به ۱۲۰۰ میلی‌ثانیه افزایش یافت.
- جابه‌جایی ماه‌های تقویم شمسی اصلاح شد و کلیک روی ماه قبل/بعد دیگر تقویم را نمی‌بندد.
- فونت محلی سایت برای تقویم نیز اعمال شد و مسیر فایل فونت اصلاح شد.
- دکمه‌های شناور تماس، واتساپ و اینستاگرام فقط آیکون دارند؛ دکمه‌های ثابت گوگل‌مپ و نشان جدا و دارای متن هستند.
- نسخه کش سرویس‌ورکر به v9 ارتقا یافت.


نسخه نهایی v18:
- استایل تیتر خوش‌آمدگویی از روی ALMAS-main کپی و با طیف سبزآبی موریس هماهنگ شد؛ فونت Koodak نیز باینری یکسان با ALMAS است.
- دکمه کوچک بروزرسانی دقیقاً زیر نشانی فروشگاه قرار گرفت و دیگر شناور نیست؛ فقط در صفحه اصلی نمایش داده می‌شود.
- آیکون‌های واتساپ و اینستاگرام در نوار شناور با سیلوئت‌های برند جایگزین شدند.
- نرخ دلار و یورو از همان Worker پروژه ALMAS دریافت می‌شود.
- فرم سفارش و تعمیرات به Web App گوگل‌شیت متصل است؛ پیامک آماده نیز حفظ شده است.
- نام PWA برابر MOURIS WATCH و نسخه کش Service Worker برابر v18 است.


نسخه نهایی v19:
- فونت تیتر «به گالری ساعت موریس خوش آمدید» به Estedad Black (وزن 900) تغییر کرد.
- فقط فونت تیتر اصلی تغییر کرده؛ فونت Koodak در سایر بخش‌های سایت بدون تغییر باقی مانده است.
- فونت Estedad از Google Fonts بارگذاری می‌شود؛ برای بارگذاری اولیه آن اتصال اینترنت لازم است و در حالت آفلاین، فونت Koodak به‌عنوان جایگزین نمایش داده می‌شود.
- نسخه کش Service Worker برابر v19 است.


VERSION 20 NOTES
- Estedad Regular, Medium and Black font files are hosted locally in assets/fonts.
- Welcome heading uses Estedad Medium (500); service action titles use Estedad Regular (400).
- Service descriptions remain in Koodak.
- Removed external Google Fonts dependencies.
- Header border and shadow removed for a seamless transition into the page.
- Replaced generic circular background decoration with subtle watch-face and wristwatch motifs.
- Rebuilt the loading screen with a deep teal background and high-contrast gold/white details.
- Service worker cache updated to mouris-v20 and pre-caches all local font and watch graphic assets.


نسخه v21: هویت رنگی یکدست سبز تیره و سفید با طلایی بسیار محدود؛ تیترها سبز تیره، پیام خوشامد ضخیم‌تر، فونت Cinzel SemiBold برای نوشته انگلیسی لودینگ. فونت Cinzel از Google Fonts بارگذاری می‌شود و برای نمایش آن اتصال اینترنت لازم است.


نسخه ۲۳: لودینگ به صفحه ساعت مکانیکی با دو چرخ‌دنده داخل قاب و عقربه‌های متحرک تبدیل شد. خطوط تزئینی پس‌زمینه حذف شدند و پس‌زمینه سفید ساده باقی ماند.

Version 24 hotfix: repaired malformed home-page preloader markup, removed duplicate orphan logo/text nodes, removed top progress/loader underline, and bumped service-worker cache to mouris-v25.
