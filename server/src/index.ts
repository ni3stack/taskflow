import app from "./app";
import { PORT } from "./config/env";
import { pool } from "./config/database";

pool.query("SELECT 1")
  .then(() => {
      console.log("database connected");
  })
  .catch((error) => {
      console.error("database connection failed", error);
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
