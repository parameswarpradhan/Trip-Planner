import dotenv from "dotenv";
dotenv.config();

async function main() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log("STATUS:", res.status);
  console.log(JSON.stringify(data, null, 2));
}

main();
