WASA KASUR — FINAL LOCAL-BILLS BUILD — 2026-10-03

PURPOSE
This build is designed for the user's single Super Admin PC workflow.
Master bill PDFs are NOT uploaded to Firebase Storage or Cloudinary.
The original PDFs remain on the same PC and are never edited.

EXCEL / CONSUMER IMPORT
1. Bulk Upload accepts one or many XLSX/XLS/CSV files in one selection.
2. File order + row order is preserved as the permanent _excelSequence.
3. Later imports continue after the highest existing Excel sequence.
4. The uploader NEVER downloads the whole wasaBulkData collection just to check duplicates.
5. Existing Consumer Nos are checked in small Firestore IN queries.
6. Duplicate rows and missing Consumer Nos go to wasaDuplicates and are not silently imported.
7. Upload progress shows uploaded rows and duplicates.
8. Re-running the same Excel files is safe for Consumer Nos already present: they are treated as duplicates.

BILL PDF WORKFLOW
1. Login as Super Admin.
2. Open Bills Management.
3. Select the original master PDF files together (Chrome/Edge desktop recommended).
4. Click Index & Verify PDFs.
5. The app scans each PDF page locally using PDF.js text extraction, with OCR fallback for unreadable pages.
6. Exact Account#/Consumer No matches are indexed locally in IndexedDB.
7. Consecutive pages carrying the same Account# are grouped as one multi-page bill.
8. Ambiguous/no-match pages go REVIEW_REQUIRED.
9. Duplicate Account# pages are excluded from the matched index and shown in Duplicates Inbox.
10. Original master PDFs are never modified.

FILTERED COMBINED BILL PDF
1. Load Consumers.
2. Apply filters (for example Area/Zone/category/search).
3. Click Bills — One Combined PDF.
4. The output follows _excelSequence, NOT PDF source order and NOT numeric Consumer No order.
5. Example Excel sequence 290, 291, 295, 292 produces bill order 290, 291, 295, 292.
6. If a bill has multiple indexed pages, all of its pages remain together before the next Consumer.
7. Missing/review-required bills are never guessed into the output.
8. The generated PDF is a new combined PDF; source master PDFs remain unchanged.

DELETION
- Individual Consumer delete
- Delete filtered Consumers
- Delete all Consumers
- Remove local bill index
- Delete original PDF from device when using Chrome/Edge file handles
- Remove duplicate bill entries from Duplicates Inbox

GITHUB
Upload/replace these files in the repository root:
- admin-panel.html
- officer-app.html
- manifest.json
- sw.js
- privacy-policy.html

firestore.rules and storage.rules are included for Firebase deployment/reference.
The master bill PDF workflow does not require Firebase Storage or Blaze.

IMPORTANT
- Use the same PC and preferably the same Chrome/Edge browser profile.
- Keep the original master PDFs in an accessible location.
- Do not delete/move the source PDFs after indexing unless you are ready to re-select them.
- The generated filtered PDF is assembled from original PDF pages; it does not edit the source files.


LARGE DATA SAFETY UPDATE — 2026-10-03
- Consumer master loading uses Firestore pagination (500 documents per request), not one 70K-document .get().
- The dashboard keeps all fetched consumers in memory only after paginated retrieval completes, preserving _excelSequence.
- Bill indexing builds its exact Consumer No master index through the same paginated loader.
- A bill Account#/Consumer No is MATCHED only when exactly one extracted candidate is present AND that normalized Consumer No exists in the consumer master.
- Unknown, ambiguous, or unreadable bill pages remain REVIEW_REQUIRED and are never silently assigned.
- Master bill PDFs stay local to this PC; Firebase Storage and Cloudinary are not used for master bill PDFs.
- The source PDF is never edited. Filtered output is a new PDF made from copied original pages.
