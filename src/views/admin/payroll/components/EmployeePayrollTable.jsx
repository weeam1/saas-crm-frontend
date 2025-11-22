import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Box,
  Text,
  Center,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FiEye, FiDownload, FiLock, FiRefreshCw } from "react-icons/fi";
import NoData from "components/Message/NoData";
import TableLoading from "components/loading/TableLoading";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "utils/helpers";
import CustomTooltip from "components/shared/CustomTooltip";
import UserProfileCell from "./UserProfileCell";
import { formatValue } from "../formatUtils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { useFetchItemsQuery } from "api/apiSlice";
import logo from "../../../../assets/logo-crm.png";
import useUserSession from "hooks/useUserSession";
import { useModalColors } from "hooks/useModalColors";

const EmployeePayrollTable = ({ data = [], isLoading }) => {
  const { user } = useUserSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

	// Most important columns for payroll overview
	const COLUMNS = [
		{ key: 'user', label: 'Employee', width: '220px' },
		{
			key: 'payrollSummary.attendanceEarnedSalary',
			label: 'Attendance Salary',
			width: '150px',
		},
		{
			key: 'payrollSummary.commissionEarned',
			label: 'Commission',
			width: '130px',
		},
		{
			key: 'payrollSummary.incentiveEarned',
			label: 'Incentive',
			width: '120px',
		},
		{
			key: 'loanSummary.monthlyInstallment',
			label: 'Loan Deduction',
			width: '140px',
		},
		{ key: 'payrollSummary.netSalary', label: 'Net Salary', width: '140px' },
		{
			key: 'evaluationScore',
			label: 'Performance',
			width: '120px',
		},
		{ key: 'createdAt', label: 'Joining Date', width: '100px' },
		{ key: 'actions', label: 'Actions', width: '100px' },
	];

  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employeeToDownload, setEmployeeToDownload] = useState(null);
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] =
    useState(null);
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
    let timer;
    if (isLoading) {
      setDelayedLoading(true);
    } else {
      timer = setTimeout(() => {
        setDelayedLoading(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (payslipData && selectedEmployeeId && employeeToDownload) {
      generatePayslipPDF(employeeToDownload, payslipData);
      setEmployeeToDownload(null);
      setSelectedEmployeeId(null);
    }
  }, [payslipData, selectedEmployeeId, employeeToDownload]);

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const hasCompletedAttendance = (employee) => {
    const attendanceSummary = employee.attendanceSummary || {};
    return (
      attendanceSummary.totalRecords === attendanceSummary.totalWorkingDays
    );
  };

  const getAttendancePercentage = (employee) => {
    const attendanceSummary = employee.attendanceSummary || {};
    if (
      !attendanceSummary.totalWorkingDays ||
      attendanceSummary.totalWorkingDays === 0
    ) {
      return 0;
    }
    return Math.round(
      (attendanceSummary.totalRecords / attendanceSummary.totalWorkingDays) *
        100
    );
  };

  const isPayslipGenerated = (employee) => {
    return employee?.payslip?.status === "generated";
  };

  const getPayslipActionText = (employee) => {
    if (isPayslipGenerated(employee)) {
      return "Regenerate Payslip";
    }
    return "Generate Payslip";
  };

  const getTooltipText = (employee) => {
    const attendancePercentage = getAttendancePercentage(employee);

    if (!hasCompletedAttendance(employee)) {
      return `Attendance incomplete (${attendancePercentage}%). Complete attendance or force generate payslip.`;
    }

    if (isPayslipGenerated(employee)) {
      return "Regenerate payslip for this employee";
    }

    return "Generate payslip for this employee";
  };

  const showAttendanceDetails = (employee) => {
    setSelectedEmployeeForModal(employee);
    setForceGenerate(false);
    onOpen();
  };

  const handleForceGenerate = () => {
    if (!selectedEmployeeForModal?._id) {
      toast.error("Employee data not available");
      return;
    }

    try {
      setSelectedEmployeeId(selectedEmployeeForModal._id);
      setEmployeeToDownload(selectedEmployeeForModal);
      setForceGenerate(true);
      onClose();
    } catch (error) {
      console.error("Error force generating payslip:", error);
      toast.error("Failed to generate payslip");
    }
  };

  // PDF Generation function
  const generatePayslipPDF = async (employeeData, payslipData) => {
    if (!payslipData || !payslipData.doc) {
      toast.error("Payslip data not available");
      return;
    }

    const element = document.createElement("div");
    element.style.width = "210mm";
    element.style.minHeight = "297mm";
    element.style.padding = "10mm";
    element.style.backgroundColor = "#ffffff";
    element.style.color = "#000000";
    element.style.fontFamily = "Arial, Helvetica, sans-serif";
    element.style.fontSize = "10px";
    element.style.boxSizing = "border-box";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.lineHeight = "1.2";
    element.style.border = "1px solid #d7d7d7";
    element.style.imageRendering = "crisp-edges";
    element.style.webkitFontSmoothing = "antialiased";
    element.style.mozOsxFontSmoothing = "grayscale";
    element.style.textRendering = "optimizeLegibility";
    element.style.fontSmooth = "always";

    const { doc, userData } = payslipData;
    const { earnings, deductions, snapshots } = doc;

    // Format the generated date properly
    const generatedDate = doc.generatedDate
      ? format(new Date(doc.generatedDate), "dd/MM/yyyy HH:mm")
      : format(new Date(), "dd/MM/yyyy HH:mm");

    const currentDate = format(new Date(), "dd/MM/yyyy");

    const createdAt = doc.createdAt
      ? format(new Date(doc.createdAt), "dd/MM/yyyy HH:mm")
      : "N/A";

    const updatedAt = doc.updatedAt
      ? format(new Date(doc.updatedAt), "dd/MM/yyyy HH:mm")
      : "N/A";
    const totalEarnings = earnings?.totalEarnings || 0;
    const totalDeductions = deductions?.loanDeduction || 0;
    const netSalary = doc.netSalary || 0;

    // Extract data from snapshots
    const payrollCalculation = snapshots?.payrollCalculation || {};
    // const loanSummary = snapshots?.loanSummary || {};
    // const attendanceSummary = snapshots?.attendanceSummary || {};
    // const closeDeals = snapshots?.closeDeals || {};
    // const evaluation = snapshots?.evaluation?.[0] || {};

    const formatCurrencyValue = (value, currency) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "AED",
      }).format(value);
    };

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

          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;">
            <div style="display:flex; gap:10px; align-items:flex-start;">
              <div style="width:40px; height:40px; margin-top: 8px">
                <img src="${logo}" alt="Company Logo" style="width:100%; height:100%; object-fit:cover; image-rendering: crisp-edges;" onerror="this.style.display='none'" />
              </div>
              <div style="font-size:10px; color:#000000; -webkit-print-color-adjust: exact;">
                <div style="font-weight:700; font-size:12px; margin-bottom:4px;">Weam Real Estate - ${userData?.agency?.name || "Company"}</div>
                <div>${userData?.agency?.location || "Address not available"}</div>
                <div>${userData?.agency?.email || "Email not available"}</div>
                <div>${userData?.agency?.contactNumberPrimary || "Phone not available"}</div>
                ${userData?.agency?.contactNumberAlternate ? `<div>${userData.agency.contactNumberAlternate}</div>` : ""}
              </div>
            </div>

            <!-- Updated Right Top Corner Section -->
            <div style="text-align:right; font-size:9px; color:#000000; -webkit-print-color-adjust: exact;">
              <div style="font-weight:700; font-size:11px; margin-bottom: 4px;">PAYSLIP: ${doc.payslipId}</div>
              <div style="margin-bottom: 2px;">
                <span style="font-style: italic;">Generated On: </span>
                <span style="font-weight:600;">${generatedDate}</span>
              </div>
              <div style="margin-bottom: 2px;">
                <span style="font-style: italic;">Generated By: </span>
                <span style="font-weight:600;">${user?.fullName || "System"}</span>
              </div>
              <div style="margin-bottom: 2px;">
                <span style="font-style: italic;">Email: </span>
                <span style="font-weight:600;">${user?.username || "N/A"}</span>
              </div>
               <div style="margin-bottom: 2px;">
                <span style="font-style: italic;">Created On: </span>
                <span style="font-weight:600;">${createdAt}</span>
              </div>
              <div style="margin-bottom: 2px;">
                <span style="font-style: italic;">Last Updated: </span>
                <span style="font-weight:600;">${updatedAt}</span>
              </div>
              <div style="margin-top:4px;">Date: <span style="font-weight:600;">${currentDate}</span></div>
            </div>
          </div>

          <!-- Employee Information -->
          <div style="display:flex; justify-content:space-between; margin-top:8px; padding:8px 0; border-top:1px solid #f0f0f0;">
            <div style="font-size:10px; color:#000000; -webkit-print-color-adjust: exact;">
              <div style="font-weight:700;">Employee: ${userData?.fullName || "N/A"}</div>
              <div>Department: ${userData?.roles?.[0]?.roleName || "N/A"}</div>
              <div>Email: ${userData?.username}</div>
              <div>Salary Type: ${convert(userData.salaryType)} </div>
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
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.offsetWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        allowTaint: false,
        removeContainer: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            el.style.imageRendering = "crisp-edges";
            el.style.webkitFontSmoothing = "antialiased";
            el.style.mozOsxFontSmoothing = "grayscale";
            el.style.textRendering = "optimizeLegibility";
          });
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      const pdfOutput = pdf.output("blob");

      pdf.save(
        `payslip-${userData?.fullName || "employee"}-${doc.month}-${doc.year}.pdf`
      );

      if (forceGenerate) {
        toast.success(
          "Payslip force generated successfully with incomplete attendance!"
        );
      } else {
        toast.success("Payslip downloaded successfully!");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate payslip");
    } finally {
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
      setForceGenerate(false);
    }
  };

  const handleDownloadPayslip = (employee) => {
    if (!employee?._id) {
      toast.error("Employee data not available");
      return;
    }

    if (!hasCompletedAttendance(employee)) {
      showAttendanceDetails(employee);
      return;
    }

    try {
      setSelectedEmployeeId(employee._id);
      setEmployeeToDownload(employee);
    } catch (error) {
      console.error("Error initiating payslip download:", error);
      toast.error("Failed to download payslip");
    }
  };

  const renderCellContent = (column, row) => {
    if (column.key === "user") {
      return <UserProfileCell user={row} />;
    }

    if (column.key === "actions") {
      const isDownloading = payslipLoading && selectedEmployeeId === row._id;
      const canDownload = hasCompletedAttendance(row);
      const isGenerated = isPayslipGenerated(row);
      const attendancePercentage = getAttendancePercentage(row);

      return (
        <Flex align="center" justify="center">
          <CustomTooltip label="View Details">
            <IconButton
              aria-label="View employee details"
              icon={<FiEye />}
              size="sm"
              colorScheme="teal"
              variant="ghost"
              // onClick={() => onView(row)}
            />
          </CustomTooltip>

          {canDownload ? (
            <CustomTooltip label={getTooltipText(row)}>
              <IconButton
                aria-label={getPayslipActionText(row)}
                icon={isGenerated ? <FiRefreshCw /> : <FiDownload />}
                size="sm"
                colorScheme={isGenerated ? "orange" : "teal"}
                variant="ghost"
                onClick={() => handleDownloadPayslip(row)}
                isLoading={isDownloading}
              />
            </CustomTooltip>
          ) : (
            <CustomTooltip label={getTooltipText(row)}>
              <IconButton
                aria-label="Attendance incomplete"
                icon={<FiLock />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => showAttendanceDetails(row)}
              />
            </CustomTooltip>
          )}
        </Flex>
      );
    }

    // Handle nested keys for financial data
    if (column.key.includes(".")) {
      const value = getNestedValue(row, column.key);
      const currency = row.agency?.currency || "AED";

      if (typeof value === "number") {
        return (
          <Text fontWeight="medium" textAlign="center">
            {formatCurrency(value, currency)}
          </Text>
        );
      }
      return formatValue(column.key, value, row);
    }

    // Handle direct keys
    const value = row[column.key];
    if (typeof value === "number" && column.key !== "evaluationScore") {
      return (
        <Text fontWeight="medium" textAlign="center">
          {formatCurrency(value, row.agency?.currency || "AED")}
        </Text>
      );
    }

    return formatValue(column.key, value, row);
  };

  const convert = (str) => {
    return str
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" / ");
  };

  return (
    <>
      <Box
        my="2"
        overflowX="auto"
        overflowY="auto"
        maxH="calc(100vh - 200px)"
        borderWidth="1px"
        borderColor="gray.200"
        rounded="xl"
        boxShadow="sm"
        bg="white"
      >
        <Table variant="striped" size="sm">
          <Thead bg="brand.200" position="sticky" top={0} zIndex={1}>
            <Tr>
              {COLUMNS.map((column) => (
                <Th
                  key={column.key}
                  whiteSpace="nowrap"
                  textTransform="capitalize"
                  fontSize="md"
                  py="4"
                  textAlign={["name"].includes(column.key) ? "left" : "center"}
                  fontWeight="semibold"
                  color="gray.700"
                  minW={column.width}
                >
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isLoading || delayedLoading ? (
              <TableLoading columns={COLUMNS} length={10} py="4" />
            ) : data.length === 0 ? (
              <Tr>
                <Td colSpan={COLUMNS.length} py={10}>
                  <Center>
                    <NoData label="incoming balance" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data.map((row, index) => (
                <Tr
                  key={row._id || index}
                  _hover={{ bg: "gray.50" }}
                  bg={index % 2 === 0 ? "white" : "gray.25"}
                  transition="background-color 0.2s"
                >
                  {COLUMNS.map((column) => (
                    <Td
                      key={column.key}
                      px={3}
                      py={3}
                      fontSize="sm"
                      color="gray.700"
                      minW={column.width}
                      textAlign={column.key === "user" ? "left" : "center"}
                    >
                      {renderCellContent(column, row)}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Attendance Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent
          mx={{ base: 3, md: 8 }}
          boxShadow="0 12px 45px rgba(0,0,0,0.25)"
          borderRadius="2xl"
          bg={bg}
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          <Flex
            align="center"
            justify="space-between"
            bg={headerBg}
            color={headerText}
            px={{ base: 6, md: 8 }}
            py={4}
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <Flex align="center">
              <FiLock style={{ marginRight: "8px", color: "#E53E3E" }} />
              Attendance Incomplete - Action Required
            </Flex>
            <ModalCloseButton position="static" />
          </Flex>

          <ModalBody
            overflowY="auto"
            px={{ base: 6, md: 8 }}
            py={5}
            flex="1"
            sx={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: "gray.400",
                borderRadius: "12px",
              },
            }}
          >
            {selectedEmployeeForModal && (
              <VStack align="stretch" spacing={4}>
                <Text fontWeight="bold" fontSize="lg" color="red.600">
                  {selectedEmployeeForModal.fullName}
                </Text>

                <Box
                  p={4}
                  bg="red.50"
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderLeftColor="red.500"
                >
                  <Text color="red.700" fontWeight="medium" mb={2}>
                    ⚠️ Attendance Not Yet Completed
                  </Text>
                  <Text color="red.600" fontSize="sm">
                    Cannot generate payslip automatically until all attendance
                    records are completed for the current pay period.
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={3} color="gray.700">
                    Attendance Summary Details:
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text color="gray.600">Total Working Days:</Text>
                      <Text fontWeight="bold" color="gray.800">
                        {selectedEmployeeForModal.attendanceSummary
                          ?.totalWorkingDays || 0}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.600">Days Recorded:</Text>
                      <Text fontWeight="bold" color="gray.800">
                        {selectedEmployeeForModal.attendanceSummary
                          ?.totalRecords || 0}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.600">Missing Days:</Text>
                      <Text fontWeight="bold" color="red.600">
                        {(selectedEmployeeForModal.attendanceSummary
                          ?.totalWorkingDays || 0) -
                          (selectedEmployeeForModal.attendanceSummary
                            ?.totalRecords || 0)}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.600">Completion Status:</Text>
                      <Badge colorScheme="red" fontSize="sm" px={2} py={1}>
                        {getAttendancePercentage(selectedEmployeeForModal)}%
                        Complete
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>

                <Box
                  p={3}
                  bg="orange.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="orange.200"
                >
                  <Text
                    fontSize="sm"
                    color="orange.800"
                    fontWeight="medium"
                    mb={2}
                  >
                    📝 Important Note:
                  </Text>
                  <Text fontSize="sm" color="orange.700">
                    For accurate payroll processing, it's recommended to
                    complete all attendance records first. However, you can
                    force generate the payslip if needed. The generated payslip
                    will use currently available data and may not reflect final
                    adjustments.
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter
            bg={footerBg}
            px={{ base: 6, md: 8 }}
            py={4}
            borderTop="1px solid"
            borderColor={borderColor}
          >
            <HStack spacing={3} width="full" justify="space-between">
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={onClose}
                size="sm"
                borderRadius={"md"}
              >
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleForceGenerate}
                leftIcon={<FiRefreshCw />}
                size="sm"
                borderRadius={"md"}
              >
                {getPayslipActionText(selectedEmployeeForModal)}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmployeePayrollTable;
