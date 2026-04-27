import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowRight } from "lucide-react";
import api from "../api/axios";

export default function AddCompany() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    logo: null,
    companyName: "",
    companyType: "",
    mobileNumber: "",
    alternateNumber: "",
    email: "",
    gstNumber: "",
    address: "",
  });

  /* -----------------------------
     INPUT CHANGE
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* -----------------------------
     BACKEND INTEGRATION
     Save company to backend
  ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/company", {
        companyName: formData.companyName,
        ownerName: formData.companyType,
        phone: formData.mobileNumber,
        email: formData.email,
        gstNumber: formData.gstNumber,
        address: formData.address,
      });

      navigate("/select-company");
    } catch (error) {
      console.log(error);
      alert("Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] overflow-hidden">
      <section className="flex-1 bg-[#F6F6F8] flex items-center justify-center px-10 py-10 overflow-y-auto">
        <div className="w-full max-w-[760px] rounded-xl bg-white px-10 py-10 shadow-[0_15px_45px_rgba(0,0,0,0.12)]">
          <h2 className="text-[30px] font-bold text-center text-[#363636]">
            Company Registration
          </h2>

          {/* Logo UI only for now */}
          <div className="mt-8 flex flex-col items-center">
            <label className="cursor-pointer">
              <input
                type="file"
                name="logo"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />

              <div className="h-[130px] w-[130px] rounded-full border border-dashed border-[#1349EC] flex flex-col items-center justify-center text-[#1349EC] hover:bg-blue-50 transition">
                <Upload size={28} />
                <span className="mt-2 text-[15px] font-medium">Add Logo</span>
              </div>
            </label>

            <p className="mt-4 text-[14px] text-[#6B7280]">
              Upload company branding
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <InputField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />

              <SelectField
                label="Company Type"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                options={[
                  "Distributor",
                  "Retailer",
                  "Manufacturer",
                  "Wholesaler",
                ]}
              />

              <InputField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />

              <InputField
                label="Alternate Number"
                name="alternateNumber"
                value={formData.alternateNumber}
                onChange={handleChange}
              />

              <InputField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                label="GST Number"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-2 text-[16px] font-medium text-[#363636]">
                Registered Address
              </label>

              <textarea
                name="address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D9D9D9] px-4 py-3 outline-none resize-none focus:border-[#1349EC]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="h-[56px] px-8 rounded-md bg-[#1349EC] text-white text-[18px] font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-[#9DB4F8]"
              >
                {loading ? "Saving..." : "Continue"}
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

/* Input */
function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block mb-2 text-[16px] font-medium text-[#363636]">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="h-[52px] w-full rounded-md border border-[#D9D9D9] px-4 outline-none focus:border-[#1349EC]"
      />
    </div>
  );
}

/* Select */
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-2 text-[16px] font-medium text-[#363636]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-[52px] w-full rounded-md border border-[#D9D9D9] px-4 outline-none focus:border-[#1349EC]"
      >
        <option value="">Select type</option>

        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
