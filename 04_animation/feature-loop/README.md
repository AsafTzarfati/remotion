# FeatureLoop: "לולאת הפיצ'רים"

סרטון לולאה של 60 שניות, ‏1920×1080, ‏30fps, בלי סאונד. התסריט ב-`../../01_script/feature-loop-brief.md`.

## פקודות
```bash
npm ci --ignore-scripts     # התקנה (גרסאות נעולות, בלי סקריפטי התקנה)
npm run studio              # תצוגה מקדימה ועריכת props
npm run render              # out/feature-loop.mp4
```

## איפה לשנות מה
- **גרסה מינימלית / מלאה:** `ringOnly: true` (ברירת המחדל) מציג רק את הטבעת במרכז. `false` מחזיר את כל המסך מהתסריט.
- **כל התוכן, הצבעים והתזמונים:** `src/props.ts` (או ב-Studio).
- **שם האירוע והתאריך:** `eventName`, `eventDate`.
- **הלוגו:** `public/speckit-logo.png` (הלוגו הרשמי מהריפו github/spec-kit), דרך `logoFile`.
- **פיצ'ר רביעי:** להוסיף איבר ל-`features`; הסרטון מתארך ב-20 שניות מעצמו.
