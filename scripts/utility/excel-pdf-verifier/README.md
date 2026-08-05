# 📄 Excel–PDF Proofreading Verifier

Compares every row of an Excel file against the extracted text of a PDF (for example name tent cards) using fuzzy string similarity, and produces a color-highlighted proofreading report of matches, near-misses and mismatches.

**Difficulty:** Intermediate

## ✨ Features

- **Multi-sheet Excel support**: Reads every sheet in the workbook and tags each row with its source sheet
- **PDF text extraction**: Extracts text page-by-page with pdfplumber and normalizes it for comparison
- **Fuzzy matching**: Ranks each Excel row against every PDF page using difflib's SequenceMatcher
- **Status classification**: Marks rows as MATCH, CHECK or MISMATCH based on the similarity score
- **Excel report**: Writes a Proofreading sheet plus a per-sheet Summary
- **Color highlighting**: Highlights CHECK rows yellow and MISMATCH rows red with openpyxl

## 📋 Requirements

- Python 3.7+
- `pandas`
- `pdfplumber`
- `openpyxl`

## 🚀 Usage

```bash
pip install -r requirements.txt
python excel_pdf_verifier.py
```

Put the source Excel file and the PDF in the same folder as the script, then run it. The generated `TentCard_Proofreading_Report.xlsx` contains every row with its best-matching PDF page, similarity score and status.
