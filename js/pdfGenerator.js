function generatePDFReport(report, userName, allSymptoms) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [2, 132, 199]; // Sky 600
  const darkColor = [15, 23, 42];      // Slate 900
  const lightColor = [100, 116, 139];   // Slate 500
  const borderLight = [226, 232, 240];  // Slate 200

  const setDarkText = () => doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  const setMutedText = () => doc.setTextColor(lightColor[0], lightColor[1], lightColor[2]);
  const setPrimaryColor = () => doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  const triage = calculateTriageUrgency(report.symptoms);
  let triageColor = [2, 132, 199]; // Default Sky 600
  if (triage.level === 'red') triageColor = [220, 38, 38];
  else if (triage.level === 'orange') triageColor = [217, 119, 6];
  else if (triage.level === 'yellow') triageColor = [37, 99, 235];
  else if (triage.level === 'green') triageColor = [5, 150, 105];

  // Header top bar
  doc.setFillColor(triageColor[0], triageColor[1], triageColor[2]);
  doc.rect(0, 0, pageWidth, 15, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('MEDIPREDICT AI - HEALTH ASSESSMENT REPORT', margin, 10);

  let y = 30;
  doc.setFontSize(10);
  doc.setFont('Helvetica', 'normal');
  setMutedText();
  doc.text('Report ID:', margin, y);
  setDarkText();
  doc.text(report.id, margin + 20, y);
  
  setMutedText();
  doc.text('Date generated:', pageWidth - margin - 75, y);
  setDarkText();
  doc.text(new Date(report.date).toLocaleString(), pageWidth - margin - 45, y);

  y += 6;
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 12;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setPrimaryColor();
  doc.text('PATIENT GENERAL SUMMARY', margin, y);
  
  y += 8;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  setMutedText();
  doc.text('Assessed Name:', margin, y);
  setDarkText();
  doc.text(userName, margin + 35, y);

  y += 6;
  setMutedText();
  doc.text('Status:', margin, y);
  setDarkText();
  doc.text('Completed Simulation', margin + 35, y);

  y += 6;
  setMutedText();
  doc.text('Triage Level:', margin, y);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(triageColor[0], triageColor[1], triageColor[2]);
  doc.text(`${triage.label.toUpperCase()} ADVISORY`, margin + 35, y);
  doc.setFont('Helvetica', 'normal');
  setDarkText();

  y += 12;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setPrimaryColor();
  doc.text('CHECKED SYMPTOMS', margin, y);

  y += 8;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  setDarkText();

  const symptomNames = report.symptoms
    .map(id => allSymptoms.find(s => s.id === id)?.name || id)
    .join(', ');

  const splitSymptoms = doc.splitTextToSize(symptomNames, pageWidth - (margin * 2) - 10);
  doc.text(splitSymptoms, margin + 5, y);
  y += (splitSymptoms.length * 5) + 5;

  doc.line(margin, y, pageWidth - margin, y);

  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setPrimaryColor();
  doc.text('TOP PREDICTED CONDITIONS', margin, y);

  report.predictions.forEach((pred, index) => {
    y += 10;
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    setDarkText();
    doc.text(`${index + 1}. ${pred.diseaseName}`, margin + 5, y);
    
    doc.setFont('Helvetica', 'bold');
    setPrimaryColor();
    doc.text(`${pred.confidence}% Match`, pageWidth - margin - 35, y);

    y += 3;
    doc.setFillColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.rect(margin + 5, y, 100, 3, 'F');
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin + 5, y, Math.min(pred.confidence, 100), 3, 'F');
    
    y += 8;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    setMutedText();
    const splitDesc = doc.splitTextToSize(pred.description, pageWidth - (margin * 2) - 10);
    doc.text(splitDesc, margin + 5, y);
    y += (splitDesc.length * 4.5);

    if (index === 0) {
      y += 6;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      setDarkText();
      doc.text('General Recommendations & Next Steps:', margin + 5, y);

      y += 4;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      pred.recommendations.forEach(rec => {
        y += 5;
        doc.text(`- ${rec}`, margin + 8, y);
      });
      y += 4;
    }
  });

  const disclaimerText = [
    'MEDICAL DISCLAIMER: This assessment report is generated for educational and simulation purposes only.',
    'It does not constitute professional medical advice, formal diagnosis, or direct clinical treatment plans.',
    'Always seek the advice of your physician or other qualified health provider with any questions you may have',
    'regarding a medical condition. If you think you may have a medical emergency, call your doctor or 911 immediately.'
  ];

  doc.setFillColor(254, 243, 199); // Amber 100 background
  doc.setDrawColor(251, 191, 36);   // Amber 400 border
  
  const boxHeight = 28;
  const boxY = pageHeight - margin - boxHeight;
  
  doc.rect(margin, boxY, pageWidth - (margin * 2), boxHeight, 'FD');
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // Amber 800 text
  doc.text('IMPORTANT CLINICAL NOTICE', margin + 5, boxY + 5);

  doc.setFont('Helvetica', 'normal');
  disclaimerText.slice(1).forEach((line, lineIdx) => {
    doc.text(line, margin + 5, boxY + 10 + (lineIdx * 4.5));
  });

  // Developer Watermark
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Project Developed by Vaishnav S Nair', margin, boxY - 4);

  doc.save(`MediPredict_Report_${report.id.slice(4)}.pdf`);
}
