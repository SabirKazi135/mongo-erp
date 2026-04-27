import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Tag,
  RefreshCcw,
} from "lucide-react";
import api from "../api/axios";

export default function ItemMaster() {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);

  const [search, setSearch] = useState("");

  const emptyForm = {
    id: null,
    brand: "",
    product: "",
    hsnCode: "",
    price: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showManageBrandModal, setShowManageBrandModal] = useState(false);

  const [brandForm, setBrandForm] = useState({
    name: "",
    hsnCode: "",
  });

  const [editingBrandIndex, setEditingBrandIndex] = useState(null);
  const [editingBrandForm, setEditingBrandForm] = useState({
    name: "",
    hsnCode: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const defaultBrands = [
    { name: "Nestle", hsnCode: "1905" },
    { name: "ITC", hsnCode: "2106" },
    { name: "Dabur", hsnCode: "3304" },
  ];

  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}",
  );

  const fetchItems = async () => {
    try {
      const res = await api.get(`/items?companyId=${selectedCompany._id}`);

      const mapped = res.data.map((item) => ({
        id: item._id,
        brand: item.brandName || "",
        product: item.itemName || "",
        hsnCode: item.hsnCode || "",
        price: item.salePrice || "",
        raw: item,
      }));

      setItems(mapped);

      setBrands((prev) => {
        const baseBrands =
          Array.isArray(prev) && prev.length > 0 ? prev : defaultBrands;

        const mergedBrands = [...baseBrands];

        mapped.forEach((item) => {
          if (!item.brand) return;

          const exists = mergedBrands.some(
            (brand) => brand.name.toLowerCase() === item.brand.toLowerCase(),
          );

          if (!exists) {
            mergedBrands.push({
              name: item.brand,
              hsnCode: item.hsnCode || "",
            });
          }
        });

        return mergedBrands;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedCompany?._id) {
      fetchItems();
    }
  }, []);

  useEffect(() => {
    const savedBrands = JSON.parse(localStorage.getItem("brands") || "[]");

    setBrands(savedBrands.length > 0 ? savedBrands : defaultBrands);
  }, []);

  useEffect(() => {
    localStorage.setItem("brands", JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    if (!successMsg) return;

    const timer = setTimeout(() => {
      setSuccessMsg("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [successMsg]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();

      return (
        item.brand.toLowerCase().includes(q) ||
        item.product.toLowerCase().includes(q) ||
        item.hsnCode.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "brand") {
      const selected = brands.find((b) => b.name === value);

      setForm((prev) => ({
        ...prev,
        brand: value,
        hsnCode: selected?.hsnCode || "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    if (!form.brand || !form.product || !form.price) return;

    try {
      if (isEditing) {
        await api.put(`/items/${form.id}`, {
          companyId: selectedCompany._id,
          itemName: form.product,
          brandName: form.brand,
          hsnCode: form.hsnCode,
          salePrice: Number(form.price),
        });

        setSuccessMsg("Item updated successfully.");
      } else {
        await api.post("/items", {
          companyId: selectedCompany._id,
          itemName: form.product,
          brandName: form.brand,
          hsnCode: form.hsnCode,
          salePrice: Number(form.price),
        });

        setSuccessMsg("Item added successfully.");
      }

      fetchItems();
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    const selected = brands.find((b) => b.name === item.brand);

    setForm({
      ...item,
      hsnCode: selected?.hsnCode || item.hsnCode,
    });

    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);

      fetchItems();
      setSuccessMsg("Item deleted successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const addBrand = () => {
    const name = brandForm.name.trim();
    const hsnCode = brandForm.hsnCode.trim();

    if (!name || !hsnCode) return;

    const exists = brands.some(
      (brand) => brand.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      setSuccessMsg("Brand already exists.");
      return;
    }

    setBrands((prev) => [...prev, { name, hsnCode }]);

    setBrandForm({
      name: "",
      hsnCode: "",
    });

    setShowBrandModal(false);
    setSuccessMsg("Brand added successfully.");
  };

  const startBrandEdit = (index) => {
    setEditingBrandIndex(index);
    setEditingBrandForm(brands[index]);
  };

  const cancelBrandEdit = () => {
    setEditingBrandIndex(null);
    setEditingBrandForm({
      name: "",
      hsnCode: "",
    });
  };

  const updateBrand = () => {
    const oldBrand = brands[editingBrandIndex];

    const updatedBrands = [...brands];
    updatedBrands[editingBrandIndex] = editingBrandForm;

    setBrands(updatedBrands);

    const updatedItems = items.map((item) => {
      if (item.brand === oldBrand.name) {
        return {
          ...item,
          brand: editingBrandForm.name,
          hsnCode: editingBrandForm.hsnCode,
        };
      }

      return item;
    });

    setItems(updatedItems);

    if (form.brand === oldBrand.name) {
      setForm((prev) => ({
        ...prev,
        brand: editingBrandForm.name,
        hsnCode: editingBrandForm.hsnCode,
      }));
    }

    cancelBrandEdit();
    setSuccessMsg("Brand updated successfully.");
  };

  return (
    <div className="space-y-8 relative">
      {successMsg && (
        <div className="fixed top-5 right-5 z-[9999] min-w-[280px] rounded-xl border border-green-200 bg-white shadow-xl px-5 py-4">
          <p className="text-[14px] font-semibold text-green-700">
            {successMsg}
          </p>
        </div>
      )}

      {/* TOP SECTION */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-7">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
              <Package size={20} />
            </div>

            <h2 className="text-[24px] font-bold text-[#363636]">
              Item Master
            </h2>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowManageBrandModal(true)}
              className="h-[46px] px-5 rounded-lg border border-[#1349EC] text-[#1349EC] text-[14px] font-semibold flex items-center gap-2 hover:bg-[#1349EC] hover:text-white transition"
            >
              <RefreshCcw size={16} />
              Update Brand / HSN
            </button>

            <button
              onClick={() => setShowBrandModal(true)}
              className="h-[46px] px-5 rounded-lg bg-[#1349EC] text-white text-[14px] font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Add Brand
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-5 mt-7">
          <SelectField
            label="Select Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            options={brands}
          />

          <Input label="HSN / SAC Code" value={form.hsnCode} disabled />

          <Input
            label="Product"
            name="product"
            value={form.product}
            onChange={handleChange}
          />

          <Input
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={handleSubmit}
            disabled={!form.brand || !form.product || !form.price}
            className="h-[46px] px-7 rounded-lg bg-[#16A34A] disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-2"
          >
            <Check size={16} />
            {isEditing ? "Update" : "Add"}
          </button>

          {isEditing && (
            <button
              onClick={resetForm}
              className="h-[46px] px-7 rounded-lg border border-[#D1D5DB] text-[#363636] font-semibold flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </section>

      {/* TABLE */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-7">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-[20px] font-bold text-[#363636]">Items List</h3>

          <div className="relative w-full max-w-[320px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search item..."
              className="h-[44px] w-full rounded-lg border border-[#D1D5DB] pl-11 pr-4 outline-none focus:border-[#1349EC]"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="bg-[#1F2937] text-white text-left">
                <th className="px-4 py-4 rounded-l-xl">Sl No</th>
                <th className="px-4 py-4">Brand</th>
                <th className="px-4 py-4">Product</th>
                <th className="px-4 py-4">HSN Code</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4 rounded-r-xl">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                >
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4">{item.brand}</td>
                  <td className="px-4 py-4">{item.product}</td>
                  <td className="px-4 py-4">{item.hsnCode}</td>
                  <td className="px-4 py-4">₹ {item.price}</td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="h-9 w-9 rounded-lg bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-[#6B7280]">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADD BRAND MODAL */}
      {showBrandModal && (
        <BrandModal
          title="Add Brand"
          brandForm={brandForm}
          setBrandForm={setBrandForm}
          onClose={() => setShowBrandModal(false)}
          onSubmit={addBrand}
          buttonText="Add Brand"
        />
      )}

      {/* MANAGE BRAND MODAL */}
      {showManageBrandModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[700px] rounded-2xl bg-white p-7 shadow-2xl">
            <h3 className="text-[24px] font-bold text-[#363636]">
              Update Brand / HSN
            </h3>

            <div className="space-y-4 mt-6 max-h-[420px] overflow-y-auto pr-1">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#E5E7EB] p-4"
                >
                  {editingBrandIndex === index ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Brand Name"
                          value={editingBrandForm.name}
                          onChange={(e) =>
                            setEditingBrandForm({
                              ...editingBrandForm,
                              name: e.target.value,
                            })
                          }
                        />

                        <Input
                          label="HSN Code"
                          value={editingBrandForm.hsnCode}
                          onChange={(e) =>
                            setEditingBrandForm({
                              ...editingBrandForm,
                              hsnCode: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={cancelBrandEdit}
                          className="h-[42px] px-5 rounded-lg border border-[#D1D5DB] font-semibold"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={updateBrand}
                          className="h-[42px] px-5 rounded-lg bg-[#1349EC] text-white font-semibold"
                        >
                          Update
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#363636]">
                          {brand.name}
                        </p>
                        <p className="text-[14px] text-[#6B7280]">
                          HSN: {brand.hsnCode}
                        </p>
                      </div>

                      <button
                        onClick={() => startBrandEdit(index)}
                        className="h-[42px] px-5 rounded-lg border border-[#1349EC] text-[#1349EC] font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowManageBrandModal(false)}
              className="mt-6 h-[46px] px-6 rounded-lg border border-[#D1D5DB] font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BrandModal({
  title,
  brandForm,
  setBrandForm,
  onClose,
  onSubmit,
  buttonText,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-[430px] rounded-2xl bg-white p-7 shadow-2xl">
        <div className="mx-auto h-14 w-14 rounded-full bg-[#EEF2FF] text-[#1349EC] flex items-center justify-center">
          <Tag size={24} />
        </div>

        <h3 className="mt-5 text-center text-[24px] font-bold text-[#363636]">
          {title}
        </h3>

        <div className="space-y-5 mt-6">
          <Input
            label="Brand Name"
            value={brandForm.name}
            onChange={(e) =>
              setBrandForm({
                ...brandForm,
                name: e.target.value,
              })
            }
          />

          <Input
            label="HSN / SAC Code"
            value={brandForm.hsnCode}
            onChange={(e) =>
              setBrandForm({
                ...brandForm,
                hsnCode: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-7">
          <button
            onClick={onClose}
            className="h-[48px] rounded-xl border border-[#D1D5DB] font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="h-[48px] rounded-xl bg-[#1349EC] text-white font-semibold"
          >
            {buttonText}
          </button>
        </div>
      </div>
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
        <option value="">Select Brand</option>

        {options.map((item, index) => (
          <option key={index} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
