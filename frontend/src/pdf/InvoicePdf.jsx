import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#202020",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  logo: {
    width: 75,
    height: 75,
    borderRadius: 100,
    backgroundColor: "#D9D9D9",
  },

  titleWrap: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
  },

  infoBox: {
    width: 170,
    borderWidth: 1,
    borderColor: "#000",
  },

  infoRow: {
    flexDirection: "row",
  },

  label: {
    width: 70,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 6,
  },

  value: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 6,
  },

  sectionRow: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },

  box: {
    width: "48%",
  },

  heading: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },

  companyName: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 4,
  },

  line: {
    marginBottom: 3,
  },

  table: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#000",
  },

  trHead: {
    flexDirection: "row",
    backgroundColor: "#363636",
    color: "#fff",
    fontWeight: 700,
    paddingVertical: 8,
  },

  tr: {
    flexDirection: "row",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  c1: { width: "10%", paddingLeft: 8 },
  c2: { width: "40%" },
  c3: { width: "15%" },
  c4: { width: "15%" },
  c5: { width: "20%" },

  bottomRow: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bankBox: {
    width: "52%",
  },

  totalBox: {
    width: "38%",
    gap: 8,
  },

  totalRow: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  thanks: {
    marginTop: 70,
    textAlign: "right",
    fontSize: 22,
    fontWeight: 700,
  },
});

export default function InvoicePdf({
  invoiceNo,
  invoiceDate,
  customerName,
  address,
  mobile,
  rows = [],
  total = 0,
}) {
  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}",
  );

  const gst = 0;
  const grand = total + gst;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* top */}
        <View style={styles.topRow}>
          <View style={styles.logo} />

          <View style={styles.titleWrap}>
            <Text style={styles.title}>INVOICE</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Invoice No :</Text>
              <Text style={styles.value}>{invoiceNo}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Date :</Text>
              <Text style={styles.value}>{invoiceDate}</Text>
            </View>
          </View>
        </View>

        {/* from / bill to */}
        <View style={styles.sectionRow}>
          <View style={styles.box}>
            <Text style={styles.heading}>From :</Text>

            <Text style={styles.companyName}>
              {selectedCompany.companyName || ""}
            </Text>

            <Text style={styles.line}>
              Owner : {selectedCompany.ownerName || ""}
            </Text>

            <Text style={styles.line}>
              Address : {selectedCompany.address || ""}
            </Text>

            <Text style={styles.line}>
              Phone : {selectedCompany.phone || ""}
            </Text>

            <Text style={styles.line}>
              Email : {selectedCompany.email || ""}
            </Text>

            <Text style={styles.line}>
              GST : {selectedCompany.gstNumber || ""}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.heading}>Bill to :</Text>

            <Text style={styles.companyName}>
              {customerName || "Walk In Customer"}
            </Text>

            <Text style={styles.line}>Address : {address || "-"}</Text>

            <Text style={styles.line}>Contact Number : {mobile || "-"}</Text>
          </View>
        </View>

        {/* table */}
        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={styles.c1}>Sl No</Text>
            <Text style={styles.c2}>Item</Text>
            <Text style={styles.c3}>Qty</Text>
            <Text style={styles.c4}>Rate</Text>
            <Text style={styles.c5}>Amount</Text>
          </View>

          {rows.map((item, index) => (
            <View key={index} style={styles.tr}>
              <Text style={styles.c1}>{index + 1}</Text>
              <Text style={styles.c2}>{item.product}</Text>
              <Text style={styles.c3}>{item.qty}</Text>
              <Text style={styles.c4}>{item.rate}</Text>
              <Text style={styles.c5}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* bottom */}
        <View style={styles.bottomRow}>
          <View style={styles.bankBox}>
            <Text style={styles.heading}>Bank Account Details :</Text>

            <Text style={styles.line}>
              Bank Name : {selectedCompany.bankName || "-"}
            </Text>

            <Text style={styles.line}>
              Account Number : {selectedCompany.accountNumber || "-"}
            </Text>

            <Text style={styles.line}>
              IFSC Code : {selectedCompany.ifscCode || "-"}
            </Text>

            <Text style={styles.line}>
              Branch : {selectedCompany.branchName || "-"}
            </Text>
          </View>

          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text>Total Amount</Text>
              <Text>{Number(total).toFixed(2)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>GST(%)</Text>
              <Text>{gst.toFixed(2)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Grand Total</Text>
              <Text>{grand.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.thanks}>Thank You</Text>
      </Page>
    </Document>
  );
}
