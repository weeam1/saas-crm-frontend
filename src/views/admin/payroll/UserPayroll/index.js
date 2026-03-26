import { useParams } from 'react-router-dom';
import ComissionEmployeePayrollDetails from '../CommissionUsers/ComissionEmployeePayrollDetails';
import EmployeePayrollDetails from '../components/EmployeePayrollDetails';
import useUserSession from 'hooks/useUserSession';

const UserPayroll = () => {
	const { user } = useUserSession();

	const userId = user?._id;

	if (user?.salaryType === 'COMMISSION_ONLY') {
		return (
			<ComissionEmployeePayrollDetails userId={userId} isMyPayslip={true} />
		);
	}

	// default → employee payroll
	return <EmployeePayrollDetails userId={userId} isMyPayslip={true} />;
};

export default UserPayroll;
