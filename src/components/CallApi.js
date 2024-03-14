import axios from 'axios';

const BASE_URL = 'http://firstrealestate-001-site1.anytempurl.com/api';

// A utility function to handle API requests with `withCredentials` option and additional headers included by default
const fetchApiData = async (url) => {
    try {
        const response = await axios.get(url, { 
            withCredentials: false,
            
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from: ${url}`, error);
        return null;
    }
};

class CallApi {
    // Your class methods remain unchanged
    static getAllReservations() {
        return fetchApiData(`${BASE_URL}/reservation/GetAllReservation`);
    }

    static getAllRealEstate() {
        return fetchApiData(`${BASE_URL}/invester/getAllRealEstate`);
    }

    static getAllAccount() {
        return fetchApiData(`${BASE_URL}/admin/getAllAccount`);
    }

    static getAllDirect() {
        return fetchApiData(`${BASE_URL}/direct/getAllDirect`);
    }

    static getAllPayMent() {
        // Since this is an external URL, check if withCredentials is applicable or needed
        return fetchApiData('https://script.googleusercontent.com/macros/echo?user_content_key=JPPSQ-fot0J0W9wj8yXHWkwPtJfFOgDwaki7KoH__NkhHNKlGpJ_H3L_IXiCrPzykz3xWCkiXfCDKQnQPGIdhktQJkVynN4fm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnEdV-cB_VcJYh-rThqV7h8GNPA--8n4PWO8ONvoG2LKHDSU-2n4lGV_Y-LbotBxADHIex1tkTLww5QZfCIS2f6d6sJ333kZUNtz9Jw9Md8uu&lib=Me84qEHdJVNIFNFlpsmPH2c5RV3tBGefZ');
    }

    static getAllReservationAdmin() {
        return fetchApiData(`${BASE_URL}/admin/GetAllReservation`);
    }

    static getAllRole() {
        return fetchApiData(`${BASE_URL}/role/getAllRole`);
    }

    static getAllWallet() {
        return fetchApiData(`${BASE_URL}/Wallet/GetAllWallet`);
    }

    static getAllWalletHistory() {
        return fetchApiData(`${BASE_URL}/WalletHistory/GetAllWalletHistory`);
    }

    static getAllLocation() {
        return fetchApiData(`${BASE_URL}/location/getAllLocation`);
    }

    static GetAllReservationTime() {
        return fetchApiData(`${BASE_URL}/ReservationTime/GetAllReservationTime`);
    }

    static findReservationById(reservationData, id) {
        if (!reservationData) return null;
        return reservationData.find(reservation => reservation.customerId === id);
    }
}

export default CallApi;
