WASA KASUR — FINAL BUILD 5.0.0 — 2026-10-03

PURPOSE
This build is designed for the single Head Office PC workflow: one Consumer Master Excel + original bill PDFs + exact Excel-order filtered PDF output.

CRITICAL FIXES
1. Consumer Master (70,000+ rows) is stored in the browser's IndexedDB on this PC, not one Firestore document per consumer. This avoids the daily Firestore write ceiling being the bottleneck for a 70K master.
2. The active master is switched ONLY after the complete Excel has been written locally. A partial/failed Excel import cannot become the active master.
3. Excel workbook import reads ALL worksheets, in workbook/sheet/row order, and saves _excelSequence starting at 1.
4. Legacy 15,547/old wasaBulkData records are NOT used by the Admin Consumers screen or bill matcher.
5. Bill indexing uses the active LOCAL Consumer Master. Exact Consumer No matching is required. Unknown/multiple/unreadable pages go REVIEW_REQUIRED.
6. Bill indexing is resumable. Each source PDF stores processedPages and checkpoints every 10 pages. Re-running the same PDF resumes from the saved page instead of silently starting a different incomplete set.
7. Original PDF files remain on the PC and are never modified. File System Access handles are saved when Chrome/Edge provides them.
8. Filtered combined PDF follows _excelSequence exactly. A multi-page bill stays together before the next Excel row.
9. Filtered PDF creation loads each source PDF only once per download session instead of reopening the full source PDF for every consumer.
10. Service-worker cache version is bumped to v5.0.0-final.

DEPLOY
Replace the deployed admin-panel.html, sw.js, manifest.json and support files with this build. Then hard refresh (Ctrl+Shift+R). If an old PWA/service worker still shows an older build, Chrome > DevTools > Application > Service Workers > Unregister, then clear site data and reload once.

WORKFLOW
A) Bulk Upload > Consumers > select the NEW Excel/workbook > preview total rows > Build NEW Local Consumer Master. Wait for DONE and the exact saved row count.
B) Bills Management > select ALL original PDFs together > Index / Resume & Verify PDFs. If the browser stops, run the same selection again; completed source pages are skipped and indexing resumes from the saved checkpoint.
C) Consumers > filter using the exact fields/AND filters > Bills — One Combined PDF. Output order is the Excel sequence, not PDF file order.
D) Missing, duplicate or review-required bills are never guessed into the final combined PDF.

IMPORTANT
The original master PDFs are not uploaded to Firebase Storage. This is intentional for the one-PC workflow and avoids the Firebase Storage billing requirement.
