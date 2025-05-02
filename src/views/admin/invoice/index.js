import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BankAccounts from "../bankAccountsV2/index";
import InvoiceDevelopers from "./developers/index";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";

const InvoiceModule = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles[0]?.roleName;
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromParams = searchParams.get("tab");
  const tabsData = [
    {
      label: "Bank Accounts",
      title: "Developer Bank Details",
      description:
        "Access bank account information for developers including account names, numbers, IBANs, Swift codes, and associated bank details.",
      component: tabFromParams === 'bank accounts' && <BankAccounts />,
    },
    {
      label: "Developers",
      title: "Developer Information",
      description:
        "View essential details about developers including their names, contact emails, and city locations.",
      component: tabFromParams === 'developers' && <InvoiceDevelopers />,
    },
  ];

  const initialIndex = tabsData.findIndex(
    (tab) => tab.label.toLowerCase() === tabFromParams?.toLowerCase()
  );
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    setSearchParams({ tab: tabsData[activeTabIndex].label.toLowerCase() });
  }, [activeTabIndex]);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <>
      <TabNavigationDisplay
        tabsData={tabsData}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default InvoiceModule;
