import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        color: '#262626',
        fontFamily: 'Helvetica',
        fontSize: '12px',
        padding: '30px 50px',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    textBold: {
        fontFamily: 'Helvetica-Bold',
    },
    spaceY: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    billTo: {
        marginBottom: 5,
    },
    table: {
        width: '100%',
        borderColor: '1px solid #f3f4f6',
        margin: '20px 0',
    },
    tableHeader: {
        backgroundColor: '#e5e5e5',
    },
    td: {
        padding: 6,
        borderColor: '1px solid #f3f4f6',
    },
});

export default function Invoice() {
    const InvoicePdf = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title]}>INVOICE</Text>
                        <Text>Invoice #INV-5678 #1</Text>
                    </View>

                    <View style={styles.spaceY}>
                        <Text style={styles.textBold}>Company </Text>
                        <Text>123 Business </Text>
                        <Text>City </Text>
                    </View>
                </View>
                <View style={styles.spaceY}>
                    <Text style={[styles.textBold, styles.billTo]}>Bill To: </Text>
                    <Text>Client Name </Text>
                    <Text>Client Adresse </Text>
                    <Text>City, State </Text>
                </View>

                <Table style={styles.table}>
                    <TH style={[styles.tableHeader, styles.textBold]}>
                        <TD style={styles.td}>Description</TD>
                        <TD style={styles.td}>Quantity</TD>
                        <TD style={styles.td}>Unit Price</TD>
                        <TD style={styles.td}>Total</TD>
                    </TH>
                    <TR>
                        <TD style={styles.td}>Description Data 1</TD>
                        <TD style={styles.td}>Quantity Data 2</TD>
                        <TD style={styles.td}>Unit Price Data</TD>
                        <TD style={styles.td}>Total Data</TD>
                    </TR>
                </Table>

                <View style={styles.totals}>
                    <View style={{ minWidth: '256px' }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: '8px',
                        }}>
                            <Text style={styles.textBold}>Subtotal:</Text>
                            <Text>Subtotal Data</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.spaceY}>
                    <Text style={styles.textBold}>Tax (10%):</Text>
                    <Text>Tax Data</Text>
                </View>

                <View style={styles.spaceY}>
                    <Text style={styles.textBold}>Total:</Text>
                    <Text>Total Data</Text>
                </View>
            </Page>
        </Document>
    );
    return <div>
        <div className='w-full h-[full] my-10'>
            <PDFViewer width="100%" height="100%" >
                <InvoicePdf />
            </PDFViewer>
        </div>
        <div className="mt-6 flex justify-center">
            <PDFDownloadLink document={<InvoicePdf />} fileName="invoice.pdf">
                <button
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Imprimer
                </button>
            </PDFDownloadLink>

        </div>
    </div>
}