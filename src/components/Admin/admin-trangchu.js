// File: admin-trangchu.js
import React from "react";
import AdminHeader from "./admin-header";
import AdminAllAccount from './admin-allaccount';
import AdminCreateAccountAgency from './admin-creaccountagency';
import AdminDepositCustomer from './admin-DepositCustomer';
import AdminApproveDeposit from './admin-duyetdatcoc';
import AdminApproveListings from './admin-duyettindang';
import AdminAgencyBooking from './admin-AgencyBooking';
import AdminViewCompleteBooking from './admin-ViewCompleteBooking';
import Adminmenu from "./admin-menu";
import UserAdmin from '../../list/userIAdmin';
const AdminTrangchu = () => {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    return (
        <div className=''>
              <AdminHeader />
             <Adminmenu
                    userLoginBasicInformationDto={userLoginBasicInformationDto}
                    UserMenu={UserAdmin}
                />
          
            <div>admin-trangchu</div>
            {/* Add other components here */}
        </div>
    );
}

export default AdminTrangchu;
