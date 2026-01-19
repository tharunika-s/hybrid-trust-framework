const pool = require("../db");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.time("Seeding time");

  console.log("Clearing existing data...");
  await pool.query("TRUNCATE products CASCADE");
  await pool.query("TRUNCATE vendors CASCADE");

  console.log("Inserting vendors...");
  for (let i = 1; i <= 500; i++) {
    await pool.query(
      `INSERT INTO vendors (name, wallet, identity, behaviour, consistency, compliance)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        `Vendor ${i}`,
        `0xWALLET${i}`,
        rand(70, 95),
        rand(50, 90),
        rand(60, 90),
        100
      ]
    );
  }

  console.log("Fetching vendor IDs...");
  const vendorResult = await pool.query("SELECT id FROM vendors");
  const vendorIds = vendorResult.rows.map(v => v.id);

  console.log("Inserting products...");
  for (let i = 1; i <= 1000; i++) {
    const randomVendor =
      vendorIds[Math.floor(Math.random() * vendorIds.length)];

    await pool.query(
      `INSERT INTO products (name, price, product_trust, vendor_id)
       VALUES ($1, $2, $3, $4)`,
      [
        `Product ${i}`,
        rand(100, 5000),
        rand(40, 95),
        randomVendor
      ]
    );
  }

  console.timeEnd("Seeding time");
  console.log("Seeding completed successfully");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
