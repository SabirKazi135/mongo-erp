import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import api from "../api/axios";

export default function SelectCompany() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------
     BACKEND INTEGRATION:
     Fetch companies on page load
  ---------------------------- */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/company");
        setCompanies(res.data);

        // If no companies -> go add company page
        if (res.data.length === 0) {
          navigate("/add-company");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  /* ---------------------------
     SEARCH FILTER
  ---------------------------- */
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company.companyName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [companies, search]);

  /* ---------------------------
     SELECT COMPANY
     Save selected company locally
  ---------------------------- */
  const handleSelectCompany = (company) => {
    localStorage.setItem("selectedCompany", JSON.stringify(company));
    localStorage.setItem("company", JSON.stringify(company));

    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] overflow-hidden">
      {/* LEFT PANEL */}
      <section className="relative flex-1 bg-[#1349EC] text-white flex items-center justify-center px-10">
        <div className="absolute top-12 left-10 flex items-center gap-5">
          <div className="h-[50px] w-[50px] rounded-md bg-white flex items-center justify-center">
            <span className="text-[#1349EC] text-xl font-bold">M</span>
          </div>

          <h1 className="text-[25px] font-bold tracking-tight">ERP</h1>
        </div>

        <div className="w-full max-w-[514px]">
          <h2 className="text-[40px] leading-[48px] font-bold">
            Manage multiple companies from one secure dashboard.
          </h2>

          <p className="mt-7 text-[20px] leading-[24px] text-white/90 font-light">
            Select an existing company to continue operations or create a new
            company workspace.
          </p>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex-1 bg-[#F6F6F8] flex items-center justify-center px-10">
        <div className="w-full max-w-[620px] rounded-xl bg-white px-10 py-10 shadow-[0_15px_45px_rgba(0,0,0,0.12)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[30px] font-bold text-[#363636]">
                Select Company
              </h3>

              <p className="mt-2 text-[16px] text-[#6B7280]">
                Choose a company to continue.
              </p>
            </div>

            <button
              onClick={() => navigate("/add-company")}
              className="h-[48px] px-5 rounded-md bg-[#1349EC] text-white text-[15px] font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Company
            </button>
          </div>

          {/* Search */}
          <div className="mt-8 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company..."
              className="h-[52px] w-full rounded-md border border-[#E5E7EB] pl-11 pr-4 outline-none focus:border-[#1349EC]"
            />
          </div>

          {/* Company List */}
          <div className="mt-6 max-h-[438px] p-2 overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company._id}
                  onClick={() => handleSelectCompany(company)}
                  className="group cursor-pointer rounded-xl border border-[#E5E7EB] p-5 hover:border-[#1349EC] hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-[18px] font-semibold text-[#363636] truncate">
                        {company.companyName}
                      </h4>

                      <p className="mt-1 text-[14px] text-[#6B7280]">
                        {company.ownerName || "Company Owner"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCompany(company);
                      }}
                      className="shrink-0 h-[42px] px-5 rounded-md border border-[#1349EC] text-[#1349EC] text-[14px] font-semibold hover:bg-[#1349EC] hover:text-white"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#D1D5DB] p-8 text-center text-[#6B7280]">
                No company found.
              </div>
            )}
          </div>

          <p className="mt-8 text-center text-[14px] text-[#5A5A5A]">
            Authorized personnel only.
          </p>
        </div>
      </section>
    </div>
  );
}
