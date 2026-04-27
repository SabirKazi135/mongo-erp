import { useState, useEffect } from "react";
import {
  BarChart3,
  IndianRupee,
  FileText,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../api/axios";

export default function Reports() {
  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}",
  );

  const companyId = selectedCompany?._id;

  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalSales: 0,
    totalQty: 0,
  });

  const [rows, setRows] = useState([]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [itemsRes, invoiceRes] = await Promise.all([
        api.get(`/items?companyId=${companyId}`),
        api.get(`/invoices?companyId=${companyId}&draft=false`),
      ]);

      const items = itemsRes.data || [];
      const invoices = invoiceRes.data || [];

      const itemLookup = new Map(
        items.map((item) => [item.itemName?.trim().toLowerCase(), item]),
      );

      /* -----------------------------
         MERGE SAME PRODUCTS
      ----------------------------- */
      const mergedMap = new Map();

      invoices.forEach((invoice) => {
        (invoice.items || []).forEach((row) => {
          const productKey = row.itemName?.trim().toLowerCase() || "";

          const key = `${productKey}-${row.rate}`;

          const matched = itemLookup.get(productKey);

          if (mergedMap.has(key)) {
            const old = mergedMap.get(key);

            old.qty += Number(row.qty || 0);
            old.amount += Number(row.amount || 0);
          } else {
            mergedMap.set(key, {
              id: key,
              product: row.itemName || "",
              brand: matched?.brandName || "",
              hsnCode: matched?.hsnCode || "",
              qty: Number(row.qty || 0),
              rate: Number(row.rate || 0),
              amount: Number(row.amount || 0),
            });
          }
        });
      });

      const tableRows = Array.from(mergedMap.values());

      setRows(tableRows);

      const totalInvoices = invoices.length;

      const totalSales = invoices.reduce(
        (sum, inv) => sum + Number(inv.grandTotal || 0),
        0,
      );

      const totalQty = tableRows.reduce(
        (sum, row) => sum + Number(row.qty || 0),
        0,
      );

      setSummary({
        totalInvoices,
        totalSales,
        totalQty,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchReports();
    }
  }, [companyId]);

  const editRow = (row) => {
    console.log("Edit Row:", row);
  };

  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
          <BarChart3 size={22} />
        </div>

        <div>
          <h1 className="text-[28px] font-bold text-[#363636]">Reports</h1>

          <p className="text-[14px] text-[#6B7280] mt-1">
            Business performance and invoice summary
          </p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card
          icon={<IndianRupee size={18} />}
          title="Total Sales"
          value={`₹ ${summary.totalSales}`}
        />

        <Card
          icon={<FileText size={18} />}
          title="Invoices"
          value={summary.totalInvoices}
        />

        <Card
          icon={<Package size={18} />}
          title="Items Sold"
          value={summary.totalQty}
        />
      </div>

      {/* Table */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-7">
        <h3 className="text-[20px] font-bold text-[#363636]">Invoice Items</h3>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#1F2937] text-white text-left">
                <th className="px-4 py-4 rounded-l-xl">Sl No</th>
                <th className="px-4 py-4">Product</th>
                <th className="px-4 py-4">Brand</th>
                <th className="px-4 py-4">HSN</th>
                <th className="px-4 py-4">Qty</th>
                <th className="px-4 py-4">Rate</th>
                <th className="px-4 py-4">Amount</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#6B7280]">
                    Loading...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                  >
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">{row.product}</td>
                    <td className="px-4 py-4">{row.brand}</td>
                    <td className="px-4 py-4">{row.hsnCode}</td>
                    <td className="px-4 py-4">{row.qty}</td>
                    <td className="px-4 py-4">₹ {row.rate}</td>
                    <td className="px-4 py-4">₹ {row.amount}</td>

                 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#6B7280]">
                    No invoice items added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <div className="h-10 w-10 rounded-xl bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
        {icon}
      </div>

      <p className="mt-4 text-[14px] text-[#6B7280]">{title}</p>

      <h3 className="mt-1 text-[26px] font-bold text-[#363636]">{value}</h3>
    </div>
  );
}
