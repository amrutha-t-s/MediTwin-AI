require("dotenv").config();

const prisma = require("./src/config/db");

prisma.dailyHealthLog.findMany({
  orderBy: {
    date: "desc"
  }
})
.then((journals) => {
  console.log("SAVED HEALTH JOURNALS:", journals.length);
  console.dir(journals, { depth: null });
})
.catch((error) => {
  console.error("ERROR:", error);
})
.finally(async () => {
  await prisma.$disconnect();
});
