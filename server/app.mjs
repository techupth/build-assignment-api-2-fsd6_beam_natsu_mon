import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4002;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀 UwU");
});

app.post("/assignments", async (req, res) => {
  const newAssignment = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  };
  console.log(newAssignment);
  try {
    await connectionPool.query(
      `insert into assignments (title, content, category, length,
       user_id, status, created_at, updated_at, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        // newAssignment.assignment_id,
        newAssignment.title,
        newAssignment.content,
        newAssignment.category,
        newAssignment.length,
        newAssignment.user_id,
        newAssignment.status,
        newAssignment.created_at,
        newAssignment.updated_at,
        newAssignment.published_at,
      ]
    );
    return res.status(200).json({
      message: "Assignment has been created.",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Server could not create assignment because of a database connection error, sadge",
    });
  }
});

app.get("/assignments", async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from assignments`);
    return res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Server could not create assignment because database connection JA",
    });
  }
});

app.get("/assignments/:assignmentId", async (req, res) => {
  let results;
  try {
    const assignmentIdFromClient = req.params.assignmentId;

    results = await connectionPool.query(
      `select * from assignments where assignment_id = $1`,
      [assignmentIdFromClient]
    );
    console.log("404 results", results);
    if (results.rowCount == 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment I qwai",
      });
    }
    return res.status(200).json({
      data: results.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
});

app.put("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  const updatedAssignment = {
    ...req.body,
    updated_at: new Date(),
  };
  try {
    const fourOFourTrap = await connectionPool.query(
      `
      update assignments
      set title = $2,
          content = $3,
          category = $4,
          length = $5,
          status = $6,
          updated_at = $7
      where assignment_id = $1
      `,
      [
        assignmentIdFromClient,
        updatedAssignment.title,
        updatedAssignment.content,
        updatedAssignment.category,
        updatedAssignment.length,
        updatedAssignment.status,
        updatedAssignment.updated_at,
      ]
    );
    console.log("404 u f", fourOFourTrap);
    if (fourOFourTrap.rowCount == 0) {
      return res.status(404).json({
        message: "Server could not find the requested assignment to update",
      });
    }
    return res.status(200).json({ message: "Updated assignment successfully" });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({
      message: "Server could not update assignment due to a database error",
    });
  }
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;

  try {
    const delChara = await connectionPool.query(
      `delete from assignments where assignment_Id = $1`,
      [assignmentIdFromClient]
    );
    console.log("meow", delChara);
    if (delChara.rowCount == 0) {
      return res.status(404).json({
        message: "Server could not find the requested assignment to delete",
      });
    }
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({
      message: "Server could not delete assignment because database connection",
    });
  }
  return res.status(200).json({
    message: "Delete post successfully",
  });
});
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
