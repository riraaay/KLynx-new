import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import './Calendar.css';
import Sidebar from '../../components/Sidebar';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const weekdaysMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,  
  Saturday: 6,
};

function AvailabilityModal({ onClose, onAdd }) {
  const [doctor, setDoctor] = useState('');
  const [status, setStatus] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [repeatDays, setRepeatDays] = useState([]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const labels = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];

  const toggleRepeatDay = (day) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const slots = repeat
      ? repeatDays.map((dayIdx) => {
          const timeStr = startDate.toTimeString().slice(0, 5);
          return {
            doctor,
            day: daysOfWeek[dayIdx],
            time: allDay ? '00:00' : timeStr,
            allDay,
            status,
          };
        })
      : [
          {
            doctor,
            dateTime: startDate,
            status,
            allDay,
          },
        ];

    onAdd(slots);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Schedule</h2>
        <form onSubmit={handleSubmit}>
          <label>Doctor:</label>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
            <option hidden value="">Select</option>
            <option value="Smith">Dr. Smith</option>
            <option value="Berna">Dr. Mabitado</option>
            <option value="Claribel">Dr. Bintulan</option>
          </select>

          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option hidden value="">Select</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="vacation">Vacation</option>
          </select>

          <label>
            <input type="checkbox" checked={allDay} onChange={() => setAllDay(!allDay)} />
            All Day
          </label>

          <label>Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect={!allDay}
            timeIntervals={15}
            dateFormat="yyyy-MM-dd h:mm aa"
          />

          <label>
            <input type="checkbox" checked={repeat} onChange={() => setRepeat(!repeat)} />
            Repeat
          </label>

          {repeat && (
            <>
              <label>Day/s:</label>
              <div className="checkbox-group">
                {labels.map((label, idx) => (
                  <label key={idx} style={{ marginRight: '10px' }}>
                    <input
                      type="checkbox"
                      checked={repeatDays.includes(idx)}
                      onChange={() => toggleRepeatDay(idx)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}
function AppointmentModal({ onClose, onSave, availability }) {
  const [formData, setFormData] = useState({
    doctor: '',
    patient: '',
    status: '',
    date: new Date(),
  });

  const availableSlots = useMemo(() => {
    if (!formData.doctor) return [];

    const matches = [];

    availability
      .filter((a) => a.doctor === formData.doctor)
      .forEach(({ day, time }) => {
        const targetDay = weekdaysMap[day];
        const [hour, minute] = time.split(':').map(Number);

        for (let i = 0; i < 30; i++) {
          const base = new Date();
          base.setDate(base.getDate() + i);
          if (base.getDay() === targetDay) {
            const slot = new Date(base);
            slot.setHours(hour, minute, 0, 0);
            matches.push(slot);
          }
        }
      });

    return matches;
  }, [formData.doctor, availability]);

  const isDateAvailable = (date) =>
    availableSlots.some((slot) => slot.toDateString() === date.toDateString());

  const filterTime = (time) =>
    availableSlots.some(
      (slot) =>
        slot.toDateString() === formData.date.toDateString() &&
        slot.getHours() === time.getHours() &&
        slot.getMinutes() === time.getMinutes()
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label>Doctor:</label>
          <select
            value={formData.doctor}
            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
            required
          >
            <option hidden value="">Select</option>
            <option value="Smith">Dr. Smith</option>
            <option value="Berna">Dr. Mabitado</option>
            <option value="Claribel">Dr. Bintulan</option>
          </select>

          <label>Patient:</label>
          <input
            type="text"
            value={formData.patient}
            onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
            required
          />

          <label>Status:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
          >
            <option hidden value="">Select</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>

          <label>Date & Time:</label>
          <DatePicker
            selected={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
            showTimeSelect
            timeIntervals={15}
            filterDate={isDateAvailable}
            filterTime={filterTime}
            dateFormat="yyyy-MM-dd h:mm aa"
            placeholderText="Choose from availability"
          />

          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentCalendar() {
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const addAppointment = (appt) =>
    setAppointments((prev) => [...prev, appt]);

  const calendarEvents = appointments.map((appt, idx) => ({
    id: idx,
    title: `${appt.doctor} → ${appt.patient} (${appt.status})`,
    start: new Date(appt.date),
    end: new Date(new Date(appt.date).getTime() + 60 * 60 * 1000),
  }));

  // Settings and Notifications
  
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showManageAccount, setShowManageAccount] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
  
    const [showAddAdmin, setShowAddAdmin] = useState(false);

    const [generalDetails, setGeneralDetails] = useState({
    name: '',
    username: '',
    contact: '',
    password: ''
});

const handleSave = () => {
    // Save the updated details to local storage
    localStorage.setItem('accountDetails', JSON.stringify(generalDetails));
    alert('Account details saved successfully!');
    setShowManageAccount(false);
  };

  // Admin Account Management
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [adminAccounts, setAdminAccounts] = useState([]);
  
    const HandleAddAdmin = async () => {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
  
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('username', username);
      formData.append('password', password);
  
      try {
        const response = await fetch('http://localhost/OneCaintaRecord/insertAdminAccount.php', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const result = await response.text();
          console.log(result);
          // Optionally, update the adminAccounts state to reflect the new admin account
          setAdminAccounts([...adminAccounts, { fullName, username }]);
          // Clear the form fields
          setFullName('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
        } else {
          console.error('Failed to add admin');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
  // Handle input changes for account management
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGeneralDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value
    }));
  };


  return (
    <div className='container'>
       <div className="navbar">
        <Sidebar />
      </div>

      <div className='main'>
            <div className="header">
          <h2>
             Appointment Calendar
          </h2>
          <div className="icon">
          <div className="icon">
           <i
              className="fas fa-bell"
              id="notif"
              onClick={() => setShowNotifications(!showNotifications)}
            ></i>
            <i
              className="fas fa-cog"
              id="settings"
              onClick={() => setShowSettings(!showSettings)}
            ></i>
          </div>

          {showNotifications && (
            <div className="dropdown notifications-dropdown">
              <ul>
                <li>New disease alert: Dengue</li>
                <li>System maintenance scheduled</li>
                <li>Weekly report available</li>
              </ul>
            </div>
          )}
          {showSettings && (
            <div className="dropdown settings-dropdown">
              <ul>
                <li onClick={() => setShowManageAccount(true)}>Manage Account</li>
                <li onClick={() => setShowTerms(true)}>Terms and Condition</li>
                <li onClick={() => setShowAddAdmin(true)}>Add Admin Account</li>
              </ul>
            </div>
          )}
          </div>
        </div>

        <div className='container'>
          {showManageAccount && (
                       <div className="modal">
                       <div className="modal-content">
                           <h2>Manage Account</h2>
                           <button className="close" onClick={() => setShowManageAccount(false)}>
                               &times;
                           </button>
                           <div className="modal-section">
                               <h3>General Details</h3>
                               <form>
                                   <label>
                                       Complete Name:
                                       <input
                                           type="text"
                                           name="name"
                                           value={generalDetails.name}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Username:
                                       <input
                                           type="text"
                                           name="username"
                                           value={generalDetails.username}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Contact NO.:
                                       <input
                                           type="text"
                                           name="contact"
                                           value={generalDetails.contact}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Password:
                                       <input
                                           type="password"
                                           name="password"
                                           value={generalDetails.password}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                               </form>
                                <button className="cancel" onClick={() => setShowManageAccount(false)}>Cancel</button>
                               <button className="save" onClick={handleSave}>Save Changes</button>
                           </div>
                       </div>
                   </div>



      )}

      {showAddAdmin && (
        <div className="modal">
          <div className="modal-content">

            <h3>Add Admin Account</h3>
                <button className="close"
                  onClick={() => setShowAddAdmin(false)}
                >
                  &times;
                </button>
          <div className="modal-section">

            <input 
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="Full Name"
             required 
            />

            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 

             />
            <button onClick={HandleAddAdmin}>Add Admin</button>

            {/* Sample output para makita if nag sasave yung admin account
            <h3>Admin Accounts(Sample lang to check if nag aadd)</h3>
            <ul>
                {adminAccounts.map((account, index) => (
                    <li key={index}>{account.username}</li>
                ))}
            </ul> */}


              </div>

              </div>
            </div>
            )}  

      {showTerms && (
            <div className="modal">
              <div className="modal-content">
                <h2>Terms & Conditions</h2>
                <button className="close"
                  onClick={() => setShowTerms(false)}
                >
                  &times;
                </button>
                <div className="modal-section">
                  <p>
                    By using this system, you agree to our terms and conditions...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>


    <div style={{ padding: '20px' }}>
    
      <button onClick={() => setShowAppointment(true)}>Set Appointment</button>
      <button onClick={() => setShowAvailabilityModal(true)} style={{ marginLeft: '10px' }}>
        Set Doctor Availability
      </button>

      {showAppointment && (
        <AppointmentModal
          onClose={() => setShowAppointment(false)}
          onSave={addAppointment}
          availability={availability}
        />
      )}

      {showAvailabilityModal && (
        <AvailabilityModal
          onClose={() => setShowAvailabilityModal(false)}
          onAdd={(slots) => setAvailability((prev) => [...prev, ...slots])}
        />
      )}

      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, marginTop: '20px' }}
        views={['month', 'week', 'day', 'agenda']}
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        />
        </div>
      </div>
    </div>

  );
}