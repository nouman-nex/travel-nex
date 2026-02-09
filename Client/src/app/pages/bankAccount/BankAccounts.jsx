import React, { useEffect, useState } from "react";
import { Building2, Landmark, Copy, Hash, Check, Loader2 } from "lucide-react";
import PageHeader from "../../components/pageHeader/Pageheader";
import { api } from "../../api/api";

const banks = [
  {
    bankName: "Allied Bank Limited",
    accountTitle: "CFD TRAVEL & TOUR (SMC-PRIVATE) LIMITED",
    iban: "PK43ABPA0010128360080016",
    branchCode: "0758",
    accountNo: "0010128360080016",
    logo: "https://logowik.com/content/uploads/images/abl-allied-bank-limited6331.jpg",
  },
  {
    bankName: "United Bank Limited",
    accountTitle: "CFD TRAVEL AND TOUR",
    iban: "PK07 UNIL 0109 0003 1056 6894",
    branchCode: "1020",
    accountNo: "0003 1056 6894",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/United_Bank_Limited_logo.svg",
  },
  {
    bankName: "United Bank Limited",
    accountTitle: "Muhammad Naeem",
    iban: "PK07 UNIL 0109 0002 7304 6545",
    branchCode: "1020",
    accountNo: "0002 7304 6545",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/United_Bank_Limited_logo.svg",
  },
  {
    bankName: "Askari Bank Limited",
    accountTitle: "TBD",
    iban: "TBD",
    branchCode: "TBD",
    accountNo: "TBD",
    logo: "https://crystalpng.com/wp-content/uploads/2025/09/Askari-Bank-Logo.png",
  },
];

export default function BankAccounts() {
  const [copiedIndex, setCopiedIndex] = React.useState(null);
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBankData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v2/bankAccounts");
      if (response.status == 200) {
        setBankData(response.data.data);
      } else {
        setBankData(banks);
      }
    } catch (error) {
      console.error("Failed to fetch bank data:", error);
      setBankData(banks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, []);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen font-sans">
        <PageHeader
          title={"Bank Accounts"}
          image={
            "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?fm=jpg"
          }
          breadcrumb={"Bank Accounts"}
        />
        <Loader2 className="animate-spin mx-auto my-16"></Loader2>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <PageHeader
        title={"Bank Accounts"}
        image={
          "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?fm=jpg"
        }
        breadcrumb={"Bank Accounts"}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {bankData.map((bank, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: "#1CA8CB" }}
              ></div>

              <div className="p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-5">
                    {/* Logo Container - Increased size */}
                    <div className="w-16 h-16 flex items-center justify-center p-2 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={bank.logo}
                        alt={bank.bankName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/150?text=Bank")
                        }
                      />
                    </div>

                    <div>
                      {/* Bank Name - Smaller and cleaner */}
                      <h2 className="wow fadeInUp" data-wow-delay=".2s">
                        {bank.bankName}
                      </h2>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Building2 size={12} />
                        <span className="text-[10px] font-medium uppercase tracking-wider">
                          Branch: {bank.branchCode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Landmark
                    className="text-gray-100 group-hover:text-[#1CA8CB]/20 transition-colors"
                    size={32}
                  />
                </div>

                {/* Account Details */}
                <div className="space-y-6">
                  {/* Account Title */}
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold mb-1">
                      Account Title
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {bank.accountTitle}
                    </p>
                  </div>

                  {/* IBAN Box */}
                  <div className="relative bg-gray-50 rounded-xl p-4 border border-transparent hover:border-[#1CA8CB]/30 transition-all">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                      International Bank Account Number (IBAN)
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-mono text-xs md:text-sm text-gray-600 tracking-tight truncate">
                        {bank.iban}
                      </p>
                      <button
                        onClick={() => copyToClipboard(bank.iban, index)}
                        className="ml-4 p-2 rounded-lg bg-white shadow-sm hover:bg-[#1CA8CB] hover:text-white transition-all duration-200"
                      >
                        {copiedIndex === index ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1CA8CB]/10 text-[#1CA8CB]">
                      <Hash size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Account Number
                      </p>
                      <p className="text-sm font-bold text-gray-700">
                        {bank.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <Landmark size={120} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
