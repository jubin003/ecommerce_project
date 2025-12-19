import axios from "axios";

// Verify Khalti Payment
export async function verifyKhaltiPayment(pidx) {
  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    console.log("Verifying payment with Khalti...");
    const response = await axios.request(reqOptions);
    console.log("Verification successful");
    return response.data;
  } catch (error) {
    console.error("Khalti verification error:", error.response?.data || error.message);
    throw error;
  }
}

// Initialize Khalti Payment
export async function initializeKhaltiPayment(details) {
  console.log("=== Khalti Service: Initialize Payment ===");

  if (!process.env.KHALTI_GATEWAY_URL || !process.env.KHALTI_SECRET_KEY) {
    throw new Error("Khalti configuration missing in environment variables");
  }

  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({
    return_url: details.return_url,
    website_url: details.website_url,
    amount: details.amount,
    purchase_order_id: details.purchase_order_id,
    purchase_order_name: details.purchase_order_name,
  });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
    timeout: 30000,
  };

  console.log("Request URL:", reqOptions.url);
  console.log("Request Data:", bodyContent);

  try {
    const response = await axios.request(reqOptions);
    console.log("Khalti initialization successful");
    return response.data;
  } catch (error) {
    console.error("=== Khalti Initialization Error ===");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data);
    
    // Provide helpful error messages
    if (error.response?.status === 401) {
      throw new Error("Invalid Khalti Secret Key. Please check your KHALTI_SECRET_KEY in .env file");
    }
    
    throw error;
  }
}