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
} from "@chakra-ui/react";
import { FiEye, FiDownload } from "react-icons/fi";
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

const EmployeePayrollTable = ({ data = [], isLoading }) => {
  const { user } = useUserSession();

  // Most important columns for payroll overview
  const COLUMNS = [
    { key: "user", label: "Employee", width: "220px" },
    {
      key: "attendanceSummary.netSalary",
      label: "Attendance Salary",
      width: "150px",
    },
    {
      key: "payrollSummary.commissionEarned",
      label: "Commission",
      width: "130px",
    },
    {
      key: "payrollSummary.incentiveEarned",
      label: "Incentive",
      width: "120px",
    },
    {
      key: "loanSummary.monthlyInstallment",
      label: "Loan Deduction",
      width: "140px",
    },
    { key: "payrollSummary.netSalary", label: "Net Salary", width: "140px" },
    {
      key: "evaluationScore",
      label: "Performance",
      width: "120px",
    },
    { key: "createdAt", label: "Joining Date", width: "100px" },
    { key: "actions", label: "Actions", width: "100px" },
  ];

  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employeeToDownload, setEmployeeToDownload] = useState(null);

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
    }
  }, [payslipData, selectedEmployeeId, employeeToDownload]);

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
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

    const { doc, userData } = payslipData;
    const { earnings, deductions, snapshots } = doc;

    // Format the generated date properly
    const generatedDate = doc.generatedDate
      ? format(new Date(doc.generatedDate), "dd/MM/yyyy HH:mm")
      : format(new Date(), "dd/MM/yyyy HH:mm");

    const currentDate = format(new Date(), "dd/MM/yyyy");
    const dueDate = format(new Date(), "dd/MM/yyyy");

    const totalEarnings = earnings?.totalEarnings || 0;
    const totalDeductions = deductions?.loanDeduction || 0;
    const netSalary = doc.netSalary || 0;

    // Extract data from snapshots
    const payrollCalculation = snapshots?.payrollCalculation || {};
    const loanSummary = snapshots?.loanSummary || {};
    const attendanceSummary = snapshots?.attendanceSummary || {};
    const closeDeals = snapshots?.closeDeals || {};
    const evaluation = snapshots?.evaluation?.[0] || {};

    const formatCurrencyValue = (value, currency) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "AED",
      }).format(value);
    };

    element.innerHTML = `
		<div style=" height: 100%; padding: 5mm; position: relative;">
      <!-- Watermark -->
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; z-index: 0; pointer-events: none;">
        <img src="${logo}" alt="Watermark" style="width: 400px; height: 400px; object-fit: contain;" />
      </div>

      <!-- Main Content -->
      <div style="position: relative; z-index: 1;">
        <div style="border-bottom: 1px solid #d7d7d7; padding: 8px 12px;">
          <div style="width:100%; text-align:center; font-weight:700; font-size:11px; margin-bottom:6px; color:#000000;">Payslip</div>

          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;">
            <div style="display:flex; gap:10px; align-items:flex-start;">
              <div style="width:40px; height:40px; margin-top: 8px">
                <img src="${logo}" alt="Company Logo" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />
              </div>
              <div style="font-size:10px; color:#000000;">
                <div style="font-weight:700; font-size:12px; margin-bottom:4px;">Weam Real Estate - ${userData?.agency?.name || "Company"}</div>
                <div>${userData?.agency?.location || "Address not available"}</div>
                <div>${userData?.agency?.email || "Email not available"}</div>
                <div>${userData?.agency?.contactNumberPrimary || "Phone not available"}</div>
                ${userData?.agency?.contactNumberAlternate ? `<div>${userData.agency.contactNumberAlternate}</div>` : ""}
              </div>
            </div>

            <!-- Updated Right Top Corner Section -->
            <div style="text-align:right; font-size:9px; color:#000000;">
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
              <div style="margin-top:4px;">Date: <span style="font-weight:600;">${currentDate}</span></div>
            </div>
          </div>

          <!-- Employee Information -->
          <div style="display:flex; justify-content:space-between; margin-top:8px; padding:8px 0; border-top:1px solid #f0f0f0;">
            <div style="font-size:10px; color:#000000;">
              <div style="font-weight:700;">Employee: ${userData?.fullName || "N/A"}</div>
              <div>Department: ${userData?.roles?.[0]?.roleName || "N/A"}</div>
              <div>Email: ${userData?.username}</div>
              <div>Salary Type: ${convert(userData.salaryType)} </div>
            </div>
            <div style="font-size:10px; color:#000000; text-align:right;">
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
                <th style="text-align:left; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700;">Earning</th>
                <th style="text-align:right; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000;">Basic Salary</td>
                <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000;">${formatCurrencyValue(payrollCalculation.basicSalary || earnings?.baseSalary || 0, doc.currency)}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000;">Attendance Salary</td>
                <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000;">${formatCurrencyValue(payrollCalculation.attendanceAdjustedSalary || earnings?.attendanceEarnedSalary || 0, doc.currency)}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000;">Commission</td>
                <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000;">${formatCurrencyValue(payrollCalculation.commissionEarned || earnings?.commissionEarned || 0, doc.currency)}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000;">Incentive</td>
                <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000;">${formatCurrencyValue(payrollCalculation.incentiveEarned || earnings?.incentiveEarned || 0, doc.currency)}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000;">Total Earnings</td>
                <td style="padding:8px 6px; text-align:right; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000;">${formatCurrencyValue(totalEarnings, doc.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Deductions Section -->
        <div style="margin: 0 12px 12px 12px;">
          <table style="width:100%; border-collapse:collapse; font-size:10px; border-bottom: 1px solid #d7d7d7;">
            <thead>
              <tr>
                <th style="text-align:left; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700;">Deduction</th>
                <th style="text-align:right; padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000; font-weight:700;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000;>Loan Deduction</td>
                <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000;">${formatCurrencyValue(deductions?.loanDeduction || 0, doc.currency)}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border-bottom:2px solid #d7d7d7; color:#000000;">Total Deductions</td>
                <td style="padding:8px 6px; text-align:right; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000;">${formatCurrencyValue(totalDeductions, doc.currency)}</td>
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
                  <td style="font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000;">Gross Salary:</td>
                  <td style="text-align:right; font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000;">${formatCurrencyValue(totalEarnings, doc.currency)}</td>
                </tr>
                <tr>
                  <td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000;">Total Deductions:</td>
                  <td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000;">${formatCurrencyValue(totalDeductions, doc.currency)}</td>
                </tr>
                <tr>
                  <td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000;">Net Salary:</td>
                  <td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000;">${formatCurrencyValue(netSalary, doc.currency)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Final Summary Section -->
        <div style="margin: 12px; padding: 12px; border: 1px solid #d7d7d7; border-radius: 4px; background-color: #f9f9f9;">
          <div style="font-weight: 700; font-size: 11px; margin-bottom: 8px; color: #000000; border-bottom: 1px solid #d7d7d7; padding-bottom: 4px;">Monthly Summary</div>
            <div style="display: flex; justify-content: space-between; font-size: 9px; gap: 20px; width: 100%;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="font-weight: 600; color: #000000;">
                  Basic Salary: ${formatCurrencyValue(payrollCalculation.basicSalary || 0, doc.currency)}
                </div>
                <div style="font-weight: 600; color: #000000;">
                  Attendance Adjusted: ${formatCurrencyValue(payrollCalculation.attendanceAdjustedSalary || 0, doc.currency)}
                </div>
                <div style="font-weight: 600; color: #000000;">
                  Commission: ${formatCurrencyValue(payrollCalculation.commissionEarned || 0, doc.currency)}
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 4px; text-align: right;">
                <div style="font-weight: 600; color: #000000;">
                  Incentive: ${formatCurrencyValue(payrollCalculation.incentiveEarned || 0, doc.currency)}
                </div>
                <div style="font-weight: 600; color: #000000;">
                  Loan Deduction: ${formatCurrencyValue(deductions?.loanDeduction || 0, doc.currency)}
                </div>
                <div style="font-weight: 600; color: #000000;">
                  Net Pay: ${formatCurrencyValue(netSalary, doc.currency)}
                </div>
              </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="margin: 0 12px; padding: 12px 0; border-top:1px solid #d7d7d7; text-align:center; font-size:9px; color:#666666;">
          <div>This is a computer-generated document and does not require a signature.</div>
          <div>Created slip on ${currentDate}</div>
        </div>
      </div>
		</div>
	`;

    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.offsetWidth,
        height: element.scrollHeight,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      const pdfOutput = pdf.output("blob");

      pdf.save(
        `payslip-${userData?.fullName || "employee"}-${doc.month}-${doc.year}.pdf`
      );
      toast.success("Payslip downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate payslip");
    } finally {
      document.body.removeChild(element);
    }
  };
  const handleDownloadPayslip = (employee) => {
    if (!employee?._id) {
      toast.error("Employee data not available");
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
          <CustomTooltip label="Download Payslip">
            <IconButton
              aria-label="Download Payslip"
              icon={<FiDownload />}
              size="sm"
              colorScheme="teal"
              variant="ghost"
              onClick={() => handleDownloadPayslip(row)}
              isLoading={isDownloading}
            />
          </CustomTooltip>
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
  );
};

export default EmployeePayrollTable;
