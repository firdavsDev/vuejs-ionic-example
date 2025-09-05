import jsPDF from 'jspdf';

class PDFService {
  async generateInspectionPDF(inspectionData) {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Header
    pdf.setFontSize(20);
    pdf.text('Vehicle Inspection Report', pageWidth / 2, y, { align: 'center' });
    y += 20;

    // Basic Info Section
    pdf.setFontSize(14);
    pdf.text('Basic Information', margin, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text(`Driver Name: ${inspectionData.driverName}`, margin, y);
    y += 8;
    pdf.text(`Truck Number: ${inspectionData.truckNumber}`, margin, y);
    y += 8;
    pdf.text(`License Plate: ${inspectionData.licensePlate}`, margin, y);
    y += 8;
    pdf.text(`Inspection Date: ${new Date(inspectionData.inspectionDate).toLocaleDateString()}`, margin, y);
    y += 20;

    // Inspection Items Section
    pdf.setFontSize(14);
    pdf.text('Inspection Results', margin, y);
    y += 10;

    if (inspectionData.inspectionItems) {
      Object.keys(inspectionData.inspectionItems).forEach(category => {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(category, margin, y);
        y += 8;
        
        pdf.setFont(undefined, 'normal');
        Object.keys(inspectionData.inspectionItems[category]).forEach(item => {
          const status = inspectionData.inspectionItems[category][item] ? '✓' : '✗';
          const statusColor = inspectionData.inspectionItems[category][item] ? 'green' : 'red';
          
          pdf.setTextColor(statusColor === 'green' ? 0 : 255, statusColor === 'green' ? 128 : 0, 0);
          pdf.text(`${status} ${this.formatItemLabel(item)}`, margin + 10, y);
          pdf.setTextColor(0, 0, 0); // Reset color
          y += 6;
        });
        y += 8;
      });
    }

    return pdf;
  }

  formatItemLabel(key) {
    // Convert camelCase to readable text
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  async downloadPDF(pdf, filename) {
    pdf.save(filename);
  }

  async viewPDF(pdf) {
    const pdfDataUri = pdf.output('datauristring');
    window.open(pdfDataUri);
  }
}

export default new PDFService();