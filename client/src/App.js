import './css/App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import GlobalNavbar from './components/GlobalNavbar';

import CreateBankScreen from './pages/admin/CreateBankScreen';
import CreateCorpScreen from './pages/admin/CreateCorpScreen';
import CustomerMenuScreen from './pages/menus/CustomerMenuScreen';
import ManagerMenuScreen from './pages/menus/ManagerMenuScreen';
import ViewStatsScreen from './pages/admin/stats/ViewStatsScreen';
import ManageUsersScreen from './pages/admin/ManageUsersScreen';
import AdminMenuScreen from './pages/menus/AdminMenuScreen';
import AccountStatsScreen from './pages/admin/stats/AccountStatsScreen';
import BankStatsScreen from './pages/admin/stats/BankStatsScreen';
import CorporationStatsScreen from './pages/admin/stats/CorporationStatsScreen';
import CreateFeeScreen from './pages/admin/CreateFeeScreen';
import CustomerStatsScreen from './pages/admin/stats/CustomerStatsScreen';
import EmployeeStatsScreen from './pages/admin/stats/EmployeeStatsScreen';
import ReplaceManagerScreen from './pages/admin/ReplaceManagerScreen';
import DepositWithdrawScreen from './pages/customer/DepositWithdrawScreen';
import TransferScreen from './pages/customer/TransferScreen';
import HireWorkerScreen from './pages/misc/HireWorkerScreen';
import ManageAccountScreen from './pages/misc/ManageAccountScreen';
import CreateAccountScreen from './pages/admin/CreateAccountScreen';
import ManageOverdraftScreen from './pages/misc/ManageOverdraftScreen';
import PayEmployeesScreen from './pages/misc/PayEmployeesScreen';
import CreateEmployeeRole from './pages/admin/CreateEmployeeRole';
import CreateCustomerRole from './pages/admin/CreateCustomerRole';
import StopEmployeeRole from './pages/admin/StopEmployeeRole';
import StopCustomerRole from './pages/admin/StopCustomerRole';

import LoginScreen from './pages/LoginScreen';
import Home from './pages/Home';

function App() {
  return (
    <>
    <Router>
      <GlobalNavbar/>
      <div>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<LoginScreen/>}/>
              <Route path="/admin-menu" element={<AdminMenuScreen/>}/>
              <Route path="/customer-menu" element={<CustomerMenuScreen/>}/>
              <Route path="/manager-menu" element={<ManagerMenuScreen/>}/>
              <Route path="/account-stats" element={<AccountStatsScreen/>}/>
              <Route path="/bank-stats" element={<BankStatsScreen/>}/>
              <Route path="/corporation-stats" element={<CorporationStatsScreen/>}/>
              <Route path="/create-fee" element={<CreateFeeScreen/>}/>
              <Route path="/customer-stats" element={<CustomerStatsScreen/>}/>
              <Route path="/employee-stats" element={<EmployeeStatsScreen/>}/>
              <Route path="/replace-manager" element={<ReplaceManagerScreen/>}/>
              <Route path="/deposit-withdraw" element={<DepositWithdrawScreen/>}/>
              <Route path="/transfer" element={<TransferScreen/>}/>
              <Route path="/hire-worker" element={<HireWorkerScreen/>}/>
              <Route path="/manage-accounts" element={<ManageAccountScreen/>}/>
              <Route path="/create-accounts" element={<CreateAccountScreen/>}/>
              <Route path="/manage-overdraft" element={<ManageOverdraftScreen/>}/>
              <Route path="/pay-employees" element={<PayEmployeesScreen/>}/>
              <Route path="/view-stats" element={<ViewStatsScreen/>}/>
              <Route path="/corporation-create" element={<CreateCorpScreen/>}/>
              <Route path="/bank-create" element={<CreateBankScreen/>}/>
              <Route path="/manage-users" element={<ManageUsersScreen/>}/>
              <Route path="/create-employee-role" element={<CreateEmployeeRole/>}/>
              <Route path="/create-customer-role" element={<CreateCustomerRole/>}/>
              <Route path="/stop-employee-role" element={<StopEmployeeRole/>}/>
              <Route path="/stop-customer-role" element={<StopCustomerRole/>}/>
          </Routes>
        </div>
    </Router>
    </>
  );
}

export default App;
