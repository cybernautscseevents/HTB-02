const http = require("http");

const data = JSON.stringify({
    batchId: "MED-001",
    from: "ABC Pharma",
    to: "XYZ Distributor"
});

const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/transfer",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    let response = "";

    res.on("data", chunk => {
        response += chunk;
    });

    res.on("end", () => {
        console.log("Status:", res.statusCode);
        console.log("Response:", response);
    });
});

req.on("error", error => {
    console.log("Request failed:", error.message);
});

req.write(data);
req.end();