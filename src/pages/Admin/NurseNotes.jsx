import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar";

function IcdManager2() {
  const [newNote, setNewNote] = useState("");
  const [Notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState("");

  
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  
  const [editDesc, setEditDesc] = useState("");

  // Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost/api/Nurse_Notes.php");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching Notes:", err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote) return;
    try {
      await axios.post("http://localhost/api/Nurse_Notes.php", {
        note: newNote,
      });
      setNewNote("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding Notes:", err);
    }
  };









  const handleDeleteNote = async (ID) => {
    try {
      await axios.delete("http://localhost/api/Nurse_Notes.php", { 
        data: { ID }
      });
      fetchNotes();
    } catch (err) {
      console.error("Error deleting Note:", err);
    }
  };

  const handleEditStart = (note) => {
    setEditId(note.ID);
    setEditNote(note.Note);
  };

  const handleEditSave = async () => {
    try {
      await axios.put("http://localhost/api/nurse_notes.php", {
        id: editId,
        note: editNote,
      });
      setEditId(null);
      setEditNote("");
      fetchNotes();
    } catch (err) {
      console.error("Error updating Note:", err);
    }
  };





  // Category CRUD
  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await axios.post("http://localhost/api/ICD-10_Categories.php", { cat: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleEditCategoryStart = (cat) => {
    setEditCategoryId(cat.ID);
    setEditCategoryName(cat.Category);
  };

  const handleEditCategorySave = async () => {
    try {
      await axios.put("http://localhost/api/ICD-10_Categories.php", {
        ID: editCategoryId,
        Category: editCategoryName,
      });
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (ID) => {
    try {
      console.log(ID);
      await axios.delete("http://localhost/api/ICD-10_Categories.php", { 
        data: { ID } 
      });
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="FileMaintenance-Container">
      <Sidebar />
      <div className="icd-page">
        <h2 style={{ color: "#07598D" }}>Nurse Notes Manager</h2>

        {/* Add ICD Form */}
        <div className="add-icd-form">
          <input
            type="text"
            placeholder="Nurse Note (e.g., Low BMI)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button style={{ background: "#07598D" }} onClick={handleAddNote}>Add Note</button>
        </div>

        {/* List of ICD Codes */}
        <table border={1} style={{ marginTop: 20, width: "100%" }}>
          <thead>
            <tr>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Notes.map((note) => (
              <tr key={note.ID}>
                <td>
                  {editId === note.ID ? (
                    <input value={editNote} onChange={(e) => setEditNote(e.target.value)} />
                  ) : (
                    note.Note
                  )}
                </td>
                <td>
                  {editId === note.ID ? (
                    <button style={{ background: "#07598D" }} onClick={handleEditSave}>Save</button>
                  ) : (
                    <button style={{ background: "#07598D" }} onClick={() => handleEditStart(note)}>Edit</button>
                  )}
                  <button  onClick={() => handleDeleteNote(note.ID)} style={{ marginLeft: 8, background: "#07598D" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Category Modal */}
        {showCategoryModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
          <div
            style={{
              width: 400,
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
          <h3 style={{ marginTop: 0, color: "#07598D" }}>Manage Categories</h3>
          <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}       
              style={{ width: "calc(100% - 60px)", padding: "6px", boxSizing: "border-box" }}
          />

          <button  onClick={handleAddCategory} style={{ marginLeft: 5, background: "#07598D", color: "#fff", padding: "6px 12px" }}>
            Add
          </button>
          <button
            onClick={() => {
              setShowCategoryModal(false);
              setEditCategoryId(null);
              setEditCategoryName("");
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#07598D",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            X
          </button>
              

              <div style={{ marginTop: 10 }}>
                {categories.map((cat) => (
                  <div
                    key={cat.ID}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                       wordBreak: "break-word",
                    }}
                  >
                    {editCategoryId === cat.ID ? (
                      <>
                        <input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          style={{ flex: 1, padding: "4px", marginRight: 6, boxSizing: "border-box" }}
                        />
                        <button style={{ background: "#07598D" }} onClick={handleEditCategorySave}>Save</button>
                      </>
                    ) : (
                      <>
                        <span style={{ flex: 1, overflowWrap: "break-word" }}>{cat.Category}</span>
                        <div>
                          <button style={{ background: "#07598D" }} onClick={() => handleEditCategoryStart(cat)}>Edit</button>
                          <button
                            onClick={() => handleDeleteCategory(cat.ID)}
                            style={{ marginLeft: 5, background: "#07598D" }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IcdManager2;
