import React, { useState } from "react";
import Select from "react-select";

/* grouped ICD data */
const icdOptions = [
  {
    label: "Infectious Diseases",
    options: [
      { value: "A00", label: "A00 - Cholera" },
      { value: "A01", label: "A01 - Typhoid fever" },
      { value: "A09", label: "A09 - Gastroenteritis" },
    ],
  },
  {
    label: "Respiratory Diseases",
    options: [
      { value: "J06.9", label: "J06.9 - Acute URI" },
      { value: "J18.9", label: "J18.9 - Pneumonia" },
      { value: "J45", label: "J45 - Asthma" },
    ],
  },
  {
    label: "Endocrine Disorders",
    options: [
      { value: "E11", label: "E11 - Type 2 diabetes mellitus" },
      { value: "E03.9", label: "E03.9 - Hypothyroidism" },
    ],
  },
];

/* Custom MenuList that preserves react-select's Option elements */
const CollapsibleMenuList = (props) => {
  // track collapsed state per group label
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (label) =>
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  // props.children are Group elements created by react-select.
  // Each groupElem.props.data.label is the group label,
  // and groupElem.props.children contains the Option elements.
  return (
    // spread props.innerProps onto the container so keyboard/scroll works
    <div {...props.innerProps}>
      {React.Children.map(props.children, (groupElem, idx) => {
        if (!groupElem) return null;

        // Try to get the group label from the generated Group element props
        const groupLabel =
          (groupElem.props && groupElem.props.data && groupElem.props.data.label) ||
          (groupElem.props && groupElem.props.label) ||
          `group-${idx}`;

        const isCollapsed = !!collapsedGroups[groupLabel];

        return (
          <div key={groupLabel} style={{ userSelect: "none" }}>
            {/* Category header */}
            <div
              onClick={() => toggleGroup(groupLabel)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                background: "#f5f7fa",
                borderBottom: "1px solid #eceff3",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <span>{groupLabel}</span>
              <span style={{ fontSize: 12 }}>{isCollapsed ? "▶" : "▼"}</span>
            </div>

            {/* If not collapsed -> render the original Option elements (preserves hover) */}
            {!isCollapsed && (
              <div style={{ paddingLeft: 6 }}>
                {/* groupElem.props.children can be a single element or array */}
                {groupElem.props && groupElem.props.children
                  ? groupElem.props.children
                  : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function IcdCollapsibleDropdown() {
  const [selected, setSelected] = useState([]);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 12 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        Select Diagnosis (ICD)
      </label>

      <Select
        options={icdOptions}
        value={selected}
        onChange={setSelected}
        isSearchable
        isMulti
        placeholder="Search or select ICD..."
        components={{ MenuList: CollapsibleMenuList }}
        styles={{
          menu: (base) => ({ ...base, zIndex: 9999 }), // avoid overlap
        }}
      />

      {selected && selected.length > 0 && (
        <div
            style={{
            marginTop: 12,
            padding: 10,
            border: "1px solid #e6eef9",
            borderRadius: 6,
            background: "#f8fbff",
            }}
        >
            <strong>Selected ICDs:</strong>
            <ul style={{ marginTop: 6, paddingLeft: 20 }}>
            {selected.map((s) => (
                <li key={s.value}>{s.label}</li>
            ))}
            </ul>
        </div>
        )}
    </div>
  );
}
