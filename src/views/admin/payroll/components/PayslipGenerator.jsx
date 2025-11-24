import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useFetchItemsQuery } from "api/apiSlice";
import useUserSession from "hooks/useUserSession";
import logo from "assets/logo_noname.png";

export const usePayslipGenerator = () => {
  const { user } = useUserSession();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employeeToDownload, setEmployeeToDownload] = useState(null);
  const [forceGenerate, setForceGenerate] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(new Set());

  const { data: payslipData, isLoading: payslipLoading } = useFetchItemsQuery(
    {
      path: `/payroll/generate/${selectedEmployeeId}`,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !selectedEmployeeId,
    }
  );

  const addLoadingEmployee = (employeeId) => {
    setLoadingEmployees((prev) => new Set(prev).add(employeeId));
  };

  const removeLoadingEmployee = (employeeId) => {
    setLoadingEmployees((prev) => {
      const newSet = new Set(prev);
      newSet.delete(employeeId);
      return newSet;
    });
  };

  const isEmployeeLoading = (employeeId) => {
    return loadingEmployees.has(employeeId);
  };

  useEffect(() => {
    if (payslipData && selectedEmployeeId && employeeToDownload) {
      generatePayslipPDF(employeeToDownload, payslipData);
      setEmployeeToDownload(null);
      setSelectedEmployeeId(null);
      removeLoadingEmployee(selectedEmployeeId);
    }
  }, [payslipData, selectedEmployeeId, employeeToDownload]);

  const formatCurrencyValue = (value, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "AED",
    }).format(value);
  };

  const convertSalaryType = (str) => {
    return str
      ?.toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" / ");
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1] || "Invalid Month";
  };

	const generatePayslipPDF = async (employeeData, payslipData) => {
		if (!payslipData || !payslipData.doc) {
			toast.error('Payslip data not available');
			return;
		}

		const element = document.createElement('div');
		element.style.width = '210mm';
		element.style.minHeight = '297mm';
		element.style.padding = '10mm';
		element.style.backgroundColor = '#ffffff';
		element.style.color = '#000000';
		element.style.fontFamily = 'Arial, Helvetica, sans-serif';
		element.style.fontSize = '10px';
		element.style.boxSizing = 'border-box';
		element.style.position = 'absolute';
		element.style.left = '-9999px';
		element.style.lineHeight = '1.2';
		element.style.border = '1px solid #d7d7d7';
		element.style.imageRendering = 'crisp-edges';
		element.style.webkitFontSmoothing = 'antialiased';
		element.style.mozOsxFontSmoothing = 'grayscale';
		element.style.textRendering = 'optimizeLegibility';
		element.style.fontSmooth = 'always';

		const { doc, userData } = payslipData;
		const { earnings, deductions, snapshots } = doc;

		const generatedDate = doc.generatedAt
			? format(new Date(doc.generatedAt), 'dd/MM/yyyy HH:mm')
			: format(new Date(), 'dd/MM/yyyy HH:mm');

		const currentDate = format(new Date(), 'dd/MM/yyyy');
		const createdAt = doc.createdAt
			? format(new Date(doc.createdAt), 'dd/MM/yyyy HH:mm')
			: 'N/A';
		const updatedAt = doc.updatedAt
			? format(new Date(doc.updatedAt), 'dd/MM/yyyy HH:mm')
			: 'N/A';
		const totalEarnings = earnings?.totalEarnings || 0;
		const totalDeductions = snapshots?.payrollCalculation?.totalDeductions || 0;
		const netSalary = doc.netSalary || 0;

		const grossSalary = doc.grossSalary;
		const payrollCalculation = snapshots?.payrollCalculation || {};
		
		const monthNumber = doc.month || new Date().getMonth() + 1;
		const year = doc.year || new Date().getFullYear();
		const monthName = getMonthName(monthNumber);

		element.innerHTML = `
			<div style="height: 100%; padding: 5mm; position: relative;">
				<div style="position: relative; z-index: 1;">
					<div style="border-bottom: 1px solid #d7d7d7; padding: 8px 12px;">
						<div style="width:100%; text-align:center; font-weight:700; font-size:11px; margin-bottom:6px; color:#000000; -webkit-print-color-adjust: exact;">Payslip for ${monthName} ${year}</div>

						<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;margin-top: 5vh">
							<div style="display:flex; gap:10px; align-items:flex-start;">
								<div style="width:60px; height:40px; margin-top: 8px">
									<img src="${logo}" alt="Company Logo" style="width:100%; height:100%; object-fit:cover; image-rendering: crisp-edges;" onerror="this.style.display='none'" />
								</div>
								<div style="font-size:10px; color:#000000; -webkit-print-color-adjust: exact;">
									<div style="font-weight:700; font-size:12px; margin-bottom:4px;">Weeam Real Estate - ${userData?.agency?.name || 'Company'}</div>
									<div>${userData?.agency?.location || 'Address not available'}</div>
									<div>${userData?.agency?.email || 'Email not available'}</div>
									<div>${userData?.agency?.contactNumberPrimary || 'Phone not available'}</div>
									${userData?.agency?.contactNumberAlternate ? `<div>${userData.agency.contactNumberAlternate}</div>` : ''}
								</div>
							</div>

							<div style="text-align:right; font-size:9px; color:#000000; -webkit-print-color-adjust: exact;">
								<div style="font-weight:700; font-size:11px; margin-bottom: 4px;">PAYSLIP: ${doc.payslipId}</div>
								<div style="margin-bottom: 2px;">
									<span style="font-style: italic;">Generated On: </span>
									<span style="font-weight:600;">${generatedDate}</span>
								</div>
								<div style="margin-bottom: 2px;">
									<span style="font-style: italic;">Generated By: </span>
									<span style="font-weight:600;">${user?.fullName || 'System'}</span>
								</div>
								<div style="margin-bottom: 2px;">
									<span style="font-style: italic;">Email: </span>
									<span style="font-weight:600;">${user?.username || 'N/A'}</span>
								</div>
								<div style="margin-bottom: 2px;">
									<span style="font-style: italic;">Created On: </span>
									<span style="font-weight:600;">${createdAt}</span>
								</div>
								<div style="margin-bottom: 2px;">
									<span style="font-style: italic;">Last Updated: </span>
									<span style="font-weight:600;">${updatedAt}</span>
								</div>
							</div>
						</div>

						<!-- Employee Information -->
						<div style="display:flex; justify-content:space-between; margin-top:8px; padding:8px 12px; border-top:1px solid #f0f0f0;">
							<div style="font-size:10px; color:#000000; -webkit-print-color-adjust: exact;">
								<div style="font-weight:700;">Employee: ${userData?.fullName || 'N/A'}</div>
								<div>Department: ${userData?.roles?.[0]?.roleName || 'N/A'}</div>
								<div>Email: ${userData?.username}</div>
								<div>Salary Type: ${convertSalaryType(userData.salaryType)} </div>
							</div>
							<div style="font-size:10px; color:#000000; text-align:right; -webkit-print-color-adjust: exact; margin-top:5px">
								<div>Pay of ${monthName} ${year}</div>
								<div>Status: <span style="font-weight:600; text-transform:capitalize;">${doc.status}</span></div>
								<div>Currency: ${doc.currency}</div>
							</div>
						</div>
					</div>

					<!-- Earnings Section -->
					<div style="margin: 0 12px 12px 12px;">
						<table style="width:100%; border-collapse:collapse; font-size:10px; border-bottom: 1px solid #d7d7d7;">
							<thead>
								<tr>
									<th style="text-align:left; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700; -webkit-print-color-adjust: exact;">Earning</th>
									<th style="text-align:right; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700; -webkit-print-color-adjust: exact;">Amount</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Basic Salary</td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${payrollCalculation.basicSalary || earnings?.baseSalary || 0}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Commission (${payrollCalculation?.commissionPercentage || 0}%)</td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${payrollCalculation.commissionEarned || earnings?.commissionEarned || 0}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Incentive (${payrollCalculation?.incentive || 0})</td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${payrollCalculation.incentiveEarned || earnings?.incentiveEarned || 0}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Gross Salary</td>
									<td style="padding:8px 6px; text-align:right; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${grossSalary}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Deductions Section -->
					<div style="margin: 0 12px 12px 12px;">
						<table style="width:100%; border-collapse:collapse; font-size:10px; border-bottom: 1px solid #d7d7d7;">
							<thead>
								<tr>
									<th style="text-align:left; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700; -webkit-print-color-adjust: exact;">Deduction</th>
									<th style="text-align:right; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700; -webkit-print-color-adjust: exact;">Amount</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Loan </td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${deductions?.loanDeduction || 0}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Attendance </td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${doc?.payrollCalculation?.attendanceDeduction || 0}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Deductions </td>
									<td style="padding:8px 6px; text-align:right; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${totalDeductions}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Summary Section -->
					<div style="margin: 0 12px 12px 12px; padding: 12px 0;">
						<div style="display:flex; justify-content:flex-end;">
							<table style="width:250px; border:none; font-size:10px; border-collapse:collapse;">
								<tbody>
									<tr>
										<td style="font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Gross Salary:</td>
										<td style="text-align:right; font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(grossSalary, doc.currency)}</td>
									</tr>
									<tr>
										<td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Deductions:</td>
										<td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(totalDeductions, doc.currency)}</td>
									</tr>
									<tr>
										<td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Net Salary:</td>
										<td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(netSalary, doc.currency)}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Footer -->
					<div style="margin: 0 12px; padding: 12px 0; border-top:1px solid #d7d7d7; text-align:center; font-size:9px; color:#666666; -webkit-print-color-adjust: exact;">
						<div>This is a computer-generated document and does not require a signature.</div>
						<div>Created slip on ${currentDate}</div>
					</div>
				</div>
			</div>
		`;

		document.body.appendChild(element);

		try {
			const canvas = await html2canvas(element, {
				scale: 8,
				useCORS: true,
				backgroundColor: '#ffffff',
				logging: false,
				width: element.offsetWidth,
				height: element.scrollHeight,
				windowWidth: element.scrollWidth,
				windowHeight: element.scrollHeight,
				allowTaint: false,
				removeContainer: true,
				imageTimeout: 15000,
				onclone: (clonedDoc) => {
					const allElements = clonedDoc.querySelectorAll('*');
					allElements.forEach((el) => {
						el.style.imageRendering = 'crisp-edges';
						el.style.webkitFontSmoothing = 'antialiased';
						el.style.mozOsxFontSmoothing = 'grayscale';
						el.style.textRendering = 'optimizeLegibility';
					});
				},
			});

			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4',
			});

			const imgData = canvas.toDataURL('image/png', 1.0);
			const imgWidth = 210;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			pdf.addImage(
				imgData,
				'PNG',
				0,
				0,
				imgWidth,
				imgHeight,
				undefined,
				'FAST'
			);

			pdf.save(
				`payslip-${userData?.fullName || 'employee'}-${monthName}-${year}.pdf`
			);

			if (forceGenerate) {
				toast.success(
					'Payslip force generated successfully with incomplete attendance!'
				);
			} else {
				toast.success('Payslip downloaded successfully!');
			}
		} catch (error) {
			console.error('Error generating PDF:', error);
			toast.error('Failed to generate payslip');
		} finally {
			if (document.body.contains(element)) {
				document.body.removeChild(element);
			}
			setForceGenerate(false);
		}
	};

  const initiatePayslipDownload = (employee, force = false) => {
    if (!employee?._id) {
      toast.error("Employee data not available");
      return;
    }

    addLoadingEmployee(employee._id);
    setSelectedEmployeeId(employee._id);
    setEmployeeToDownload(employee);
    setForceGenerate(force);
  };

  return {
    initiatePayslipDownload,
    payslipLoading,
    forceGenerate,
    setForceGenerate,
    isEmployeeLoading,
  };
};
