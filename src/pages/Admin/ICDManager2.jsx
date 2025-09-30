import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar";

function IcdManager2() {
  const [icdCodes, setIcdCodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCode, setEditCode] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    fetchICDs();
    fetchCategories();
  }, []);

  const fetchICDs = async () => {
    try {
      const res = await axios.get("http://localhost/api/ICD-10.php");
      setIcdCodes(res.data);
    } catch (err) {
      console.error("Error fetching ICDs:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost/api/ICD-10_Categories.php");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ICD CRUD
  const handleAddICD = async () => {
    if (!newCode || !newDesc || !selectedCategory) return;
    try {
      await axios.post("http://localhost/api/ICD-10.php", {
        code: newCode,
        desc: newDesc,
        cat: selectedCategory,
      });
      setNewCode("");
      setNewDesc("");
      setSelectedCategory("");
      fetchICDs();
    } catch (err) {
      console.error("Error adding ICD:", err);
    }
  };

  const handleDeleteICD = async (ID) => {
    try {
      await axios.delete("http://localhost/api/ICD-10.php", { 
        data: { ID }
      });
      fetchICDs();
    } catch (err) {
      console.error("Error deleting ICD:", err);
    }
  };

  const handleEditStart = (icd) => {
    setEditId(icd.ID);
    setEditCode(icd.Code);
    setEditDesc(icd.Description);
    setSelectedCategory(icd.Category);
  };

  const handleEditSave = async () => {
    try {
      await axios.put("http://localhost/api/ICD-10.php", {
        id: editId,
        code: editCode,
        desc: editDesc,
        category: selectedCategory,
      });
      setEditId(null);
      setEditCode("");
      setEditDesc("");
      setSelectedCategory("");
      fetchICDs();
    } catch (err) {
      console.error("Error updating ICD:", err);
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
        <h2 style={{ color: "#07598D" }}>ICD Code Manager</h2>

        {/* Add ICD Form */}
        <div className="add-icd-form">
          <input
            type="text"
            placeholder="ICD Code (e.g., A90)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Diagnosis Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: "150px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
          >
            <option value=""disabled hidden>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.ID} value={cat.Category}>
                {cat.Category}
              </option>
            ))}
          </select>
          <button style={{ background: "#07598D" }} onClick={handleAddICD}>Add ICD</button>
          <button onClick={() => setShowCategoryModal(true)} style={{ marginLeft: 8, background: "#07598D" }}>
            Manage Categories
          </button>
        </div>

        {/* List of ICD Codes */}
        <table border={1} style={{ marginTop: 20, width: "100%" }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {icdCodes.map((icd) => (
              <tr key={icd.ID}>
                <td>
                  {editId === icd.ID ? (
                    <input value={editCode} onChange={(e) => setEditCode(e.target.value)} />
                  ) : (
                    icd.Code
                  )}
                </td>
                <td>
                  {editId === icd.ID ? (
                    <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                  ) : (
                    icd.Description
                  )}
                </td>
                <td>
                  {editId === icd.ID ? (
                    <select value={selectedCategory} 
                    style={{ width: "150px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
                    onChange={(e) => setSelectedCategory(e.target.value)}>
                      {categories.map((cat) => (
                        <option key={cat.ID} value={cat.Category}>
                          {cat.Category}
                        </option>
                      ))}
                    </select>
                  ) : (
                    icd.Category
                  )}
                </td>
                <td>
                  {editId === icd.ID ? (
                    <button style={{ background: "#07598D" }} onClick={handleEditSave}>Save</button>
                  ) : (
                    <button style={{ background: "#07598D" }} onClick={() => handleEditStart(icd)}>Edit</button>
                  )}
                  <button  onClick={() => handleDeleteICD(icd.ID)} style={{ marginLeft: 8, background: "#07598D" }}>
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
