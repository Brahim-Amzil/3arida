First: the uncomfortable truth about jsPDF + Arabic

jsPDF has two separate problems with Arabic:

Font glyph support → solvable by embedding an Arabic font

Arabic shaping & RTL → NOT handled by jsPDF

Even if you embed Cairo / Amiri:

Arabic letters will render unshaped

Words will appear disconnected

RTL alignment will still be wrong

So the real requirement is:

Font + Arabic shaping engine + RTL layout

The Proven Working Solution (used by many Arabic apps)
✅ Stack that actually works

Keep jsPDF, but add:

Arabic font (TTF)

Cairo (modern UI)

Amiri (official / document style)

Arabic shaping library

arabic-persian-reshaper

Bidirectional text handling

bidi-js (or similar)

This combination is mandatory.

Step-by-step: The fix (real code, not theory)
1️⃣ Choose the right font (Amiri recommended)

Amiri is perfect for:

Official documents

Government / petitions

Excellent diacritics support

👉 Download:
https://github.com/aliftype/amiri

Use:

Amiri-Regular.ttf

2️⃣ Convert font to base64
base64 Amiri-Regular.ttf > amiri.txt

Then create:

// fonts/amiri.ts
export const AmiriFont = `AAEAAAARAQAABAAQR0RFRgB...`; // paste base64 here

3️⃣ Register font in jsPDF
import jsPDF from "jspdf";
import { AmiriFont } from "@/fonts/amiri";

const doc = new jsPDF();

doc.addFileToVFS("Amiri-Regular.ttf", AmiriFont);
doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
doc.setFont("Amiri");

✅ This fixes glyphs
❌ Still broken Arabic (expected)

4️⃣ Install shaping + bidi libraries
npm install arabic-persian-reshaper bidi-js

5️⃣ Shape Arabic text correctly
import reshaper from "arabic-persian-reshaper";
import bidi from "bidi-js";

function shapeArabic(text: string) {
const reshaped = reshaper.reshape(text);
return bidi.from_string(reshaped).getDisplayString();
}

This does:

Arabic letter shaping

Correct ligatures

RTL reordering

6️⃣ Render RTL text in jsPDF

jsPDF still doesn’t “understand” RTL, so you control positioning.

const pageWidth = doc.internal.pageSize.getWidth();
const marginRight = 20;

const arabicText = "تقرير رسمي لعريضة";
const shaped = shapeArabic(arabicText);

// Align right manually
doc.text(shaped, pageWidth - marginRight, 40, {
align: "right"
});

💥 Result:

Correct Arabic

Connected letters

Proper RTL layout

Handling mixed Arabic + French

You must split by language.

Example:

doc.setFont("Amiri");
doc.text(shapeArabic("عدد التوقيعات:"), pageWidth - 20, y, { align: "right" });

doc.setFont("Helvetica");
doc.text(" 12,345", pageWidth - 60, y);

Yes — it’s manual.
Yes — that’s how everyone does it.

QR codes & stats (no issue)

QR codes are fine:

doc.addImage(qrCodeDataUrl, "PNG", x, y, 30, 30);

Arabic has no impact on images.

If you want a MUCH simpler alternative (seriously consider this)
🚀 Puppeteer / Playwright → HTML → PDF

This is what I’d recommend long-term.

Why this is superior:

Native RTL

Native Arabic shaping

CSS direction: rtl

Same layout as your site

No hacks

No bidi libraries

How it works

Create a hidden /pdf/petition/[id] page

Render normal HTML (Arabic-first)

Use Puppeteer to print to PDF

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto("https://3arida.ma/pdf/petition/123", {
waitUntil: "networkidle0"
});

const pdf = await page.pdf({
format: "A4",
printBackground: true
});

This is:

Cleaner

More maintainable

Future-proof

Downside:

Slightly heavier infra

Needs Node runtime (not Edge)

Decision Recommendation (no fluff)

Given your situation:

❌ Option A: Disable feature

Bad UX. Arabic-first platform can’t ship broken PDFs.

❌ Option B: English-only

Undermines legitimacy. Authorities in Morocco expect Arabic.

✅ Option C (recommended)

Short-term (1–2 days):

Implement jsPDF + Amiri + reshaper + bidi

Ship working Arabic PDFs

Mid-term:

Migrate PDF generation to HTML → Puppeteer

Keep jsPDF only for fallback/simple exports

Reality check on time estimate

Your 10–15 hours estimate is accurate for jsPDF fix
Puppeteer approach: ~6–8 hours total

If you tell me:

Do you want jsPDF-only

Or HTML → PDF

I’ll give you:

Folder structure

Helper utilities

RTL-safe layout patterns

A ready-to-drop generatePetitionPdf() function
