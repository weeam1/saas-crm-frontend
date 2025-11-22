import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useFetchItemsQuery } from 'api/apiSlice';
import useUserSession from 'hooks/useUserSession';
import logo from 'assets/logo-crm.png';

export const usePayslipGenerator = () => {
	const { user } = useUserSession();
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
	const [employeeToDownload, setEmployeeToDownload] = useState(null);
	const [forceGenerate, setForceGenerate] = useState(false);

	const { data: payslipData, isLoading: payslipLoading } = useFetchItemsQuery(
		{
			path: `/payroll/generate/${selectedEmployeeId}`,
		},
		{
			refetchOnMountOrArgChange: true,
			skip: !selectedEmployeeId,
		}
	);

	useEffect(() => {
		if (payslipData && selectedEmployeeId && employeeToDownload) {
			generatePayslipPDF(employeeToDownload, payslipData);
			setEmployeeToDownload(null);
			setSelectedEmployeeId(null);
		}
	}, [payslipData, selectedEmployeeId, employeeToDownload]);

	const formatCurrencyValue = (value, currency) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency || 'AED',
		}).format(value);
	};

	const convertSalaryType = (str) => {
		return str
			?.toLowerCase()
			.split('_')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' / ');
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

		const generatedDate = doc.generatedDate
			? format(new Date(doc.generatedDate), 'dd/MM/yyyy HH:mm')
			: format(new Date(), 'dd/MM/yyyy HH:mm');

		const currentDate = format(new Date(), 'dd/MM/yyyy');
		const createdAt = doc.createdAt
			? format(new Date(doc.createdAt), 'dd/MM/yyyy HH:mm')
			: 'N/A';
		const updatedAt = doc.updatedAt
			? format(new Date(doc.updatedAt), 'dd/MM/yyyy HH:mm')
			: 'N/A';
		const totalEarnings = earnings?.totalEarnings || 0;
		const totalDeductions = deductions?.loanDeduction || 0;
		const netSalary = doc.netSalary || 0;

		const payrollCalculation = snapshots?.payrollCalculation || {};

		element.innerHTML = `
			<div style="height: 100%; padding: 5mm; position: relative;">
				<!-- Watermark -->
				<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; z-index: 0; pointer-events: none;">
					<img src="${logo}" alt="Watermark" style="width: 400px; height: 400px; object-fit: contain;" />
				</div>

				<!-- Main Content -->
				<div style="position: relative; z-index: 1;">
					<div style="border-bottom: 1px solid #d7d7d7; padding: 8px 12px;">
						<div style="width:100%; text-align:center; font-weight:700; font-size:11px; margin-bottom:6px; color:#000000; -webkit-print-color-adjust: exact;">Payslip</div>

						<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;margin-top: 5vh">
							<div style="display:flex; gap:10px; align-items:flex-start;">
								<div style="width:40px; height:40px; margin-top: 8px">
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
						<div style="display:flex; justify-content:space-between; margin-top:8px; padding:8px 0; border-top:1px solid #f0f0f0;">
							<div style="font-size:10px; color:#000000; -webkit-print-color-adjust: exact;">
								<div style="font-weight:700;">Employee: ${userData?.fullName || 'N/A'}</div>
								<div>Department: ${userData?.roles?.[0]?.roleName || 'N/A'}</div>
								<div>Email: ${userData?.username}</div>
								<div>Salary Type: ${convertSalaryType(userData.salaryType)} </div>
							</div>
							<div style="font-size:10px; color:#000000; text-align:right; -webkit-print-color-adjust: exact;">
								<div>Pay Period: ${doc.month}/${doc.year}</div>
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
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(payrollCalculation.basicSalary || earnings?.baseSalary || 0, doc.currency)}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Attendance Salary</td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(payrollCalculation.attendanceAdjustedSalary || earnings?.attendanceEarnedSalary || 0, doc.currency)}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Commission</td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(payrollCalculation.commissionEarned || earnings?.commissionEarned || 0, doc.currency)}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Incentive</td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(payrollCalculation.incentiveEarned || earnings?.incentiveEarned || 0, doc.currency)}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Earnings</td>
									<td style="padding:8px 6px; text-align:right; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(totalEarnings, doc.currency)}</td>
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
									<td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Loan Deduction</td>
									<td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(deductions?.loanDeduction || 0, doc.currency)}</td>
								</tr>
								<tr>
									<td style="padding:8px 6px; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Deductions</td>
									<td style="padding:8px 6px; text-align:right; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(totalDeductions, doc.currency)}</td>
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
										<td style="font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Gross Salary:</td>
										<td style="text-align:right; font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(totalEarnings, doc.currency)}</td>
									</tr>
									<tr>
										<td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Deductions:</td>
										<td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(totalDeductions, doc.currency)}</td>
									</tr>
									<tr>
										<td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Net Salary:</td>
										<td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(netSalary, doc.currency)}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Final Summary Section -->
					<div style="margin: 12px; padding: 12px; border: 1px solid #d7d7d7; border-radius: 4px; background-color: #f9f9f9;">
						<div style="font-weight: 700; font-size: 11px; margin-bottom: 8px; color: #000000; border-bottom: 1px solid #d7d7d7; padding-bottom: 4px; -webkit-print-color-adjust: exact;">Monthly Summary</div>
							<div style="display: flex; justify-content: space-between; font-size: 9px; gap: 20px; width: 100%;">
								<div style="display: flex; flex-direction: column; gap: 4px;">
									<div style="font-weight: 600; color: #000000; -webkit-print-color-adjust: exact;">
										Basic Salary: ${formatCurrencyValue(payrollCalculation.basicSalary || 0, doc.currency)}
									</div>
									<div style="font-weight: 600; color: #000000; -webkit-print-color-adjust: exact;">
										Attendance Adjusted: ${formatCurrencyValue(payrollCalculation.attendanceAdjustedSalary || 0, doc.currency)}
									</div>
									<div style="font-weight: 600; color: #000000; -webkit-print-color-adjust: exact;">
										Commission: ${formatCurrencyValue(payrollCalculation.commissionEarned || 0, doc.currency)}
									</div>
								</div>

								<div style="display: flex; flex-direction: column; gap: 4px; text-align: right;">
									<div style="font-weight: 600; color: #000000; -webkit-print-color-adjust: exact;">
										Incentive: ${formatCurrencyValue(payrollCalculation.incentiveEarned || 0, doc.currency)}
									</div>
									<div style="font-weight: 600; color: #000000; -webkit-print-color-adjust: exact;">
										Loan Deduction: ${formatCurrencyValue(deductions?.loanDeduction || 0, doc.currency)}
									</div>
									<div style="font-weight: 600; color: #000000; -webkit-print-color-adjust: exact;">
										Net Pay: ${formatCurrencyValue(netSalary, doc.currency)}
									</div>
								</div>
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
				scale: 4,
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
				`payslip-${userData?.fullName || 'employee'}-${doc.month}-${doc.year}.pdf`
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
			toast.error('Employee data not available');
			return;
		}

		setSelectedEmployeeId(employee._id);
		setEmployeeToDownload(employee);
		setForceGenerate(force);
	};

	return {
		initiatePayslipDownload,
		payslipLoading,
		forceGenerate,
		setForceGenerate,
	};
};