/**
 * mongodbPing.js — MongoDB Atlas Connectivity Check
 * Windows / Node.js
 *
 * Install: npm install mongodb dotenv
 * Run:     node mongodbPing.js
 *
 * Set MONGODB_URI in a .env file or as a Windows environment variable:
 *   .env file example:
 *     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
 */

// dotenv loads variables from a .env file into process.env at startup.
// { quiet: true } suppresses the warning if .env is missing — we handle that below.
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); // force Node.js to use Google DNS, bypassing broken local resolver
require("dotenv").config({ quiet: true });

const { MongoClient } = require("mongodb");

// Read the URI from the environment. If it's missing, we exit early with a helpful message.
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error(
    "\n[ERROR] MONGODB_URI is not set.\n" +
    "  Option A: Create a .env file in this folder with:\n" +
    "            MONGODB_URI=mongodb+srv://...\n" +
    "  Option B: Set it as a Windows environment variable:\n" +
    "            set MONGODB_URI=mongodb+srv://...\n"
  );
  process.exit(1); // Exit with a non-zero code so scripts/CI know something went wrong
}

// serverSelectionTimeoutMS: how long (ms) the driver waits to find a reachable server
// before giving up. 5 s is enough to distinguish "wrong URI" from "slow network".
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function pingAtlas() {
  console.log("\n[1/4] Connecting to MongoDB Atlas...");

  try {
    // open() establishes the TCP connection and performs the TLS handshake.
    // It does NOT yet confirm your credentials or database access.
    await client.connect();
    console.log("[2/4] TCP connection established.");

    // ping: 1 is the lightest possible round-trip command — it sends one byte
    // and expects {ok:1} back. Confirms auth, network, and Atlas cluster health.
    // We run it against "admin" because every Atlas user has read access there.
    await client.db("admin").command({ ping: 1 });
    console.log("[3/4] Ping succeeded — Atlas cluster is reachable and credentials are valid.");

  } catch (err) {
    // Distinguish the two most common failure modes for a clearer first-time experience.
    if (err.name === "MongoServerSelectionError") {
      console.error(
        "\n[ERROR] Could not reach the Atlas cluster.\n" +
        "  Common causes:\n" +
        "  • Your IP is not whitelisted — Atlas > Security > Network Access > Add IP\n" +
        "  • The cluster is paused — Atlas > Database > Resume\n" +
        "  • A firewall or VPN is blocking port 27017\n" +
        `  Detail: ${err.message}\n`
      );
    } else {
      // Authentication failures, wrong database name, malformed URI, etc.
      console.error(`\n[ERROR] ${err.name}: ${err.message}\n`);
    }
    process.exitCode = 1; // mark failure but still run the finally block
  } finally {
    // Always close the connection — even when an error occurs.
    // Leaving connections open can exhaust Atlas's connection limit on free-tier clusters.
    await client.close();
    console.log("[4/4] Connection closed.");
    if (process.exitCode !== 1) {
      console.log("\n✅  All done — MongoDB Atlas connection is working!\n");
    } else {
      console.log("\n❌  Connection check failed. See the error above.\n");
    }
  }
}

pingAtlas();