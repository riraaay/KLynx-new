import Consultation from './pages/Admin/Consultation'
import Patientrecord from './pages/Admin/Patientrecord' 
//import Dashboard from './pages/Admin/Dashboard'   
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Maps from './pages/Admin/Maps'

import Appointment from './pages/Patient/Appointment'
import Dashboard2 from './pages/Patient/Dashboard2'
import Patientrecord2 from './pages/Patient/Patient-Record'
import GeoMap from './pages/Patient/GeoMap'

import Register from './pages/Facepage/register'
import Login from './pages/Facepage/login'
import Logintwo from './pages/Facepage/logintwo'
import ForgotPassword from './pages/Facepage/ForgotPassword'
import Resetpass from './pages/Facepage/resetpass'  
import Entercode from './pages/Facepage/entercode'
import Setnewpass from './pages/Facepage/setnewpass'
import About from './pages/Facepage/about'
import Contact from './pages/Facepage/contact'
import Home from './pages/Facepage/Frontpage'
import Unauthorized from './components/Unauthorized'
import RequireAuth from './components/RequireAuth'
import Prenatal from './pages/Admin/Prenatal'
import UpcomingAppointment from './pages/Admin/upcomingAppt'
import TotalPatient from './pages/Admin/TotPatient'

import Doctors from './pages/Admin/Doctors'


const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}



function App() {
  return (
    <div>
       
          <BrowserRouter>
            <Routes>
              {/* public routes */}
              <Route path="/Unauthorized" element={<Unauthorized />} />
              <Route path='/Login' element={<Login/>} />
              <Route path='/Logintwo' element={<Logintwo/>} />
              <Route path='/Forgot-Password' element={<ForgotPassword/>} />
              <Route path='/resetpass' element={<Resetpass/>} />
              <Route path='/entercode' element={<Entercode/>} />
              <Route path='/setnewpass' element={<Setnewpass/>} />
              <Route path='/About' element={<About/>} />
              <Route path='/Contact' element={<Contact/>} />
              <Route path='/Home' element={<Home/>} />
              <Route path='/Register' element={<Register/>} />

              
    

              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path='/Consultation' element={<Consultation />} />
                <Route path='/Doctors' element={<Doctors/>} />
                <Route path='/Patientrecord' element={<Patientrecord />} />
                <Route path='/Maps' element={<Maps />} />
                <Route path='/Prenatal' element={<Prenatal/>} />
                {/*<Route path='/Dashboard' element={<Dashboard />} />  */}
              </Route>
              

              <Route path='/Appointment' element={<Appointment />} />
              <Route path='/Patient-Dashboard' element={<Dashboard2/>} />
              <Route path='/Patient-Record' element={<Patientrecord2/>} />
              <Route path='/GeoMap' element={<GeoMap/>} />
  
              
              
              
              <Route path="*" element={<Home />} />
              <Route path="/" element={<Home />} />
              
            </Routes>
          </BrowserRouter>
    </div>
  )
}

export default App;