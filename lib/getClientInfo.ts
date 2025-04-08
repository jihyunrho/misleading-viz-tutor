export default async function getClientInfo(): Promise<{
  ipAddr: string;
  userAgent: string;
}> {
  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

  let ipAddr = "unknown";

  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      ipAddr = data.ip;
    } else {
      console.error("Failed to fetch IP:", response.status);
    }
  } catch (error) {
    console.error("Error fetching IP:", error);
  }

  return { ipAddr, userAgent };
}
