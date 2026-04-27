import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Pencil,
  X,
  Check,
  Landmark,
  Plus,
  AlertTriangle,
} from "lucide-react";
import api from "../api/axios";

export default function EditCompany() {
  const [companyData, setCompanyData] = useState({});
  const [companyForm, setCompanyForm] = useState({});
  const [bankForm, setBankForm] = useState({});

  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [discardTarget, setDiscardTarget] = useState("");

  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}",
  );

  /* -----------------------------------------
     LOAD FRESH COMPANY FROM API
  ----------------------------------------- */
  const fetchCompany = async () => {
    try {
      if (!selectedCompany?._id) return;

      const res = await api.get("/company");

      const latest = res.data.find((item) => item._id === selectedCompany._id);

      if (!latest) return;

      localStorage.setItem("selectedCompany", JSON.stringify(latest));

      setCompanyData(latest);

      setCompanyForm({
        companyName: latest.companyName || "",
        ownerName: latest.ownerName || "",
        phone: latest.phone || "",
        email: latest.email || "",
        gstNumber: latest.gstNumber || "",
        address: latest.address || "",
      });

      setBankForm({
        bankName: latest.bankName || "",
        accountNumber: latest.accountNumber || "",
        ifscCode: latest.ifscCode || "",
        branchName: latest.branchName || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  /* -----------------------------------------
     MULTI TAB LIVE SYNC
  ----------------------------------------- */
  useEffect(() => {
    const syncTabs = () => {
      fetchCompany();
    };

    window.addEventListener("storage", syncTabs);

    return () => {
      window.removeEventListener("storage", syncTabs);
    };
  }, []);

  useEffect(() => {
    if (!successMsg) return;

    const timer = setTimeout(() => {
      setSuccessMsg("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [successMsg]);

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;

    setCompanyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;

    setBankForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasCompanyData = !!(
    companyData.companyName ||
    companyData.ownerName ||
    companyData.phone ||
    companyData.email ||
    companyData.gstNumber ||
    companyData.address
  );

  const hasBankData = !!(
    companyData.bankName ||
    companyData.accountNumber ||
    companyData.ifscCode ||
    companyData.branchName
  );

  const originalCompany = useMemo(
    () => ({
      companyName: companyData.companyName || "",
      ownerName: companyData.ownerName || "",
      phone: companyData.phone || "",
      email: companyData.email || "",
      gstNumber: companyData.gstNumber || "",
      address: companyData.address || "",
    }),
    [companyData],
  );

  const originalBank = useMemo(
    () => ({
      bankName: companyData.bankName || "",
      accountNumber: companyData.accountNumber || "",
      ifscCode: companyData.ifscCode || "",
      branchName: companyData.branchName || "",
    }),
    [companyData],
  );

  const companyChanged =
    JSON.stringify(companyForm) !== JSON.stringify(originalCompany);

  const bankChanged = JSON.stringify(bankForm) !== JSON.stringify(originalBank);

  /* -----------------------------------------
     UPDATE COMPANY
  ----------------------------------------- */
  const updateCompany = async () => {
    try {
      const payload = {
        ...companyData,
        ...companyForm,
      };

      const res = await api.put(`/company/${companyData._id}`, payload);

      localStorage.setItem("selectedCompany", JSON.stringify(res.data));

      setCompanyData(res.data);
      setIsEditingCompany(false);
      setSuccessMsg("Company details updated successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  /* -----------------------------------------
     UPDATE BANK
  ----------------------------------------- */
  const updateBank = async () => {
    try {
      const payload = {
        ...companyData,
        ...bankForm,
      };

      const res = await api.put(`/company/${companyData._id}`, payload);

      localStorage.setItem("selectedCompany", JSON.stringify(res.data));

      setCompanyData(res.data);
      setIsEditingBank(false);
      setSuccessMsg("Bank details updated successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const cancelCompany = () => {
    if (companyChanged) {
      setDiscardTarget("company");
      setShowDiscardModal(true);
      return;
    }

    setCompanyForm(originalCompany);
    setIsEditingCompany(false);
  };

  const cancelBank = () => {
    if (bankChanged) {
      setDiscardTarget("bank");
      setShowDiscardModal(true);
      return;
    }

    setBankForm(originalBank);
    setIsEditingBank(false);
  };

  const confirmDiscard = () => {
    if (discardTarget === "company") {
      setCompanyForm(originalCompany);
      setIsEditingCompany(false);
    }

    if (discardTarget === "bank") {
      setBankForm(originalBank);
      setIsEditingBank(false);
    }

    setShowDiscardModal(false);
    setDiscardTarget("");
  };

  return (
    <div className="space-y-8">
      {successMsg && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-[14px] font-medium text-green-700">
          {successMsg}
        </div>
      )}

      {/* COMPANY SECTION */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
              <Building2 size={20} />
            </div>

            <h2 className="text-[24px] font-bold text-[#363636]">
              Company Details
            </h2>
          </div>

          {!isEditingCompany ? (
            <button
              onClick={() => setIsEditingCompany(true)}
              className="h-[44px] px-5 rounded-lg bg-[#1349EC] text-white font-semibold flex items-center gap-2"
            >
              {hasCompanyData ? <Pencil size={16} /> : <Plus size={16} />}
              {hasCompanyData ? "Edit" : "Add"}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={cancelCompany}
                className="h-[44px] px-5 rounded-lg border border-[#D1D5DB] flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={updateCompany}
                disabled={!companyChanged}
                className="h-[44px] px-5 rounded-lg bg-[#1349EC] text-white disabled:bg-[#9DB4F8] flex items-center gap-2"
              >
                <Check size={16} />
                Update
              </button>
            </div>
          )}
        </div>

        {!isEditingCompany ? (
          <div className="grid grid-cols-2 gap-6 mt-7">
            <View label="Company Name" value={companyData.companyName} />
            <View label="Owner Name" value={companyData.ownerName} />
            <View label="Phone" value={companyData.phone} />
            <View label="Email" value={companyData.email} />
            <View label="GST Number" value={companyData.gstNumber} />
            <View label="Address" value={companyData.address} full />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 mt-7">
            <Input
              label="Company Name"
              name="companyName"
              value={companyForm.companyName}
              onChange={handleCompanyChange}
            />

            <Input
              label="Owner Name"
              name="ownerName"
              value={companyForm.ownerName}
              onChange={handleCompanyChange}
            />

            <Input
              label="Phone"
              name="phone"
              value={companyForm.phone}
              onChange={handleCompanyChange}
            />

            <Input
              label="Email"
              name="email"
              value={companyForm.email}
              onChange={handleCompanyChange}
            />

            <Input
              label="GST Number"
              name="gstNumber"
              value={companyForm.gstNumber}
              onChange={handleCompanyChange}
            />

            <div className="col-span-2">
              <TextArea
                label="Address"
                name="address"
                value={companyForm.address}
                onChange={handleCompanyChange}
              />
            </div>
          </div>
        )}
      </section>

      {/* BANK SECTION */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
              <Landmark size={20} />
            </div>

            <h2 className="text-[24px] font-bold text-[#363636]">
              Bank Details
            </h2>
          </div>

          {!isEditingBank ? (
            <button
              onClick={() => setIsEditingBank(true)}
              className="h-[44px] px-5 rounded-lg bg-[#1349EC] text-white font-semibold flex items-center gap-2"
            >
              {hasBankData ? <Pencil size={16} /> : <Plus size={16} />}
              {hasBankData ? "Edit" : "Add"}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={cancelBank}
                className="h-[44px] px-5 rounded-lg border border-[#D1D5DB] flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={updateBank}
                disabled={!bankChanged}
                className="h-[44px] px-5 rounded-lg bg-[#1349EC] text-white disabled:bg-[#9DB4F8] flex items-center gap-2"
              >
                <Check size={16} />
                Update
              </button>
            </div>
          )}
        </div>

        {!isEditingBank ? (
          <div className="grid grid-cols-2 gap-6 mt-7">
            <View label="Bank Name" value={companyData.bankName} />
            <View label="Account Number" value={companyData.accountNumber} />
            <View label="IFSC Code" value={companyData.ifscCode} />
            <View label="Branch Name" value={companyData.branchName} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 mt-7">
            <Input
              label="Bank Name"
              name="bankName"
              value={bankForm.bankName}
              onChange={handleBankChange}
            />

            <Input
              label="Account Number"
              name="accountNumber"
              value={bankForm.accountNumber}
              onChange={handleBankChange}
            />

            <Input
              label="IFSC Code"
              name="ifscCode"
              value={bankForm.ifscCode}
              onChange={handleBankChange}
            />

            <Input
              label="Branch Name"
              name="branchName"
              value={bankForm.branchName}
              onChange={handleBankChange}
            />
          </div>
        )}
      </section>

      {showDiscardModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mx-auto h-14 w-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <AlertTriangle size={26} />
            </div>

            <h3 className="mt-5 text-center text-[24px] font-bold text-[#363636]">
              Discard Changes?
            </h3>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowDiscardModal(false);
                  setDiscardTarget("");
                }}
                className="h-[48px] rounded-xl border border-[#D1D5DB]"
              >
                Keep Editing
              </button>

              <button
                onClick={confirmDiscard}
                className="h-[48px] rounded-xl bg-red-500 text-white"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function View({ label, value, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[13px] text-[#6B7280]">{label}</p>
      <p className="mt-1 text-[16px] font-medium text-[#363636]">
        {value || "-"}
      </p>
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
        className="h-[50px] w-full rounded-lg border border-[#D1D5DB] px-4 outline-none focus:border-[#1349EC]"
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-[14px] font-medium text-[#363636]">
        {label}
      </label>

      <textarea
        rows="4"
        {...props}
        className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 outline-none resize-none focus:border-[#1349EC]"
      />
    </div>
  );
}
// sabir
