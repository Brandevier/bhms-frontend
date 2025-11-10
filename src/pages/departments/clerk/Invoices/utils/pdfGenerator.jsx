import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import dayjs from 'dayjs';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #1890ff',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid #eeeeee',
    paddingVertical: 8,
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666666',
  },
  value: {
    fontSize: 10,
    color: '#333333',
  },
  amount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#52c41a',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginTop: 10,
    border: '1pt solid #dddddd',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: '1pt solid #eeeeee',
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
  },
});

// Invoice PDF Document Component
const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text style={styles.subtitle}>{invoice.institution?.name || 'Medical Institution'}</Text>
        <Text style={styles.subtitle}>
          {invoice.institution?.address || 'Address not specified'}
        </Text>
        <Text style={styles.subtitle}>
          Contact: {invoice.institution?.contact || 'N/A'} | Email: {invoice.institution?.email || 'N/A'}
        </Text>
      </View>

      {/* Invoice Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Information</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.value}>
              {dayjs(invoice.invoice_date).format('MMM DD, YYYY')}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>
              {dayjs(invoice.due_date).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{invoice.status?.toUpperCase()}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Visit Number:</Text>
            <Text style={styles.value}>{invoice.visit?.attendance_number || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>
              {invoice.visit?.patient?.name || 'Unknown Patient'}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Patient ID:</Text>
            <Text style={styles.value}>
              {invoice.visit?.patient?.folderNumber || 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Age/Gender:</Text>
            <Text style={styles.value}>
              {invoice.visit?.patient?.age || 'N/A'} / {invoice.visit?.patient?.gender || 'N/A'}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>
              {invoice.visit?.department?.name || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Services Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services & Charges</Text>
        
        {/* Table Header */}
        <View style={[styles.row, { backgroundColor: '#f0f0f0' }]}>
          <View style={[styles.column, { flex: 3 }]}>
            <Text style={[styles.label, { fontWeight: 'bold' }]}>Service Description</Text>
          </View>
          <View style={[styles.column, { flex: 1 }]}>
            <Text style={[styles.label, { fontWeight: 'bold' }]}>Type</Text>
          </View>
          <View style={[styles.column, { flex: 1 }]}>
            <Text style={[styles.label, { fontWeight: 'bold' }]}>Amount</Text>
          </View>
        </View>

        {/* Service Rows */}
        {invoice.service_bills?.map((service, index) => (
          <View key={service.id} style={styles.row}>
            <View style={[styles.column, { flex: 3 }]}>
              <Text style={styles.value}>{service.description || 'Service'}</Text>
              {service.quantity > 1 && (
                <Text style={[styles.label, { fontSize: 8 }]}>
                  Qty: {service.quantity} @ ${parseFloat(service.unit_price || 0).toFixed(2)} each
                </Text>
              )}
            </View>
            <View style={[styles.column, { flex: 1 }]}>
              <Text style={styles.value}>{service.service_type}</Text>
            </View>
            <View style={[styles.column, { flex: 1 }]}>
              <Text style={styles.amount}>
                ${parseFloat(service.total_amount || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        {/* No Services Message */}
        {(!invoice.service_bills || invoice.service_bills.length === 0) && (
          <View style={styles.row}>
            <View style={[styles.column, { flex: 1 }]}>
              <Text style={styles.value}>No services recorded</Text>
            </View>
          </View>
        )}
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.totalRow}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.label}>Subtotal:</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.amount}>
              ${parseFloat(invoice.subtotal || invoice.total_amount || 0).toFixed(2)}
            </Text>
          </View>
        </View>
        
        {invoice.tax_amount > 0 && (
          <View style={styles.totalRow}>
            <View style={[styles.column, { flex: 2 }]}>
              <Text style={styles.label}>Tax:</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.amount}>
                ${parseFloat(invoice.tax_amount || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {invoice.discount_amount > 0 && (
          <View style={styles.totalRow}>
            <View style={[styles.column, { flex: 2 }]}>
              <Text style={styles.label}>Discount:</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.amount, { color: '#ff4d4f' }]}>
                -${parseFloat(invoice.discount_amount || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.totalRow, { backgroundColor: '#e6f7ff' }]}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={[styles.label, { fontSize: 12, fontWeight: 'bold' }]}>TOTAL AMOUNT:</Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.amount, { fontSize: 12 }]}>
              ${parseFloat(invoice.total_amount || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.totalRow}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.label}>Amount Paid:</Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.amount, { color: '#52c41a' }]}>
              ${parseFloat(invoice.amount_paid || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.totalRow, { backgroundColor: '#fff2f0' }]}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={[styles.label, { fontSize: 12, fontWeight: 'bold', color: '#ff4d4f' }]}>
              BALANCE DUE:
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.amount, { fontSize: 12, color: '#ff4d4f' }]}>
              ${parseFloat(invoice.balance_due || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {invoice.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={[styles.value, { fontSize: 9, lineHeight: 1.5 }]}>
            {invoice.notes}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Generated on {dayjs().format('MMMM DD, YYYY [at] hh:mm A')}</Text>
        <Text>This is an computer-generated document. No signature is required.</Text>
        <Text>For inquiries, please contact: {invoice.institution?.contact || 'N/A'}</Text>
      </View>
    </Page>
  </Document>
);

// Receipt PDF Document Component
const ReceiptPDF = ({ invoice, paymentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PAYMENT RECEIPT</Text>
        <Text style={styles.subtitle}>{invoice.institution?.name || 'Medical Institution'}</Text>
        <Text style={styles.subtitle}>
          {invoice.institution?.address || 'Address not specified'}
        </Text>
      </View>

      {/* Receipt Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receipt Information</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Receipt Number:</Text>
            <Text style={styles.value}>RCP-{dayjs().format('YYYYMMDDHHmmss')}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Receipt Date:</Text>
            <Text style={styles.value}>
              {dayjs().format('MMM DD, YYYY HH:mm')}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Original Invoice Date:</Text>
            <Text style={styles.value}>
              {dayjs(invoice.invoice_date).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>
              {invoice.visit?.patient?.name || 'Unknown Patient'}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Patient ID:</Text>
            <Text style={styles.value}>
              {invoice.visit?.patient?.folderNumber || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Amount Paid:</Text>
            <Text style={[styles.amount, { fontSize: 16 }]}>
              ${parseFloat(paymentData?.amount || invoice.amount_paid || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>
              {paymentData?.method ? paymentData.method.toUpperCase() : 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Payment Reference:</Text>
            <Text style={styles.value}>
              {paymentData?.reference || 'N/A'}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>
              {paymentData?.payment_date ? 
                dayjs(paymentData.payment_date).format('MMM DD, YYYY') : 
                dayjs().format('MMM DD, YYYY')
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Invoice Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Summary</Text>
        <View style={styles.totalRow}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.label}>Original Total:</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.amount}>
              ${parseFloat(invoice.total_amount || 0).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.totalRow}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.label}>Previously Paid:</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.amount}>
              ${parseFloat((invoice.amount_paid || 0) - (paymentData?.amount || 0)).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.totalRow}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.label}>This Payment:</Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.amount, { color: '#52c41a' }]}>
              ${parseFloat(paymentData?.amount || invoice.amount_paid || 0).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={[styles.totalRow, { backgroundColor: invoice.balance_due === 0 ? '#f6ffed' : '#fff2e8' }]}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={[styles.label, { fontSize: 12, fontWeight: 'bold' }]}>
              REMAINING BALANCE:
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.amount, { 
              fontSize: 12, 
              color: invoice.balance_due === 0 ? '#52c41a' : '#fa8c16' 
            }]}>
              ${parseFloat(invoice.balance_due || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Thank You Message */}
      <View style={[styles.section, { backgroundColor: '#f6ffed', padding: 15, marginTop: 20 }]}>
        <Text style={[styles.value, { textAlign: 'center', fontSize: 12, color: '#52c41a' }]}>
          Thank you for your payment! This receipt confirms your transaction.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Generated on {dayjs().format('MMMM DD, YYYY [at] hh:mm A')}</Text>
        <Text>This receipt is valid for accounting and record-keeping purposes.</Text>
        <Text>For inquiries, please contact: {invoice.institution?.contact || 'N/A'}</Text>
      </View>
    </Page>
  </Document>
);

// Main PDF Generation Functions
export const generateInvoicePDF = async (invoice, filename = null) => {
  try {
    const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `invoice_${invoice.invoice_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return false;
  }
};

export const generateReceiptPDF = async (invoice, paymentData = null, filename = null) => {
  try {
    const blob = await pdf(<ReceiptPDF invoice={invoice} paymentData={paymentData} />).toBlob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `receipt_${invoice.invoice_number}_${dayjs().format('YYYYMMDD')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating receipt PDF:', error);
    return false;
  }
};

export const printPDF = async (invoice, type = 'invoice') => {
  try {
    const pdfDoc = type === 'receipt' ? 
      <ReceiptPDF invoice={invoice} /> : 
      <InvoicePDF invoice={invoice} />;
    
    const blob = await pdf(pdfDoc).toBlob();
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    
    // Clean up after printing
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error printing PDF:', error);
    return false;
  }
};