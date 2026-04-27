import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Download,
  Check,
  X,
} from "lucide-react";
import api from "../api/axios";
import InvoicePdf from "../pdf/InvoicePdf";
import { generatePDF } from "../utils/generatePDF";

export default function Invoice() {
  const [masterItems, setMasterItems] = useState([]);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const emptyForm = {
    id: null,
    product: "",
    brand: "",
    hsnCode: "",
    qty: "",
    rate: "",
    amount: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [rows, setRows] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState("");
  const [draftInvoiceId, setDraftInvoiceId] = useState(null);

  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}",
  );

  const generateInvoiceNo = () => String(Date.now()).slice(-6);

  const mapInvoiceRows = (invoiceItems, availableItems) => {
    return invoiceItems.map((item, index) => {
      const matchedItem = availableItems.find(
        (masterItem) => masterItem.product === item.itemName,
      );

      return {
        id: item.itemId || `${item.itemName}-${index}`,
        product: item.itemName || "",
        brand: matchedItem?.brand || "",
        hsnCode: matchedItem?.hsnCode || "",
        qty: item.qty || "",
        rate: item.rate || "",
        amount: item.amount || "",
      };
    });
  };

  const fetchItems = async () => {
    try {
      const res = await api.get(`/items?companyId=${selectedCompany._id}`);

      const mapped = res.data.map((item) => ({
        id: item._id,
        product: item.itemName,
        brand: item.brandName,
        hsnCode: item.hsnCode,
        price: item.salePrice,
      }));

      setMasterItems(mapped);
      return mapped;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchDraftInvoice = async (availableItems = []) => {
    try {
      const res = await api.get(
        `/invoices?companyId=${selectedCompany._id}&draft=true`,
      );

      const draftInvoice = res.data?.[0];

      if (!draftInvoice) {
        setDraftInvoiceId(null);
        setInvoiceNo(generateInvoiceNo());
        setInvoiceDate(new Date().toISOString().split("T")[0]);
        setCustomerName("");
        setAddress("");
        setMobile("");
        setRows([]);
        return;
      }

      setDraftInvoiceId(draftInvoice._id);
      setInvoiceNo(draftInvoice.billNo || generateInvoiceNo());
      setInvoiceDate(
        draftInvoice.billDate || new Date().toISOString().split("T")[0],
      );
      setCustomerName(draftInvoice.customerName || "");
      setAddress(draftInvoice.address || "");
      setMobile(draftInvoice.mobile || "");
      setRows(mapInvoiceRows(draftInvoice.items || [], availableItems));
    } catch (error) {
      console.log(error);
    }
  };

  const buildInvoicePayload = (invoiceRows) => ({
    companyId: selectedCompany._id,
    billNo: invoiceNo,
    customerName,
    address,
    mobile,
    billDate: invoiceDate,
    items: invoiceRows.map((row) => ({
      itemId: row.id,
      itemName: row.product,
      qty: Number(row.qty),
      rate: Number(row.rate),
      amount: Number(row.amount),
    })),
    subtotal: invoiceRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0,
    ),
    grandTotal: invoiceRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0,
    ),
  });

  const persistDraftInvoice = async (invoiceRows) => {
    if (!selectedCompany?._id) return;

    if (!invoiceRows.length) {
      if (draftInvoiceId) {
        try {
          await api.delete(`/invoices/${draftInvoiceId}`);
        } catch (error) {
          console.log(error);
        }
      }

      setDraftInvoiceId(null);
      return;
    }

    const payload = {
      ...buildInvoicePayload(invoiceRows),
      isDraft: true,
    };

    try {
      if (draftInvoiceId) {
        await api.put(`/invoices/${draftInvoiceId}`, payload);
      } else {
        const res = await api.post("/invoices", payload);
        setDraftInvoiceId(res.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedCompany?._id) {
      setInvoiceNo(generateInvoiceNo());
      return;
    }

    const loadInvoicePage = async () => {
      const availableItems = await fetchItems();
      await fetchDraftInvoice(availableItems);
    };

    loadInvoicePage();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const productOptions = useMemo(() => {
    return masterItems.map((item) => item.product);
  }, [masterItems]);

  const handleProduct = (value) => {
    const selected = masterItems.find((item) => item.product === value);

    if (!selected) return;

    const qty = form.qty || "";
    const rate = selected.price || "";

    setForm((prev) => ({
      ...prev,
      product: selected.product,
      brand: selected.brand,
      hsnCode: selected.hsnCode,
      rate,
      amount: qty ? Number(qty) * Number(rate) : "",
    }));
  };

  const handleQty = (value) => {
    const qty = value;
    const rate = form.rate || 0;

    setForm((prev) => ({
      ...prev,
      qty,
      amount: qty ? Number(qty) * Number(rate) : "",
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
  };

  const addRow = async () => {
    if (!form.product || !form.qty || !form.rate) {
      setToast("Fill item details.");
      return;
    }

    if (isEditing) {
      const updatedRows = rows.map((row) => (row.id === form.id ? form : row));
      setRows(updatedRows);
      await persistDraftInvoice(updatedRows);

      setToast("Item updated.");
      resetForm();
      return;
    }

    const existingIndex = rows.findIndex(
      (row) => row.product === form.product && row.brand === form.brand,
    );

    if (existingIndex !== -1) {
      const updated = [...rows];

      const oldQty = Number(updated[existingIndex].qty);
      const newQty = Number(form.qty);
      const finalQty = oldQty + newQty;

      updated[existingIndex].qty = finalQty;
      updated[existingIndex].amount = finalQty * Number(form.rate);

      setRows(updated);
      await persistDraftInvoice(updated);
      setToast("Existing item quantity updated.");
    } else {
      const updatedRows = [
        ...rows,
        {
          ...form,
          id: Date.now(),
        },
      ];

      setRows(updatedRows);
      await persistDraftInvoice(updatedRows);

      setToast("Item added.");
    }

    resetForm();
  };

  const editRow = (row) => {
    setForm(row);
    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteRow = async (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    await persistDraftInvoice(updatedRows);
    setToast("Item deleted.");
  };

  const totalAmount = rows.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0,
  );

  const saveInvoice = async () => {
    if (!rows.length) {
      setToast("Add items first.");
      return;
    }

    try {
      const payload = {
        ...buildInvoicePayload(rows),
        isDraft: false,
      };

      if (draftInvoiceId) {
        await api.put(`/invoices/${draftInvoiceId}`, payload);
      } else {
        await api.post("/invoices", payload);
      }

      setToast("Invoice saved successfully.");
      setDraftInvoiceId(null);
      setRows([]);
      resetForm();
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setInvoiceNo(generateInvoiceNo());
      setCustomerName("");
      setAddress("");
      setMobile("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadPdf = async () => {
    const total = rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    await generatePDF(
      InvoicePdf,
      {
        invoiceNo,
        invoiceDate,
        customerName,
        address,
        mobile,
        rows,
        total,
      },
      `invoice-${invoiceNo || "file"}.pdf`,
    );
  };

  return (
    <div className="space-y-8 relative">
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] min-w-[260px] rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl">
          <p className="text-[14px] font-semibold text-green-700">{toast}</p>
        </div>
      )}

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-7">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
            <FileText size={20} />
          </div>

          <h2 className="text-[24px] font-bold text-[#363636]">Invoice</h2>
        </div>

        <div className="grid grid-cols-2 gap-5 mt-7">
          <Input
            label="Invoice Number"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
          />

          <Input
            label="Date"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-5 mt-7">
          <Input
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <Input
            label="Phone Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-5 mt-7">
          <SelectField
            label="Product"
            value={form.product}
            onChange={(e) => handleProduct(e.target.value)}
            options={productOptions}
          />

          <Input label="Brand" value={form.brand} disabled />
          <Input label="HSN Code" value={form.hsnCode} disabled />

          <Input
            label="Quantity"
            type="number"
            value={form.qty}
            onChange={(e) => handleQty(e.target.value)}
          />

          <Input label="Rate" value={form.rate} disabled />
          <Input label="Amount" value={form.amount} disabled />
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={addRow}
            className="h-[46px] px-7 rounded-lg bg-[#16A34A] text-white font-semibold flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Check size={16} />
                Update Item
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Item
              </>
            )}
          </button>

          {isEditing && (
            <button
              onClick={resetForm}
              className="h-[46px] px-7 rounded-lg border border-[#D1D5DB] font-semibold flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </section>

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
                <th className="px-4 py-4 rounded-r-xl">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
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

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editRow(row)}
                        className="h-9 w-9 rounded-lg bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => deleteRow(row.id)}
                        className="h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!rows.length && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#6B7280]">
                    No invoice items added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-[22px] font-bold text-[#363636]">
            Total: ₹ {totalAmount.toFixed(2)}
          </div>

          <button
            onClick={async () => {
              await saveInvoice();
              await handleDownloadPdf();
            }}
            className="h-[48px] px-7 rounded-lg bg-[#1349EC] text-white font-semibold flex items-center gap-2"
          >
            <Download size={18} />
            Save & Download PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-[14px] font-medium text-[#363636]">
        {label}
      </label>

      <input
        {...props}
        className="h-[50px] w-full rounded-lg border border-[#D1D5DB] px-4 outline-none focus:border-[#1349EC] disabled:bg-gray-100"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-[14px] font-medium text-[#363636]">
        {label}
      </label>

      <select
        {...props}
        className="h-[50px] w-full rounded-lg border border-[#D1D5DB] px-4 outline-none focus:border-[#1349EC]"
      >
        <option value="">Select Product</option>

        {options.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
