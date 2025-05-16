import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BankAccounts from '../bankAccountsV2/index';
import InvoiceDevelopers from './developers/index';
import Projects from './../developers/projects';
import TabNavigationDisplay from '../../../components/TabNavigationDisplay/TabNavigationDisplay';

const DEFAULT_TAB = 'bank accounts';

const InvoiceModule = () => {
  // const user = JSON.parse(localStorage.getItem('user'));
  // const role = user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);

  const tabsData = [
    {
      label: 'Bank Accounts',
      param: 'bank accounts',
      title: 'Developer Bank Details',
      description: 'Access bank account information for developers including account names, numbers, IBANs, Swift codes, and associated bank details.',
      component: <BankAccounts key={tabKey} />,
    },
    {
      label: 'Developers',
      param: 'developers',
      title: 'Developer Information',
      description: 'View essential details about developers including their names, contact emails, and city locations.',
      component: <InvoiceDevelopers key={tabKey} />,
    },
    {
      label: 'Projects',
      param: 'projects',
      title: 'Projects Information',
      description: 'View essential details about projects including their names, and developer.',
      component: <Projects key={tabKey} />,
    },
  ];

  const tabFromParams = searchParams.get('tab') || DEFAULT_TAB;


  const activeTabIndex = Math.max(
    0,
    tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
  );


  useEffect(() => {
    if (!searchParams.get('tab') || !tabsData.some(tab => tab.param === searchParams.get('tab'))) {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (index) => {
    const tabParam = tabsData[index].param;
    setSearchParams({ tab: tabParam });

    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1);
    }
  };

  return (
    <TabNavigationDisplay
      tabsData={tabsData.map(tab => ({
        ...tab,
        component: tab.param === tabFromParams.toLowerCase() ? tab.component : null,
      }))}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
    />
  );
};

export default InvoiceModule;
