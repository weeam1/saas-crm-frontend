import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BankAccounts from "../bankAccountsV2/index";
import InvoiceDevelopers from "./developers/index";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";

const DEFAULT_TAB = "bank accounts";
const InvoiceModule = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles[0]?.roleName;
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromParams = searchParams.get("tab");
    const validTabs = ["bank accounts", "developers"];
    const initialIndex = validTabs.indexOf(tabFromParams);
    const [activeTabIndex, setActiveTabIndex] = useState(
      initialIndex !== -1 ? initialIndex : 0
    );
    const [tabKey, setTabKey] = useState(0);
    const tabsData = [
      {
        label: "Bank Accounts",
        title: "Developer Bank Details",
        description:
          "Access bank account information for developers including account names, numbers, IBANs, Swift codes, and associated bank details.",
        component: <BankAccounts key={tabKey} />,
      },
      {
        label: "Developers",
        title: "Developer Information",
        description:
          "View essential details about developers including their names, contact emails, and city locations.",
        component: <InvoiceDevelopers key={tabKey} />,
      },
    ];

  useEffect(() => {
    if (!searchParams.get("tab") || initialIndex === -1) {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, []);
  useEffect(() => {
    setSearchParams({ tab: tabsData[activeTabIndex].label.toLowerCase() });
  }, [activeTabIndex]);

  const handleTabChange = (index) => {
    const selectedTab = tabsData[index].label.toLowerCase();
    setSearchParams({ tab: selectedTab });

    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1); 
    } else {
      setActiveTabIndex(index);
    }
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
