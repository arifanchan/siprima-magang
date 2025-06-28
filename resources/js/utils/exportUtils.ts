/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import dayjs from 'dayjs';

export function exportCSV({
  header,
  rows,
  filename = 'data.csv',
}: {
  header: string[];
  rows: (string | number | null | undefined)[][];
  filename?: string;
}) {
  const csv = [header, ...rows].map(r => r.map(x => '"'+(x||'')+'"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF({
  header,
  rows,
  filename = 'data.pdf',
  title,
  startY = 20,
}: {
  header: string[];
  rows: (string | number | null | undefined)[][];
  filename?: string;
  title?: string;
  startY?: number;
}) {
  import('jspdf').then(jsPDFModule => {
    import('jspdf-autotable').then((autoTableModule) => {
      const doc = new jsPDFModule.jsPDF();
      if (title) {
        doc.text(title, 14, 15);
      }
      autoTableModule.default(doc, { head: [header], body: rows, startY });
      doc.save(filename);
    });
  });
}

export function printTable({
  elementId,
  title = 'Print Data',
}: {
  elementId: string;
  title?: string;
}) {
  const printContent = document.getElementById(elementId);
  if (!printContent) return;
  const printWindow = window.open('', '', 'width=900,height=700');
  if (!printWindow) return;
  printWindow.document.write('<html><head><title>'+title+'</title>');
  printWindow.document.write('<style>body{font-family:sans-serif;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:6px;}th{background:#f3f3f3;}</style>');
  printWindow.document.write('</head><body >');
  printWindow.document.write('<h2>'+title+'</h2>');
  printWindow.document.write(printContent.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

