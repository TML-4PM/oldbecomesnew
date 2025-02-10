// functions/api.js
const nodemailer = require("nodemailer");
const { writeFileSync, appendFileSync, existsSync } = require("fs");
const path = require("path");

// Dummy PDF generation function – replace with an actual PDF library as needed.
function generatePDF(quote) {
  return Buffer.from(`Quote PDF\n\n${JSON.stringify(quote, null, 2)}`);
}

// Configure nodemailer (update with your SMTP settings)
let transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "your_email@example.com",
    pass: "your_password",
  },
});

// CSV logging file path (adjust as needed)
const csvFilePath = path.join(__dirname, "../data/quotes_log.csv");

function logQuoteToCSV(quote) {
  // Write header if file does not exist
  let csvContent = "";
  if (!existsSync(csvFilePath)) {
    csvContent +=
      "timestamp,customerEmail,totalCost,billableHours,baseHours,complexityMultiplier,serviceTypeMultiplier\n";
  }
  csvContent += `${new Date().toISOString()},${quote.customerEmail || "N/A"},${quote.totalCost},${quote.billableHours},${quote.baseHours},${quote.complexityMultiplier},${quote.serviceTypeMultiplier}\n`;
  appendFileSync(csvFilePath, csvContent);
}

exports.handler = async function (event, context) {
  try {
    const data = JSON.parse(event.body);
    const action = data.action;
    const quote = data.quote;

    if (action === "sendEmail") {
      // Generate a PDF attachment for the quote
      const pdfBuffer = generatePDF(quote);
      let mailOptions = {
        from: '"Job Pricing Calculator" <no-reply@example.com>',
        to: "troy.latter@unisys.com", // as required
        subject: "New Quote Generated",
        text: "Please find attached the generated quote.",
        attachments: [
          {
            filename: "quote.pdf",
            content: pdfBuffer,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email sent successfully!" }),
      };
    } else if (action === "scheduleJob") {
      // Here you could integrate with a calendar API; for now we log the schedule
      console.log("Job scheduled for:", quote.scheduleDate);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Job scheduled successfully!" }),
      };
    } else if (action === "logQuote") {
      // Append the quote details to a CSV file
      logQuoteToCSV(quote);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Quote logged successfully!" }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid action" }),
      };
    }
  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error" }),
    };
  }
};
