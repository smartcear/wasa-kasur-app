WASA KASUR — FINAL SEQUENCE + DELETE UPDATE

This update changes the Admin dashboard only.

1) Excel sequence is saved on every new Consumer bulk upload:
   _excelSequence = Excel row number (1,2,3,...)
   _excelImportId = unique import ID
   _excelFileName = uploaded Excel file name

2) Filtered Consumers keep the original Excel sequence.
   The combined filtered Bills PDF is generated in EXACT Excel sequence.
   The PDF is never sorted by Consumer Number or by source PDF.

3) Duplicate Consumer Numbers in a new Excel upload are not silently inserted.
   They go to Duplicates Inbox with their Excel sequence/import metadata.

4) Consumer deletion options:
   - Delete individual consumer
   - Delete Filtered Consumers (use filters/search first)
   - Delete ALL Consumers (double confirmation)

5) Bill/PDF deletion options:
   - Remove Index: removes the local bill index only; original PDF stays on device.
   - Delete PDF: removes the local index and attempts to delete the original device PDF when the browser File System Access handle supports removal.

6) Original master PDFs are not edited during indexing or filtered PDF generation.

Important:
- For exact Excel ordering, upload the Excel through Bulk Data Upload after this update so _excelSequence is saved.
- Existing consumer records that were uploaded before this update may not have _excelSequence. They will be placed after sequenced records when a filtered PDF is generated.
- The browser cannot guarantee physical file deletion for every browser/file-picker configuration. In that case the dashboard index is removed and the original local PDF remains untouched.
