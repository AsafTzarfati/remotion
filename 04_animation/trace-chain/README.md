# TraceChain: "מדרישה לקוד"

סרטון Remotion באורך 40 שניות, ‏1920×1080, ‏30fps. התסריט נמצא ב-`../../01_script/brief.md`.

## פקודות
```bash
npm ci --ignore-scripts     # התקנה (גרסאות נעולות, בלי סקריפטי התקנה)
npm run studio              # תצוגה מקדימה ועריכת props בדפדפן
npm run render:sound        # out/trace-chain-sound.mp4
npm run render:silent       # out/trace-chain-silent.mp4
```

## איפה לשנות מה
- **טקסטים, קוד, צבעים ותזמונים:** `src/props.ts`. אפשר גם לערוך אותם ישירות ב-Studio.
- **סאונד:** ‏`sound: true/false` ב-props. את האפקטים אפשר ליצור מחדש עם `node scripts/make-sfx.mjs`.
- **סצנות:** `src/scenes/Scenes.tsx`. **ציר הזמן:** `src/timeline.ts`.

## בטיחות ואיכות
- כל החבילות נעולות לגרסה מדויקת שפורסמה לפני שבועיים לפחות (נבדק ב-23.10.2026).
- `npm audit`: אפס פגיעויות. `npm audit signatures`: לכל החבילות יש חתימות רישום מאומתות.
- ההתקנה רצה עם `--ignore-scripts`, כך שלא רץ שום קוד בזמן ההתקנה.
- הפונטים (Rubik, ‏JetBrains Mono, רישיון OFL) נשמרים מקומית ב-`public/fonts` עם `SHA256SUMS`, כך שהרינדור לא תלוי ברשת.
- הרינדור: פריימים ב-PNG, ‏H.264 עם CRF 14 ו-bt709, וטשטוש תנועה (motion blur) בזמן תזוזות המצלמה.
