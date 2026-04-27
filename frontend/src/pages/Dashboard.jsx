import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Building2,
  FileText,
  Boxes,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";

export default function DashboardHome() {
  const { company } = useOutletContext();
  const navigate = useNavigate();

  /* --------------------------------
     KEEP SAME UI
     ADD REAL API DATA
  -------------------------------- */
  const selectedCompany =
    company || JSON.parse(localStorage.getItem("selectedCompany") || "{}");

  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalSales: 0,
    totalQty: 0,
  });

  const [itemsCount, setItemsCount] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [invoiceOverviewRows, setInvoiceOverviewRows] = useState([]);

  /* REPLACE ONLY fetchDashboard + useEffect WITH THIS */

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const companyId = selectedCompany?._id;

      if (!companyId) return;

      const results = await Promise.allSettled([
        api.get(`/reports/summary?companyId=${companyId}`),
        api.get(`/reports/items?companyId=${companyId}`),
        api.get(`/reports/invoices?companyId=${companyId}`),
      ]);

      const summaryRes =
        results[0].status === "fulfilled"
          ? results[0].value.data
          : {
              totalInvoices: 0,
              totalSales: 0,
              totalQty: 0,
            };

      const itemsRes =
        results[1].status === "fulfilled" ? results[1].value.data : [];

      const invoiceRes =
        results[2].status === "fulfilled" ? results[2].value.data : [];

      setSummary(summaryRes);

      setItemsCount(Array.isArray(itemsRes) ? itemsRes.length : 0);

      setInvoices(Array.isArray(invoiceRes) ? invoiceRes.slice(0, 5) : []);

      const itemLookup = new Map(
        (Array.isArray(itemsRes) ? itemsRes : []).map((item) => [
          item.itemName.trim().toLowerCase(),
          item,
        ]),
      );

      /* --------------------------------
       MERGE SAME PRODUCTS
    -------------------------------- */
      const mergedMap = new Map();

      (Array.isArray(invoiceRes) ? invoiceRes : []).forEach((invoice) => {
        (invoice.items || []).forEach((row) => {
          const key = row.itemName.trim().toLowerCase();

          const matchedItem = itemLookup.get(key);

          if (mergedMap.has(key)) {
            const old = mergedMap.get(key);

            old.qty = Number(old.qty) + Number(row.qty || 0);

            old.amount = Number(old.amount) + Number(row.amount || 0);
          } else {
            mergedMap.set(key, {
              id: key,
              product: row.itemName || "",
              brand: matchedItem?.brandName || "",
              hsnCode: matchedItem?.hsnCode || "",
              qty: Number(row.qty || 0),
              rate: Number(row.rate || 0),
              amount: Number(row.amount || 0),
              billNo: invoice.billNo || "",
            });
          }
        });
      });

      const overviewRows = Array.from(mergedMap.values()).slice(0, 5);

      setInvoiceOverviewRows(overviewRows);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
// error is here
  useEffect(() => {
    if (selectedCompany?._id) {
      fetchDashboard();
    }
  }, [selectedCompany?._id]);

  /* OPTIONAL DEBUG */
  console.log("Company ID:", selectedCompany?._id);

  const stats = [
    {
      title: "Total Products",
      value: itemsCount,
    },
    {
      title: "Invoices",
      value: summary.totalInvoices,
    },
    {
      title: "Pending Amount",
      value: `₹ ${summary.totalSales}`,
    },
    {
      title: "Reports",
      value: summary.totalQty,
    },
  ];

  const actions = [
    {
      title: "Edit Company",
      desc: "Update company details",
      icon: Building2,
      path: "/app/edit-company",
    },
    {
      title: "Invoice",
      desc: "Create & manage invoices",
      icon: FileText,
      path: "/app/invoice",
    },
    {
      title: "Item Master",
      desc: "Manage products & stock",
      icon: Boxes,
      path: "/app/item-master",
    },
    {
      title: "Reports",
      desc: "View analytics & exports",
      icon: BarChart3,
      path: "/app/reports",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-[#1349EC] px-8 py-7 text-white">
        <h2 className="text-[28px] font-bold">
          Welcome, {selectedCompany?.companyName || "Your Company"}
        </h2>

        <p className="mt-2 text-white/90 text-[15px]">
          Manage billing, inventory, reports and operations from one dashboard.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-white border border-[#E5E7EB] p-5"
          >
            <p className="text-[14px] text-[#6B7280]">{item.title}</p>

            <h3 className="mt-2 text-[28px] font-bold text-[#363636]">
              {loading ? "..." : item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Invoice Overview + Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Invoice Table */}
        <div className="col-span-2 rounded-xl bg-white border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-[#363636]">
              Invoice Overview
            </h3>

            <button
              onClick={() => navigate("/app/invoice")}
              className="h-[42px] px-5 rounded-md bg-[#1349EC] text-white text-[14px] font-semibold hover:bg-blue-700 transition"
            >
              Create Invoice
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-[#1F2937] text-white text-left">
                  <th className="px-4 py-4 rounded-l-xl">Sl No</th>

                  <th className="px-4 py-4">Product</th>

                  <th className="px-4 py-4">Brand</th>

                  <th className="px-4 py-4">HSN</th>

                  <th className="px-4 py-4">Qty</th>

                  <th className="px-4 py-4">Rate</th>

                  <th className="px-4 py-4">Amount</th>

                  <th className="px-4 py-4 rounded-r-xl">Bill No</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-10 text-center text-[#6B7280]"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : invoiceOverviewRows.length ? (
                  invoiceOverviewRows.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                    >
                      <td className="px-4 py-4">{index + 1}</td>

                      <td className="px-4 py-4">{item.product}</td>

                      <td className="px-4 py-4">{item.brand}</td>

                      <td className="px-4 py-4">{item.hsnCode}</td>

                      <td className="px-4 py-4">{item.qty}</td>

                      <td className="px-4 py-4">₹ {item.rate}</td>

                      <td className="px-4 py-4 font-semibold text-[#1349EC]">
                        ₹ {item.amount}
                      </td>

                      <td className="px-4 py-4">#{item.billNo}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-10 text-center text-[#6B7280]"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white border border-[#E5E7EB] p-6">
          <h3 className="text-[20px] font-bold text-[#363636]">
            Quick Actions
          </h3>

          <div className="mt-5 space-y-4">
            {actions.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="w-full rounded-xl border border-[#E5E7EB] p-4 text-left hover:border-[#1349EC] hover:shadow-sm transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
                        <Icon size={18} />
                      </div>

                      <div>
                        <p className="text-[15px] font-semibold text-[#363636]">
                          {item.title}
                        </p>

                        <p className="text-[13px] text-[#6B7280] mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-[#1349EC] opacity-0 group-hover:opacity-100 transition"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
