import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    dueDate: "",
    urgency: 1,
  });
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // Check if name is empty
    if (form.name.trim() === "") {
      window.alert("Name cannot be empty!");
      return;
    }

    // When a post request is sent to the create url, we'll add a new task to the database.
    const newTask = { ...form };

    await fetch("http://localhost:5000/task/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    }).catch((error) => {
      window.alert(error);
      return;
    });

    setForm({ name: "", description: "", dueDate: "", urgency: 1 }); // Reset form fields
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <h3>Create New Task</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name" style={{ fontWeight: "bold" }}>
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              autoComplete="off"
              value={form.name}
              onChange={
                (e) => updateForm({ name: e.target.value.slice(0, 64) }) // Limit to 64 characters
              }
              required // Make the name field required
              style={{ width: "calc(100% - 20px)" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={form.description}
              onChange={(e) =>
                updateForm({
                  description: e.target.value,
                  description: e.target.value.slice(0, 256),
                })
              }
              style={{
                width: "calc(100% - 20px)",
                minHeight: "100px",
                maxHeight: "200px",
                overflowY: "scroll",
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              value={form.dueDate}
              onChange={(e) => updateForm({ dueDate: e.target.value })}
              style={{ width: "calc(100% - 20px)" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="urgency" style={{ fontWeight: "bold" }}>
              Urgency
            </label>
            <input
              type="number"
              className="form-control"
              id="urgency"
              min="1"
              max="5"
              value={form.urgency}
              onChange={(e) =>
                updateForm({ urgency: parseInt(e.target.value) })
              }
              style={{ width: "calc(100% - 20px)" }}
            />
          </div>
          <div
            className="form-group"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <a href="/" className="btn btn-danger" style={{ width: "48%" }}>
              Cancel
            </a>
            <input
              type="submit"
              value="Create Task"
              className="btn btn-primary"
              style={{ width: "48%" }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
