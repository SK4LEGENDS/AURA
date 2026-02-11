
import * as officeParser from 'officeparser';

async function checkOfficeParser() {
    console.log("Checking officeparser API...");
    try {
        // Create a dummy buffer (not a valid file, just checking if function accepts buffer type)
        const buffer = Buffer.from("dummy data");

        // This will likely fail due to invalid data, but we want to see if it throws "path required" or "invalid data"
        // parse(data, callback) or parse(data) -> promise?

        console.log("Attempting to call parse with buffer...");
        // @ts-ignore
        officeParser.parse(buffer, (err, data) => {
            if (err) {
                console.log("Callback Error:", err.message);
            } else {
                console.log("Callback Success");
            }
        });

    } catch (e) {
        console.log("Sync Error:", e);
    }
}

checkOfficeParser();
