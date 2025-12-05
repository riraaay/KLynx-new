import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../components/css/GlobalContainer.css';
import '../../components/css/DashboardAlt.css';
import '../../components/css/FileMaintenance.css'
import './Doctors.css'
import axios from 'axios';
import React from 'react';  
import { BiSolidCog, BiSolidBell, BiSolidEdit, BiSolidTrash } from 'react-icons/bi';

const Prenatal = () => {
    const [showPartnerInputs, setShowPartnerInputs] = useState(false);

    const [allPatients, setAllPatients] = useState([]);
    const [Notes, setNotes] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [addDoctorsInputs, setAddDoctorsInputs] = useState({ sex: "Male" });
    
    const [doctorsList, setDoctorsList] = useState([]);
  //  const [prenatalPatients, setPrenatalPatients] = useState([]);
    const [prenatalProfiles, setPrenatalProfiles] = useState([]);
    const [viewHistoryModal, setViewHistoryModal] = useState(false);
    const [addHistoryModal, setAddHistoryModal] = useState(false);
    const [prenatalVisits, setPrenatalVisits] = useState([]);
    const [addHistoryInputs, setAddHistoryInputs] = useState({});
    const [editDoctorModal, setEditDoctorModal] = useState(false);
    const [deleteDoctorModal, setDeleteDoctorModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleModalOpen = () =>{
        setShowModal(true);
    }    

    const handleAddDoctorsChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;

        if (name === "birthDate" || name === "pBday") {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
                age--; // subtract one if birthday hasn’t happened this year yet
            }

            const ageField = name === "birthDate" ? "Age" : "pAge";

            setAddDoctorsInputs(values => ({
                ...values, [name]: value, [ageField]: age.toString()  // Update age as string to be safe
            }));
        } else {
            setAddDoctorsInputs(values => ({...values, [name]: value}));
        }

        let updatedInputs = { ...addHistoryInputs, [name]: value };
        if ((name === "weight" || name === "height")) {
        const weight = parseFloat(name === "weight" ? value : updatedInputs.weight);
        const heightCm = parseFloat(name === "height" ? value : updatedInputs.height);
        if (weight && heightCm) {
            const heightM = heightCm / 100; // convert cm to meters
            const bmi = weight / (heightM * heightM);
            updatedInputs.BMI = bmi ? bmi.toFixed(2) : "";
        } else {
            updatedInputs.BMI = "";
        }
        }
    }

    const handleAddDoctorsSubmit = (e) =>{
        e.preventDefault();
        console.log(addDoctorsInputs);

        axios.post('http://localhost/api/Prenatal_Profiles.php', addDoctorsInputs).then(function(response){
            console.log(response.data);
            setSelectedDoctor(null);
            if (response.data.status === 1) {
                const newPrenatalID = response.data.prenatal_id;
                
                const updatedInputs = {
                    ...addDoctorsInputs,
                    PrenatalID_Partner: newPrenatalID
                };
                console.log("Updated Inputs: ", updatedInputs);
                axios.post('http://localhost/api/Prenatal_Partners.php', updatedInputs).then(function(response){
                    console.log(response.data);
                    setShowModal(false);
                    setAddDoctorsInputs({});
                    getPrenatalProfiles();
                });

            }
    
        });

    }

    function getPrenatalProfiles() {
        axios.get('http://localhost/api/Prenatal_Profiles.php').then(function(response){
            console.log("Get All Prenatal Profiles: ", response.data);
            setDoctorsList(response.data);
            setPrenatalProfiles(response.data);
        });
    }

    useEffect( () => {
            getPrenatalProfiles();
    }, []);



    /* Fetches All Patient Info from Patient Creation Page */
    useEffect(() => {
        axios.get("http://localhost/api/Patient.php")
            .then(res => { setAllPatients(res.data); console.log(res.data); })
            .catch(err => console.error(err));
        axios
        .get("http://localhost/api/Nurse_Notes.php")
        .then((res) => setNotes(res.data))
        .catch((err) => console.error("Error fetching Notes:", err));
    }, []);

    const handlePatientSelect = (e) => {
    const selectedID = e.target.value;
    const selected = allPatients.find(p => p.PatientID === selectedID);

    if (selected) {
        setAddDoctorsInputs({
        ...addDoctorsInputs,
        patientID: selected.PatientID,
        famID: selected.FamilyID,
        fName: selected.FirstName,
        mName: selected.MiddleName,
        lName: selected.LastName,
        });
    }
    };

    const viewHistory = async (id) => {
        const response = await axios.get(`http://localhost/api/Prenatal_Visits.php?id=${id}`);
        setPrenatalVisits(response.data);
        setViewHistoryModal(true);
        console.log("Prenatal Visits: ", response.data);
        
        setAddHistoryInputs((values) => ({ ...values, PrenatalID: id }));
    }


    const handleAddHistoryChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setAddHistoryInputs(values => ({...values, [name]: value}));
    }

    const submitHistoryRecord = (e) => {
        e.preventDefault();
        console.log("addHistoryInputs consists of: ", addHistoryInputs);
        const prenatalId = addHistoryInputs.PrenatalID;

        axios.post('http://localhost/api/Prenatal_Visits.php', addHistoryInputs).then(function(response){
            console.log(response.data);
            setAddHistoryModal(false);

            setAddHistoryInputs({});
            viewHistory(prenatalId);
        });
    }

    const editDoctor = async (id) => {
        const response = await axios.get(`http://localhost/api/Doctors.php?id=${id}`);
        console.log("Before Doctor: ",selectedDoctor);
        console.log(response.data);
        setSelectedDoctor(response.data);
        setEditDoctorModal(true);
    }

    const handleEditSubmit = (e) =>{
        e.preventDefault();
        console.log(selectedDoctor);

        axios.put(`http://localhost/api/Doctors.php?id=${selectedDoctor.AdminID}`, selectedDoctor).then(function(response){
            console.log(response.data);
            getPrenatalProfiles();
            setSelectedDoctor(null);
            setEditDoctorModal(false);
        });
    }

    const handleEditDoctorsChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setSelectedDoctor(values => ({...values, [name]: value}));
    }

    const deleteDoctor = (id) => {
        axios.delete(`http://localhost/api/Prenatal_Partners.php?id=${id}`).then(function(response){
        });
        axios.delete(`http://localhost/api/Prenatal_Profiles.php?id=${id}`).then(function(response){
        });
        axios.delete(`http://localhost/api/Prenatal_Visits.php?id=${id}`).then(function(response){
            console.log(response.data);
            getPrenatalProfiles();
            setSelectedDoctor(null);
            setDeleteDoctorModal(false);
        });
    }

    

    return (
        <div className="FileMaintenance-Container">
            <Sidebar />
            <main className="FileMaintenance-Content">
                <div className="FileMaintenance-Header">
                    <div className="FileMaintenance-HeaderTitle">
                        <h1>Prenatal</h1>
                    </div>
                    <div className="FileMaintenance-HeaderSetting">
                        <BiSolidBell className="FileMaintenance-Icon" />
                        <BiSolidCog className="FileMaintenance-Icon" />
                    </div>
                </div>
                <hr></hr>
                <div className="FileMaintenance-Filter-Container">
                    <div className="FileMaintenance-Entries">
                        <span>Show</span>
                        <select>
                            <option hidden></option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>
                        <span>Entries</span>
                    </div>
                    <div className="FileMaintenance-AddSearch">
                            <button onClick={() => handleModalOpen()}>Add</button>
                            <span>Search:</span>
                            <input type="text" placeholder="Search here..."/>
                    </div>
                </div>
                <div className="FileMaintenance-TableWrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Prenatal ID</th>
                                <th>Patient ID</th>
                                <th>Family ID</th>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>Date Created</th>
                                <th colSpan="3">Record</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prenatalProfiles.map((prenProf, key) => (
                            <tr key={key}>
                                <td>
                                    {prenProf.PrenatalID}
                                </td>
                                <td>
                                    {prenProf.PatientID}
                                </td>
                                <td>
                                    {prenProf.FamilyID}
                                </td>
                                <td>
                                    {prenProf.LastName}
                                </td>
                                <td>
                                    {prenProf.FirstName}
                                </td>
                                <td>
                                    {prenProf.DateCreated}
                                </td>
                                <td>
                                    <button onClick={() => viewHistory(prenProf.PrenatalID) }>View History</button>
                                </td>
                                <td>
                                    <button onClick={() => editDoctor(prenProf.PatientID) } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Edit" >
                                    <BiSolidEdit className="FileMaintenance-TableIcon FileMaintenance-IconEdit" />  </button>
                                </td>
                                <td>
                                    <button onClick={() => { setSelectedDoctor(prenProf.PrenatalID); setDeleteDoctorModal(true); } } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Delete" >
                                    <BiSolidTrash className="FileMaintenance-TableIcon" />  </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* MODALS SECTION */}
            {showModal && (
            <div className="add-doctors-popup-overlay">
                <div className="add-doctors-popup-content">
                    <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setShowModal(false); setSelectedDoctor({}); setAddDoctorsInputs({});} }>
                        X
                    </button>
                    <h2>New Prenatal Profile</h2>
                    <form className="add-doctors-form" onSubmit={handleAddDoctorsSubmit}>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label>Select Patient:</label>
                                <div className="add-doctors-select-box">
                                    <select onChange={handlePatientSelect} required>
                                        <option hidden value="">-- Select Patient --</option>
                                        {allPatients.map((p) => (
                                            <option key={p.PatientID} value={p.PatientID}>
                                                {p.PatientID}
                                            </option>
                                        ))}
                                    </select>    
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-lastName">Family ID:</label>  
                                <input type="text" id="add-doctors-lastName" name="famID" placeholder="Select patient id" value={addDoctorsInputs.famID || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                <input type="text" id="add-doctors-lastName" name="lName" placeholder="Select patient id" value={addDoctorsInputs.lName || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-firstName">First Name:</label>
                                <input type="text" id="add-doctors-firstName" name="fName" placeholder="Select patient id" value={addDoctorsInputs.fName || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                <input type="text" id="add-doctors-middleName" name="mName" placeholder="Select patient id" value={addDoctorsInputs.mName || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-age">Age:</label>
                                <input type="text" id="add-doctors-age" name="Age" required readOnly className="add-doctors-shaded-input" value={addDoctorsInputs.Age || ""} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-specialty">Birthdate:</label>
                                <input type="date" id="add-doctors-specialty" name="birthDate" value={addDoctorsInputs.birthDate || ""} required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-civilstatus">Civil Status:</label>
                                <div className="add-doctors-select-box">
                                    <select name="civilStatus" onChange={handleAddDoctorsChange} > 
                                        <option hidden></option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Divorced">Divorced</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-occu">Occupation:</label>
                                <input type="text" id="add-doctors-occu" name="occupation" placeholder="Enter occupation" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-contactNumber">Contact Number:</label>
                                <input type="text" id="add-doctors-contactNumber" name="contactNum" placeholder="Enter contact number" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-phnum">Philhealth Number:</label>
                                <input type="text" id="add-doctors-phnum" name="pHealthNum" placeholder="Enter philhealth number" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-gravida">Gravida:</label>
                                <input type="text" id="add-doctors-gravida" name="gravida" placeholder="Enter gravida" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-para">Para:</label>
                                <input type="text" id="add-doctors-para" name="para" placeholder="Enter para" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-lmp">LMP:</label>
                                <input type="date" id="add-doctors-lmp" name="lmp" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-edd">EDD:</label>
                                <input type="date" id="add-doctors-edd" name="edd" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-tdstat">TD Status:</label>
                                <input type="text" id="add-doctors-tdstat" name="tdStatus" placeholder="Enter td status" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>

                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box" style={{ display: "flex", alignItems: "center", paddingLeft: "17em"}}> 
                                <input
                                    type="checkbox"
                                    checked={showPartnerInputs}
                                    onChange={(e) => setShowPartnerInputs(e.target.checked)}
                                    style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                />
                                <label style={{ paddingTop: "20px", margin: 0, fontWeight: "500" }}>    Father / Partner Present </label>
                            </div>
                        </div>

                        {showPartnerInputs && (
                            <>
                                <h2 style={{ marginTop: "2.6em" }}>Husband / Partner Information</h2>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-plastName">Last Name:</label>  
                                        <input type="text" id="add-doctors-plastName" name="pLName" placeholder="Enter partner last name" onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pfirstName">First Name:</label>
                                        <input type="text" id="add-doctors-pfirstName" name="pFName" placeholder="Enter partner first name" onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pmiddleName">Middle Name:</label>
                                        <input type="text" id="add-doctors-pmiddleName" name="pMName" placeholder="Enter partner middle name" onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pAge">Age:</label>  
                                        <input type="text" id="add-doctors-pAge" name="pAge" readOnly className="add-doctors-shaded-input" placeholder="Select partner birthdate" onChange={handleAddDoctorsChange} value={addDoctorsInputs.pAge || ""} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pbday">Birthday:</label>
                                        <input type="date" id="add-doctors-pbday" name="pBday" value={addDoctorsInputs.pBday || ""} onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-civilstatus">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="pCivilStatus" onChange={handleAddDoctorsChange} > 
                                                <option hidden></option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pOccup">Occupation:</label>  
                                        <input type="text" id="add-doctors-pOccup" name="pOccupation" placeholder="Enter partner occupation" onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pContactNum">Contact Number:</label>
                                        <input type="text" id="add-doctors-pContactNum" name="pContactNum" placeholder="Enter partner contact number" onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pPHNum">Philhealth Number:</label>
                                        <input type="text" id="add-doctors-pPHNum" name="pPhilHealthNum" placeholder="Enter partner philhealth number" onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-pCA">Complete Address:</label>
                                        <input type="text" id="add-doctors-pCA" name="pCompleteAdd" placeholder="Enter partner complete address" onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="add-doctors-buttons">
                            <button className="add-doctors-save-button" >Save</button>
                            <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setShowModal(false); setSelectedDoctor(null); setAddDoctorsInputs({}) } }>Close</button>
                        </div>
                    </form>
                </div>
            </div>
            )}
            {viewHistoryModal && (
                <div className="add-doctors-popup-overlay">
                    <div className="view-Prenatal-History-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setViewHistoryModal(false); } } > X </button>
                        <h2>Prenatal History Record</h2>
                        <div className="view-Prenatal-History-AddFilter">
                            <button onClick={() => setAddHistoryModal(true)}>Add</button>
                            <span>Date Modified:</span>
                            <select>
                                <option hidden></option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                        <form className="add-doctors-form" onSubmit={handleAddDoctorsSubmit}>
                            <div className="view-Prenatal-History-TableWrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date Visit</th>
                                            <th>AOG</th>
                                            <th>BP</th>
                                            <th>PR</th>
                                            <th>HT/WT</th>
                                            <th>Temp</th>
                                            <th>Chief Complain</th>
                                            <th style={{ width: "250px" }}>Nurse/Midwife Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prenatalVisits.map((prenVisit, key) => (
                                        <tr key={key}>
                                            <td>
                                                {prenVisit.DateVisit}
                                            </td>
                                            <td>
                                                {prenVisit.AOG}
                                            </td>
                                            <td>
                                                {prenVisit.BPSystolic}/{prenVisit.BPDiastolic}
                                            </td>
                                            <td>
                                                {prenVisit.PulseRate}
                                            </td>
                                            <td>
                                                {prenVisit.Height}/{prenVisit.Weight}
                                            </td>
                                            <td>
                                                {prenVisit.Temperature}
                                            </td>
                                            <td>
                                                {prenVisit.ChiefComplaint}
                                            </td>
                                            <td>
                                                {prenVisit.Notes}
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setViewHistoryModal(false); } } >Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {addHistoryModal && (
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setAddHistoryModal(false); } } > X </button>
                        <h2>Add Prenatal History Record</h2>
                        <form className="add-doctors-form" onSubmit={submitHistoryRecord}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-date">Date:</label>
                                    <input type="date" id="add-prenatal-history-date" name="dateVisit" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-aog">AOG:</label>
                                    <input type="text" id="add-prenatal-history-aog" name="AOG" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-bp">BP - Systolic:</label>
                                    <input type="text" id="add-prenatal-history-bp" name="BPS" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-bp">BP - Diastolic:</label>
                                    <input type="text" id="add-prenatal-history-bp" name="BPD" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-pr">Pulse Rate:</label>
                                    <input type="text" id="add-prenatal-history-pr" name="PR" required onChange={handleAddHistoryChange} />
                                </div>             
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-ht">Height:</label>
                                    <input type="text" id="add-prenatal-history-ht" name="HT" required onChange={handleAddHistoryChange} />
                                </div>                                
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-wt">Weight:</label>
                                    <input type="text" id="add-prenatal-history-wt" name="WT" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-wt">BMI:</label>
                                    <input type="text" id="add-prenatal-history-bmi" name="BMI" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-temp">Temperature:</label>
                                    <input type="text" id="add-prenatal-history-temp" name="Temp" required onChange={handleAddHistoryChange} />
                                </div> 
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-cc">Chief Complaints:</label>
                                    <input type="text" id="add-prenatal-history-cc" name="ccomplaint" required onChange={handleAddHistoryChange} />
                                </div> 
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-note">Nurse's Midwife Note:</label>
                                    <div className="add-doctors-select-box">
                                    <select name="notes" onChange={handleAddHistoryChange} > 
                                        <option hidden value="">-- Select Note --</option>
                                        {Notes.map((note) => (
                                            <option key={note.ID} value={note.Note}>
                                                {note.Note}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                </div> 
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-save-button" >Save</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setAddHistoryModal(false); } } >Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editDoctorModal && selectedDoctor && (
            
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setEditDoctorModal(false); setSelectedDoctor(null); } }     > X </button>
                        <h2>Edit Doctor</h2>
                        <form className="add-doctors-form" onSubmit={handleEditSubmit}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-firstName">First Name:</label>
                                    <input type="text" id="add-doctors-firstName" name="fName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.FirstName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                    <input type="text" id="add-doctors-middleName" name="MiddleName" value={selectedDoctor.MiddleName} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                    <input type="text" id="add-doctors-lastName" name="lName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LastName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Sex:</label>  
                                    <input type="text" id="add-doctors-lastName" name="sex" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Sex} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-licensingNumber">Licensing Number:</label>
                                    <input type="text" id="add-doctors-licensingNumber" name="licNumber" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LicensingNumber} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Specialty:</label>
                                    <input type="text" id="add-doctors-specialty" name="specialty" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Specialty} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Position:</label>
                                    <input type="text" id="add-doctors-specialty" name="position" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Position} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-homeAddress">Home Address:</label>
                                    <input type="text" id="add-doctors-homeAddress" name="HomeAddress" value={selectedDoctor.HomeAddress} onChange={handleEditDoctorsChange} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-contactNumber">Contact Number:</label>
                                    <input type="text" id="add-doctors-contactNumber" name="ContactNumber" value={selectedDoctor.ContactNumber} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emergencyContact">Emergency Contact Number:</label>
                                    <input type="text" id="add-doctors-emergencyContact" name="EmergencyNumber" value={selectedDoctor.EmergencyNumber} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-userID">Admin ID:</label>  
                                    <input type="text" id="add-doctors-userID" name="AdminID" className="add-doctors-shaded-input" readOnly value={selectedDoctor.AdminID} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emailAddress">Email Address:</label>
                                    <input type="text" id="add-doctors-emailAddress" name="emailAdd" className="add-doctors-shaded-input" readOnly value={selectedDoctor.EmailAddress} />
                                </div>
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-save-button" >Save</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setEditDoctorModal(false); setSelectedDoctor(null); } } >Close</button>
                            </div>
                        </form>
                    </div>
                </div>

            )}

            {/* WINDOW THAT SHOWS 'DELETE BUTTON' OF DOCTOR */}
            {deleteDoctorModal && selectedDoctor && (
            
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setDeleteDoctorModal(false); setSelectedDoctor(null); } }     > X </button>
                        <h2>Confirm Delete</h2>
                        <h4>Are you sure you want to delete this item?</h4>
                            <div className="delete-doctors-buttons">
                                <button className="add-doctors-save-button" onClick={() => deleteDoctor(selectedDoctor) } >Delete</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setDeleteDoctorModal(false); setSelectedDoctor(null); } } >Cancel</button>
                            </div>
                    </div>
                </div>

            )}

        </div>
    );
}

export default Prenatal;