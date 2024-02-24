import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    dueDate: "",
    urgency: 1,
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:5000/task/${params.id.toString()}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const task = await response.json();
      if (!task) {
        window.alert(`Task with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(task);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    const editedTask = { ...form };

    await fetch(`http://localhost:5000/task/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });

    navigate("/");
  }

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
        <h3>Update Task</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name" style={{ fontWeight: "bold" }}>
              Name: 
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value.slice(0, 64) })}
              required
              style={{ width: "calc(100% - 20px)" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">
              Description: 
            </label>
            <textarea
              className="form-control"
              id="description"
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value.slice(0, 256) })}
              style={{
                width: "calc(100% - 20px)",
                minHeight: "100px",
                maxHeight: "200px",
                overflowY: "scroll",
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">
              Due Date: 
            </label>
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
              Urgency: 
            </label>
            <input
              type="number"
              className="form-control"
              id="urgency"
              min="1"
              max="5"
              value={form.urgency}
              onChange={(e) => updateForm({ urgency: parseInt(e.target.value) })}
              style={{ width: "calc(100% - 20px)" }}
            />
          </div>
          <br />
          <div
            className="form-group"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <a href="/" className="btn btn-danger" style={{ width: "48%" }}>
              Cancel
            </a>
            <input
              type="submit"
              value="Update Task"
              className="btn btn-primary"
              style={{ width: "48%" }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
