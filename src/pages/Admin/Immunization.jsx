import { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar';
import '../../components/css/GlobalContainer.css';
import '../../components/css/DashboardAlt.css';
import '../../components/css/FileMaintenance.css'
import './Doctors.css'
import axios from 'axios';
import React from 'react';  
import { BiSolidCog, BiSolidBell, BiSolidEdit, BiSolidTrash } from 'react-icons/bi';

const Immunization = () => {

    const [allPatients, setAllPatients] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [addDoctorsInputs, setAddDoctorsInputs] = useState({});
    
    const [doctorsList, setDoctorsList] = useState([]);
  //  const [prenatalPatients, setPrenatalPatients] = useState([]);
    const [immProfiles, setImmProfiles] = useState([]);
    const [viewHistoryModal, setViewHistoryModal] = useState(false);
    const [addHistoryModal, setAddHistoryModal] = useState(false);
    const [immVisits, setImmVisits] = useState([]);
    const [addHistoryInputs, setAddHistoryInputs] = useState({});
    const [editDoctorModal, setEditDoctorModal] = useState(false);
    const [deleteDoctorModal, setDeleteDoctorModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleModalOpen = () =>{
        setShowModal(true);
    }    

    const handleAddDoctorsChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const updatedInputs = { ...addDoctorsInputs, [name]: value };

        if (["birthDate", "pBday", "bday"].includes(name)) {
            const birthDate = new Date(value);
            const today = new Date();

            // Age in years (for birthDate and pBday)
            if (name === "birthDate" || name === "pBday") {
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                const ageField = name === "birthDate" ? "Age" : "pAge";
                updatedInputs[ageField] = age.toString();
            }

            // Age in months (for bday, babies)
            if (name === "bday") {
                const months =
                    (today.getFullYear() - birthDate.getFullYear()) * 12 +
                    (today.getMonth() - birthDate.getMonth());
                updatedInputs["Baby_Age"] = months < 12 ? months : "";
            }
        }

        if (name === "term" && value === "term") {
            updatedInputs.term_weeks = ""; // clear weeks input when term is selected
        }

        if (name === "term_weeks") {
            const numericValue = Number(value);
            if (numericValue >= 20 && numericValue <= 36) {
                setAddDoctorsInputs(prev => ({ ...prev, [name]: value }));
            }
            return;
        }

        setAddDoctorsInputs(updatedInputs);
    };

    const handleAddDoctorsSubmit = (e) =>{
        e.preventDefault();
        console.log(addDoctorsInputs);

        axios.post('http://localhost/api/Imm_Profiles.php', addDoctorsInputs).then(function(response){
            console.log(response.data);
            setSelectedDoctor(null);
            if (response.data.status === 1) {
                const newBabyID = response.data.baby_id;
                
                const updatedInputs = {
                    ...addDoctorsInputs,
                    BabyID_Parents: newBabyID
                };
                console.log("Updated Inputs: ", updatedInputs);
                axios.post('http://localhost/api/Imm_Mothers.php', updatedInputs).then(function(response){
                    console.log("Imm_Mothers:",response.data);
                });

                axios.post('http://localhost/api/Imm_Fathers.php', updatedInputs).then(function(response){
                    console.log("Imm_Fathers:",response.data);
                    setShowModal(false);
                    setAddDoctorsInputs({});
                    getImmProfiles();
                });

            }
    
        });

    }

    function getImmProfiles() {
        axios.get('http://localhost/api/Imm_Profiles.php').then(function(response){
            console.log("Get All Imm Profiles: ", response.data);
            setDoctorsList(response.data);
            setImmProfiles(response.data);
        });
    }

    useEffect( () => {
            getImmProfiles();
    }, []);



    /* Fetches All Patient Info from Patient Creation Page */
    useEffect(() => {
        axios.get("http://localhost/api/Patient.php")
            .then(res => { setAllPatients(res.data); console.log(res.data); })
            .catch(err => console.error(err));
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
        const response = await axios.get(`http://localhost/api/Imm_Visits.php?id=${id}`);
        setImmVisits(response.data);
        setViewHistoryModal(true);
        console.log("Imm Visits: ", response.data);
        
        setAddHistoryInputs((values) => ({ ...values, BabyID: id }));
    }


    const handleAddHistoryChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setAddHistoryInputs(values => ({...values, [name]: value}));
    }

    const submitHistoryRecord = (e) => {
        e.preventDefault();
        console.log("addHistoryInputs consists of: ", addHistoryInputs);
        const babyId = addHistoryInputs.BabyID;

        axios.post('http://localhost/api/Imm_Visits.php', addHistoryInputs).then(function(response){
            console.log(response.data);
            setAddHistoryModal(false);

            setAddHistoryInputs({});
            viewHistory(babyId);
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
        axios.delete(`http://localhost/api/imm_fathers.php?id=${id}`).then(function(response){
            console.log(response.data);
        });
        axios.delete(`http://localhost/api/imm_mothers.php?id=${id}`).then(function(response){
            console.log(response.data);
        });
        axios.delete(`http://localhost/api/imm_profiles.php?id=${id}`).then(function(response){
            console.log(response.data);
        });
        axios.delete(`http://localhost/api/imm_visits.php?id=${id}`).then(function(response){
            console.log(response.data);
            getImmProfiles();
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
                        <h1>Immunization</h1>
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
                                <th>Baby ID</th>
                                <th>Patient ID</th>
                                <th>Family ID</th>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>Date Created</th>
                                <th colSpan="3">Record</th>
                            </tr>
                        </thead>
                        <tbody>
                            {immProfiles.map((immProf, key) => (
                            <tr key={key}>
                                <td>
                                    {immProf.BabyID}
                                </td>
                                <td>
                                    {immProf.PatientID}
                                </td>
                                <td>
                                    {immProf.FamilyID}
                                </td>
                                <td>
                                    {immProf.LastName}
                                </td>
                                <td>
                                    {immProf.FirstName}
                                </td>
                                <td>
                                    {immProf.DateCreated}
                                </td>
                                <td>
                                    <button onClick={() => viewHistory(immProf.BabyID) }>View History</button>
                                </td>
                                <td>
                                    <button onClick={() => editDoctor(prenProf.PatientID) } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Edit" >
                                    <BiSolidEdit className="FileMaintenance-TableIcon FileMaintenance-IconEdit" />  </button>
                                </td>
                                <td>
                                    <button onClick={() => { setSelectedDoctor(immProf.BabyID); setDeleteDoctorModal(true); } } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Delete" >
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
                    <h2>New Immunization Profile (Baby)</h2>
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
                                <label htmlFor="add-doctors-famid">Family ID:</label>  
                                <input type="text" id="add-doctors-famid" name="famID" placeholder="Select patient id" value={addDoctorsInputs.famID || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                <input type="text" id="add-doctors-lastName" name="baby_last_name" placeholder="Select patient id" value={addDoctorsInputs.lName || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-firstName">First Name:</label>
                                <input type="text" id="add-doctors-firstName" name="baby_first_name" placeholder="Select patient id" value={addDoctorsInputs.fName || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                <input type="text" id="add-doctors-middleName" name="baby_middle_name" placeholder="Select patient id" value={addDoctorsInputs.mName || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-aim">Age in Months:</label>
                                <input type="text" id="add-doctors-aim" name="Baby_Age" required readOnly className="add-doctors-shaded-input" value={addDoctorsInputs.Baby_Age || ""} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-birthday">Birthday:</label>
                                <input type="date" id="add-doctors-birthday" name="bday" value={addDoctorsInputs.bday || ""} required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <div className="add-doctors-gender-box">
                                    <h3>Sex:</h3>
                                    <div className="add-doctors-gender-option">
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-male" name="baby_sex" checked={addDoctorsInputs.baby_sex === "Male"} value="Male" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-male">Male</label>
                                        </div>
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-female" name="baby_sex" checked={addDoctorsInputs.baby_sex === "Female"} value="Female" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-female">Female</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-tob">Time of Birth:</label>
                                <input type="time" id="add-doctors-tob" name="timeOfBirth" placeholder="Enter time of birth" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-bweight">Birth Weight (kg):</label>
                                <input type="number" id="add-doctors-bweight" name="birthWeight" step="0.01" min="0" placeholder='0.00' required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-bheight">Birth Height (cm):</label>
                                <input type="number" id="add-doctors-bheight" name="birthHeight" step="0.1" min="0" placeholder='0.0' required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-birthAttendedBy">Birth Attended By:</label>
                                <div className="add-doctors-select-box">
                                    <select name="birthAttendedBy" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select Birth Attended By --</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Midwife">Midwife</option>
                                        <option value="Nurse">Nurse</option>
                                        <option value="Traditional Birth Attendant">Traditional Birth Attendant</option>
                                        <option value="Family Member">Family Member</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-nbs" title="Newborn Screening">Civil Status:</label>
                                <div className="add-doctors-select-box">
                                    <select name="nbs" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select NBS --</option>
                                        <option value="Done">Done</option>
                                        <option value="Not Done">Not Done</option>
                                    </select>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-nbs" title="Bacillus Calmette–Guérin Vaccine">BCG:</label>
                                <div className="add-doctors-select-box">
                                    <select name="bcg" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select BCG --</option>
                                        <option value="Done">Given</option>
                                        <option value="Not Given">Not Given</option>
                                    </select>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-nbs" title="Hepatitis B Vaccine">HepB:</label>
                                <div className="add-doctors-select-box">
                                    <select name="hepb" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select HepB --</option>
                                        <option value="Give at Birth">Given at Birth</option>
                                        <option value="Give">Given</option>
                                        <option value="Not Given">Not Given</option>
                                    </select>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-vitK" title="Vitamin K">Vit K:</label>
                                <div className="add-doctors-select-box">
                                    <select name="vitK" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select Vit K --</option>
                                        <option value="Give">Given</option>
                                        <option value="Not Given">Not Given</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <div className="add-doctors-gender-box">
                                    <h3>Type of Birth:</h3>
                                    <div className="add-doctors-gender-option">
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-nsd" name="type_of_birth" checked={addDoctorsInputs.type_of_birth === "NSD"} value="NSD" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-nsd" title="Normal Spontaneous Delivery">NSD</label>
                                        </div>
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-cs" name="type_of_birth" checked={addDoctorsInputs.type_of_birth === "CS"} value="CS" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-cs" title="Cesarean Section">C/S</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <div className="add-doctors-gender-box">
                                    <h3>Gestational Age at Birth:</h3>
                                    <div className="add-doctors-gender-option">
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-term" name="term" checked={addDoctorsInputs.term === "term"} value="term" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-term">Term</label>
                                        </div>
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-premature" name="term" checked={addDoctorsInputs.term === "premature"} value="premature" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-premature">Premature</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-termWeeks">Weeks:</label>
                                <input type="number" id="add-doctors-termWeeks" name="term_weeks" min="20" max="36" step="1" required={addDoctorsInputs.term === "premature"} disabled={addDoctorsInputs.term !== "premature"} value={addDoctorsInputs.term_weeks || ""} className={addDoctorsInputs.term === "term" ? "add-doctors-shaded-input" : ""} onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-placeofbirth">Place of Birth:</label>
                                <input type="text" id="add-doctors-placeofbirth" name="place_of_birth" placeholder="e.g. City or Address" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <div className="add-doctors-gender-box">
                                    <h3>Facility Ownership:</h3>
                                    <div className="add-doctors-gender-option">
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-public" name="facility_ownership" checked={addDoctorsInputs.facility_ownership === "public"} value="public" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-public">Public</label>
                                        </div>
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-private" name="facility_ownership" checked={addDoctorsInputs.facility_ownership === "private"} value="private" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-private">Private</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <div className="add-doctors-gender-box">
                                    <h3>Facility Type:</h3>
                                    <div className="add-doctors-gender-option">
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-hospital" name="facility_type" checked={addDoctorsInputs.facility_type === 'hospital'} value="hospital" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-hospital">Hospital</label>
                                        </div>
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-lyingIn" name="facility_type" checked={addDoctorsInputs.facility_type === 'lying-in'} value="lying-in" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-lyingIn">Lying In</label>
                                        </div>
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-others" name="facility_type" checked={addDoctorsInputs.facility_type === 'others'} value="others" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-others">Others</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="facility_name">Facility Name:</label>
                                <input type="text" id="facility_name" name="facility_name" placeholder="Enter facility name" value={addDoctorsInputs.facility_name || ''} required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <h2 style={{ marginTop: "2.6em" }}>Father's Information</h2>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherLastName">Last Name:</label>
                                <input type="text" id="add-doctors-fatherLastName" name="father_last_name" placeholder="Enter father's last name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherFirstName">First Name:</label>
                                <input type="text" id="add-doctors-fatherFirstName" name="father_first_name" placeholder="Enter father's first name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherMiddleName">Middle Name:</label>
                                <input type="text" id="add-doctors-fatherMiddleName" name="father_middle_name" placeholder="Enter father's middle name" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherAge">Age:</label>  
                                <input type="text" id="add-doctors-fatherAge" name="pAge" readOnly className="add-doctors-shaded-input" placeholder="Select father's birthdate" required onChange={handleAddDoctorsChange} value={addDoctorsInputs.pAge || ""} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherBirthday">Birthday:</label>
                                <input type="date" id="add-doctors-fatherBirthday" name="pBday" value={addDoctorsInputs.pBday || ""} required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherCivilStatus">Civil Status:</label>
                                <div className="add-doctors-select-box">
                                    <select name="father_civilStatus" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select Civil Status --</option>
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
                                <label htmlFor="add-doctors-fatherOccupation">Occupation:</label>
                                <input type="text" id="add-doctors-fatherOccupation" name="father_occupation" placeholder="Enter father's occupation" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherEducAttainment">Educational Attainment:</label>
                                <div className="add-doctors-select-box">
                                    <select name="father_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select education level --</option>
                                        <option value="No Formal Education">No Formal Education</option>
                                        <option value="Elementary Level">Elementary Level</option>
                                        <option value="Elementary Graduate">Elementary Graduate</option>
                                        <option value="High School Level">High School Level</option>
                                        <option value="High School Graduate">High School Graduate</option>
                                        <option value="College Level">College Level</option>
                                        <option value="College Graduate">College Graduate</option>
                                        <option value="Vocational Graduate">Vocational Graduate</option>
                                        <option value="Post-Graduate">Post-Graduate</option>
                                    </select>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherContactNum">Contact Number:</label>
                                <input type="text" id="add-doctors-fatherContactNum" name="father_contact_num" pattern="^(09|\+639)\d{9}$" placeholder="09XXXXXXXXX" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div> 
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fatherPhilHealthNum">Father’s PhilHealth No:</label>
                                <input type="text" id="add-doctors-fatherPhilHealthNum" name="father_philhealth_num" placeholder="12-345678901-2" pattern="^\d{2}-\d{9}-\d{1}$" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <h2 style={{ marginTop: "2.6em" }}>Mother's Information</h2>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherLastName">Last Name:</label>
                                <input type="text" id="add-doctors-motherLastName" name="mother_last_name" placeholder="Enter mother's last name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherFirstName">First Name:</label>
                                <input type="text" id="add-doctors-motherFirstName" name="mother_first_name" placeholder="Enter mother's first name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherMiddleName">Middle Name:</label>
                                <input type="text" id="add-doctors-motherMiddleName" name="mother_middle_name" placeholder="Enter mother's middle name" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherAge">Age:</label>  
                                <input type="text" id="add-doctors-motherAge" name="Age" readOnly className="add-doctors-shaded-input" placeholder="Select mother's birthdate" required onChange={handleAddDoctorsChange} value={addDoctorsInputs.Age || ""} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherBirthday">Birthday:</label>
                                <input type="date" id="add-doctors-motherBirthday" name="birthDate" value={addDoctorsInputs.birthDate || ""} required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherCivilStatus">Civil Status:</label>
                                <div className="add-doctors-select-box">
                                    <select name="mother_civilStatus" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select Civil Status --</option>
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
                                <label htmlFor="add-doctors-motherOccupation">Occupation:</label>
                                <input type="text" id="add-doctors-motherOccupation" name="mother_occupation" placeholder="Enter mother's occupation" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherEducAttainment">Educational Attainment:</label>
                                <div className="add-doctors-select-box">
                                    <select name="mother_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select education level --</option>
                                        <option value="No Formal Education">No Formal Education</option>
                                        <option value="Elementary Level">Elementary Level</option>
                                        <option value="Elementary Graduate">Elementary Graduate</option>
                                        <option value="High School Level">High School Level</option>
                                        <option value="High School Graduate">High School Graduate</option>
                                        <option value="College Level">College Level</option>
                                        <option value="College Graduate">College Graduate</option>
                                        <option value="Vocational Graduate">Vocational Graduate</option>
                                        <option value="Post-Graduate">Post-Graduate</option>
                                    </select>
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherContactNum">Contact Number:</label>
                                <input type="text" id="add-doctors-motherContactNum" name="mother_contact_num" pattern="^(09|\+639)\d{9}$" placeholder="09XXXXXXXXX" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherTDStatus" title="Tetanus Diphtheria Status">TD Status:</label>
                                <div className="add-doctors-select-box">
                                    <select name="mother_td_status" id="add-doctors-motherTDStatus" required onChange={handleAddDoctorsChange} > 
                                        <option hidden value="">-- Select TD Status --</option>
                                        <option value="TD1">TD1</option>
                                        <option value="TD2">TD2</option>
                                        <option value="TD3">TD3</option>
                                        <option value="TD4">TD4</option>
                                        <option value="TD5">TD5</option>
                                        <option value="Complete">Complete</option>
                                        <option value="Not yet vaccinated">Not yet vaccinated</option>
                                    </select>
                                </div>
                            </div>
                            <div className="add-doctors-input-box" title="Total Pregnancies">
                                <label htmlFor="add-doctors-motherGravida">Gravida:</label>
                                <input type="number" id="add-doctors-motherGravida" name="mother_gravida" min="0" placeholder="e.g. 3" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherPara" title="Number of births at 20 weeks or more">Para:</label>
                                <input type="number" id="add-doctors-motherPara" name="mother_para" min="0" placeholder="e.g. 2" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherFeedingType">Type of Feeding:</label>
                                <div className="add-doctors-select-box">
                                    <select name="mother_feeding_type" id="add-doctors-motherFeedingType" required onChange={handleAddDoctorsChange} >
                                        <option hidden value="">-- Select Type of Feeding --</option>
                                        <option value="Breastfeeding">Breastfeeding</option>
                                        <option value="Formula Feeding">Formula Feeding</option>
                                        <option value="Mixed Feeding">Mixed Feeding</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherPhilHealthNum">Mother’s PhilHealth No:</label>
                                <input type="text" id="add-doctors-motherPhilHealthNum" name="mother_philhealth_num" placeholder="12-345678901-2" pattern="^\d{2}-\d{9}-\d{1}$" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-motherCompleteAddress">Complete Address:</label>
                                <input type="text" id="add-doctors-motherCompleteAddress" name="mother_complete_address" placeholder="e.g. Purok 5, Brgy. San Isidro, Cainta" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
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
                        <h2>Immunization History Record</h2>
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
                                            <th>Age in Months</th>
                                            <th>Height</th>
                                            <th>Weight</th>
                                            <th>Temp</th>
                                            <th>FP Method</th>
                                            <th>Antigen</th>
                                            <th style={{ width: "250px" }}>Vaccinator's Name & Signature</th>
                                            <th>Date for Next Visit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {immVisits.map((immVisit, key) => (
                                        <tr key={key}>
                                            <td>
                                                {immVisit.DateVisit}
                                            </td>
                                            <td>
                                                {immVisit.AgeInMonths}
                                            </td>
                                            <td>
                                                {immVisit.Height}
                                            </td>
                                            <td>
                                                {immVisit.Weight}
                                            </td>
                                            <td>
                                                {immVisit.Temperature}
                                            </td>
                                            <td>
                                                {immVisit.FPMethod}
                                            </td>
                                            <td>
                                                {immVisit.Antigen}
                                            </td>
                                            <td>
                                                {immVisit.VaccinatorsNameSignature}
                                            </td>
                                            <td>
                                                {immVisit.DateNextVisit}
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
                        <h2>Add Immunization History Record</h2>
                        <form className="add-doctors-form" onSubmit={submitHistoryRecord}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-immunization-history-date">Date:</label>
                                    <input type="date" id="add-immunization-history-date" name="dateVisit" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-immunization-history-aim">Age In Months:</label>
                                    <input type="number" id="add-immunization-history-aim" name="AIM" min="0" max="60" placeholder="e.g. 3" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-immunization-history-bp">Height (cm):</label>
                                    <input type="number" id="add-immunization-history-bp" name="HT" step="0.1" min="30" max="120" placeholder="e.g. 65.5 cm"  required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-bp">Weight (kg):</label>
                                    <input type="number" id="add-prenatal-history-bp" name="WT" step="0.1" min="1" max="30" placeholder="e.g. 6.8 kg" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-pr">Temperature:</label>
                                    <input type="number" id="add-prenatal-history-pr" name="Temp" step="0.1" min="34" max="42" placeholder="e.g. 36.5 °C" required onChange={handleAddHistoryChange} />
                                </div>             
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-fp" title="Family Planning Method">FP Method:</label>
                                <div className="add-doctors-select-box">
                                    <select name="FPMethod" id="add-doctors-fp" required onChange={handleAddHistoryChange} >
                                        <option hidden value="">-- Select FP Method --</option>
                                        <option value="Pills">Pills</option>
                                        <option value="Injectables">Injectables</option>
                                        <option value="IUD" title="Intrauterine Device">IUD</option>
                                        <option value="Condom">Condom</option>
                                        <option value="Implant">Implant</option>
                                        <option value="Natural">Natural</option>
                                        <option value="None">None</option>
                                    </select>
                                </div>
                            </div>                             
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-antigen">Antigen:</label>
                                    <div className="add-doctors-select-box">
                                        <select name="Antigen" id="add-doctors-antigen" required onChange={handleAddHistoryChange} >
                                            <option hidden value="">-- Select Antigen --</option>
                                            <option value="BCG">BCG (Tuberculosis)</option>
                                            <option value="HepB">Hepatitis B</option>
                                            <option value="DPT">DPT (Diphtheria, Pertussis, Tetanus)</option>
                                            <option value="OPV">OPV (Oral Polio Vaccine)</option>
                                            <option value="IPV">IPV (Inactivated Polio Vaccine)</option>
                                            <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
                                            <option value="Td">Td (Tetanus, Diphtheria)</option>
                                            <option value="Hib">Hib (Haemophilus influenzae type b)</option>
                                            <option value="PCV">PCV (Pneumococcal Conjugate Vaccine)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-temp">Vaccinator’s Name & Signature:</label>
                                    <input type="text" id="add-prenatal-history-temp" name="VNameSig" required onChange={handleAddHistoryChange} />
                                </div> 
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-cc">Date for Next Visit:</label>
                                    <input type="date" id="add-prenatal-history-cc" name="DateNextVisit" required onChange={handleAddHistoryChange} />
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

export default Immunization;