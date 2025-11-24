import { useState, useEffect, useCallback } from "react";
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

  const addLoadingEmployee = useCallback((employeeId) => {
    setLoadingEmployees((prev) => new Set(prev).add(employeeId));
  }, []);

  const removeLoadingEmployee = useCallback((employeeId) => {
    setLoadingEmployees((prev) => {
      const newSet = new Set(prev);
      newSet.delete(employeeId);
      return newSet;
    });
  }, []);

  const isEmployeeLoading = useCallback(
    (employeeId) => {
      return loadingEmployees.has(employeeId);
    },
    [loadingEmployees]
  );

  useEffect(() => {
    if (payslipData && selectedEmployeeId && employeeToDownload) {
      generatePayslipPDF(employeeToDownload, payslipData);
    }
  }, [payslipData, selectedEmployeeId, employeeToDownload]);

  const formatCurrencyValue = useCallback((value, currency) => {
    if (value === null || value === undefined) return "₀0.00";

    const numericValue = Number(value) || 0;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "AED",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  }, []);

  const formatToTwoDecimals = useCallback((value) => {
    if (value === null || value === undefined) return "0.00";

    const numericValue = Number(value) || 0;
    return numericValue.toFixed(2);
  }, []);

  const convertSalaryType = useCallback((str) => {
    if (!str) return "N/A";

    return str
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" / ");
  }, []);

  const getMonthName = useCallback((monthNumber) => {
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
  }, []);

  const convertNumberToWords = useCallback((amount, currency = "AED") => {
    if (amount === 0) return "Zero";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertLessThanThousand = (num) => {
      if (num === 0) return "";

      let result = "";

      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
      }

      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + " ";
        num %= 10;
      } else if (num >= 10) {
        result += teens[num - 10] + " ";
        num = 0;
      }

      if (num > 0) {
        result += ones[num] + " ";
      }

      return result.trim();
    };

    let wholePart = Math.floor(amount);
    const decimalPart = Math.round((amount - wholePart) * 100);

    let words = "";

    if (wholePart === 0) {
      words = "Zero";
    } else {
      if (wholePart >= 1000000) {
        words +=
          convertLessThanThousand(Math.floor(wholePart / 1000000)) +
          " Million ";
        wholePart %= 1000000;
      }

      if (wholePart >= 1000) {
        words +=
          convertLessThanThousand(Math.floor(wholePart / 1000)) + " Thousand ";
        wholePart %= 1000;
      }

      if (wholePart > 0) {
        words += convertLessThanThousand(wholePart);
      }
    }

    const currencyName = currency;

    let result = words.trim() + " " + currencyName;

    return result;
  }, []);

  const generatePayslipPDF = useCallback(
    async (employeeData, payslipData) => {
      if (!payslipData || !payslipData.doc) {
        toast.error("Payslip data not available");
        removeLoadingEmployee(employeeData._id);
        setSelectedEmployeeId(null);
        setEmployeeToDownload(null);
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

      const generatedDate = doc.generatedAt
        ? format(new Date(doc.generatedAt), "dd/MM/yyyy HH:mm")
        : format(new Date(), "dd/MM/yyyy HH:mm");

      const currentDate = format(new Date(), "dd/MM/yyyy");
      const createdAt = doc.createdAt
        ? format(new Date(doc.createdAt), "dd/MM/yyyy HH:mm")
        : "N/A";
      const updatedAt = doc.updatedAt
        ? format(new Date(doc.updatedAt), "dd/MM/yyyy HH:mm")
        : "N/A";

      let totalDeductions = snapshots?.payrollCalculation?.totalDeductions || 0;
      let netSalary = doc.netSalary || 0;
      let grossSalary = doc.grossSalary || 0;
      const payrollCalculation = snapshots?.payrollCalculation || {};

      const monthNumber = doc.month || new Date().getMonth() + 1;
      const year = doc.year || new Date().getFullYear();
      const monthName = getMonthName(monthNumber);

      let basicSalary =
        payrollCalculation.basicSalary || earnings?.baseSalary || 0;
      let commissionEarned =
        payrollCalculation.commissionEarned || earnings?.commissionEarned || 0;
      let incentiveEarned =
        payrollCalculation.incentiveEarned || earnings?.incentiveEarned || 0;
      let loanDeduction = deductions?.loanDeduction || 0;
      let attendanceDeduction =
        doc?.payrollCalculation?.attendanceDeduction || 0;
      const activeLoan = snapshots?.loanSummary?.activeLoans || 0;

      basicSalary = formatToTwoDecimals(basicSalary);
      commissionEarned = formatToTwoDecimals(commissionEarned);
      incentiveEarned = formatToTwoDecimals(incentiveEarned);
      grossSalary = formatToTwoDecimals(grossSalary);
      loanDeduction = formatToTwoDecimals(loanDeduction);
      attendanceDeduction = formatToTwoDecimals(attendanceDeduction);
      totalDeductions = formatToTwoDecimals(totalDeductions);
      netSalary = formatToTwoDecimals(netSalary);

      const netSalaryInWords = convertNumberToWords(netSalary, doc.currency);

      element.innerHTML = `
      <div style="height: 100%; padding: 5mm; position: relative;">
        <div style="position: relative; z-index: 1;">
          <div style="border-bottom: 1px solid #d7d7d7; padding: 8px 0px;">
            <div style="width:100%; text-align:center; font-weight:700; font-size:11px; margin-bottom:6px; color:#000000; -webkit-print-color-adjust: exact;">Payslip for ${monthName} ${year}</div>

            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;margin-top: 5vh">
              <div style="display:flex; gap:10px; align-items:flex-start;">
                <div style="width:60px; height:40px; margin-top: 8px">
                  <img src="${logo}" alt="Company Logo" style="width:100%; height:100%; object-fit:cover; image-rendering: crisp-edges;" onerror="this.style.display='none'" />
                </div>
                <div style="font-size:10px; color:#000000; -webkit-print-color-adjust: exact;">
                  <div>${userData?.agency?.location || "Address not available"}</div>
                  <div>${userData?.agency?.email || "Email not available"}</div>
                  <div>${userData?.agency?.contactNumberPrimary || "Phone not available"}</div>
                  ${userData?.agency?.contactNumberAlternate ? `<div>${userData.agency.contactNumberAlternate}</div>` : ""}
                </div>
              </div>

              <div style="text-align:right; font-size:9px; color:#000000; -webkit-print-color-adjust: exact;">
                <div style="font-weight:700; font-size:11px; margin-bottom: 4px;">PAYSLIP: ${doc.payslipId || "N/A"}</div>
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
              </div>
            </div>

            <!-- Employee Information -->
            <div style="display:flex; justify-content:space-between; margin-top:8px; padding:8px 0px; border-top:1px solid #f0f0f0;">
              <div style="font-size:10px; color:#000000; -webkit-print-color-adjust: exact;">
                <div style="font-weight:700;">Employee: ${userData?.fullName || "N/A"}</div>
                <div>Department: ${userData?.roles?.[0]?.roleName || "N/A"}</div>
                <div>Email: ${userData?.username || "N/A"}</div>
                <div>Salary Type: ${convertSalaryType(userData?.salaryType)}</div>
              </div>
              <div style="font-size:10px; color:#000000; text-align:right; -webkit-print-color-adjust: exact; margin-top:5px">
                <div>Pay of ${monthName} ${year}</div>
                <div>Status: <span style="font-weight:600; text-transform:capitalize;">${doc.status || "unknown"}</span></div>
                <div>Currency: ${doc.currency || "AED"}</div>
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
                  <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${basicSalary}</td>
                </tr>
                <tr>
                  <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Commission (${userData?.commission}%)</td>
                  <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${commissionEarned}</td>
                </tr>
                <tr>
                  <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Incentive (${userData?.incentive})</td>
                  <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${incentiveEarned}</td>
                </tr>
                <tr>
                  <td style="padding:8px 6px; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Gross Salary</td>
                  <td style="padding:8px 6px; text-align:right; font-weight:700; border-bottom:2px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(grossSalary, doc.currency)}</td>
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
                  <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Loan (${activeLoan})</td>
                  <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${loanDeduction}</td>
                </tr>
                <tr>
                  <td style="padding:8px 6px; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">Attendance</td>
                  <td style="padding:8px 6px; text-align:right; border-bottom:1px solid #f2f2f2; color:#000000; -webkit-print-color-adjust: exact;">${attendanceDeduction}</td>
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
                    <td style="font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Gross Salary:</td>
                    <td style="text-align:right; font-weight:700; padding:6px 5px; border-top:1px solid #d7d7d7; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${grossSalary}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Deductions:</td>
                    <td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">- ${totalDeductions}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">Total Net Salary:</td>
                    <td style="text-align:right; font-weight:700; padding:6px 5px; border-bottom:1px solid #d7d7d7; color:#000000; -webkit-print-color-adjust: exact;">${formatCurrencyValue(netSalary, doc.currency)}</td>
                  </tr>
                  <!-- Salary in Words -->
                  <tr>
                    <td colspan="2" style="padding:8px 5px; border-bottom:1px solid #d7d7d7; color:#000000; font-style: italic; text-align:center; -webkit-print-color-adjust: exact;">
                      <strong>Net Salary in Words:</strong> ${netSalaryInWords}
                    </td>
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
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: element.offsetWidth,
          height: element.scrollHeight,
          removeContainer: true,
          imageTimeout: 10000,
          ignoreElements: (element) => {
            return element.tagName === "SCRIPT" || element.tagName === "STYLE";
          },
        });

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgData = canvas.toDataURL("image/png", 0.8);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

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

        const fileName = `payslip-${userData?.fullName?.replace(/\s+/g, "-") || "employee"}-${monthName}-${year}.pdf`;
        pdf.save(fileName);

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

        removeLoadingEmployee(employeeData._id);
        setSelectedEmployeeId(null);
        setEmployeeToDownload(null);
        setForceGenerate(false);
      }
    },
    [
      forceGenerate,
      getMonthName,
      formatCurrencyValue,
      convertSalaryType,
      user,
      removeLoadingEmployee,
      formatToTwoDecimals,
      convertNumberToWords,
    ]
  );

  const initiatePayslipDownload = useCallback(
    (employee, force = false) => {
      if (!employee?._id) {
        toast.error("Employee data not available");
        return;
      }

      if (loadingEmployees.has(employee._id)) {
        toast.info("Payslip generation already in progress...");
        return;
      }

      addLoadingEmployee(employee._id);
      setSelectedEmployeeId(employee._id);
      setEmployeeToDownload(employee);
      setForceGenerate(force);
    },
    [addLoadingEmployee, loadingEmployees]
  );

  return {
    initiatePayslipDownload,
    payslipLoading,
    forceGenerate,
    setForceGenerate,
    isEmployeeLoading,
  };
};
