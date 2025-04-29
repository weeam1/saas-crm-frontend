import BankAccounts from "../bankAccountsV2/index";
import InvoiceDevelopers from "./developers/index";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";
const InvoiceModule = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles[0]?.roleName;

  const tabsData = [
    {
      label: "Bank Accounts",
      title: "Developer Bank Details",
      description:
        "Access bank account information for developers including account names, numbers, IBANs, Swift codes, and associated bank details.",
      component: <BankAccounts />,
    },
    {
      label: "Developers",
      title: "Developer Information",
      description:
        "View essential details about developers including their names, contact emails, and city locations.",
      component: <InvoiceDevelopers />,
    },
  ];
  return (
    <>
      <TabNavigationDisplay tabsData={tabsData} />
    </>
  );
};

export default InvoiceModule;
