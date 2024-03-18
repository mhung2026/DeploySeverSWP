import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast từ thư viện react-toastify
import 'react-toastify/dist/ReactToastify.css';

const statusOptions = [
    { value: 1, label: 'Đang xử lý' },
    { value: 2, label: 'Mở bán' },
];

export default function Agencyduyettindang() {
    const [realEstates, setRealEstates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [unsavedChanges, setUnsavedChanges] = useState({});
    const [unsavedEstateIds, setUnsavedEstateIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRealEstates = async () => {
            try {
                const response = await axios.get('http://swprealestatev2-001-site1.etempurl.com/api/invester/getAllRealEstate');
                // const filteredRealEstates = response.data
                const filteredRealEstates = response.data.filter(realEstate => realEstate.status !== 0);
                setRealEstates(filteredRealEstates);
            } catch (error) {
                console.error('Error fetching real estates:', error);
            }
        };

        fetchRealEstates();
    }, []);

    const getLocationDetails = async (locationId) => {
        try {
            const response = await axios.get(`http://swprealestatev2-001-site1.etempurl.com/api/location/getAllLocation`);
            const locationDetails = response.data.find(location => location.id === locationId);
            return locationDetails || null;
        } catch (error) {
            console.error('Error fetching location details:', error);
            return null;
        }
    };

    const getRealEstateDetails = async (realEstateId) => {
        try {
            const realEstateDetails = realEstates.find(item => item.id === realEstateId);
            const locationDetails = await getLocationDetails(realEstateDetails.locationId);

            const filteredRealEstateDetails = { ...realEstateDetails };
            delete filteredRealEstateDetails.id;
            delete filteredRealEstateDetails.firebaseId;
            delete filteredRealEstateDetails.investorId;
            delete filteredRealEstateDetails.direct;
            delete filteredRealEstateDetails.investor;
            delete filteredRealEstateDetails.location;
            delete filteredRealEstateDetails.pay;

            filteredRealEstateDetails.listRealEstateImageUrl = filteredRealEstateDetails.realEstateImages;
            delete filteredRealEstateDetails.realEstateImages;

            if (locationDetails) {
                filteredRealEstateDetails.ward = locationDetails.ward;
                filteredRealEstateDetails.district = locationDetails.district;
                filteredRealEstateDetails.city = locationDetails.city;
            }

            console.log("Thông tin bất động sản có id", realEstateId, ":", filteredRealEstateDetails);
            return filteredRealEstateDetails;
        } catch (error) {
            console.error('Error fetching real estate details:', error);
            return null;
        }
    };
    const updateStatus = async (realEstateId, newStatus) => {
        try {
            // Get the current details of the real estate
            const realEstateToUpdate = await getRealEstateDetails(realEstateId);
            console.log("Real estate details before status change:");
            console.log(realEstateToUpdate);
    
            // Update the local state
            setRealEstates(prevRealEstates => prevRealEstates.map(realEstate =>
                realEstate.id === realEstateId ? { ...realEstate, status: newStatus } : realEstate));
    
            // Prepare the updated data
            const updatedData = { ...realEstateToUpdate, status: newStatus };
            console.log('Updating status to', newStatus, 'for real estate ID:', realEstateId);
    
            // API call to update the status in the backend
            await axios.put(`http://swprealestatev2-001-site1.etempurl.com/api/invester/updatePostById/${realEstateId}`, updatedData);
    
            // Update unsaved changes
            setUnsavedChanges(prevUnsavedChanges => ({
                ...prevUnsavedChanges,
                [realEstateId]: updatedData
            }));
    
            // Add real estate ID to unsaved list if not already present
            if (!unsavedEstateIds.includes(realEstateId)) {
                setUnsavedEstateIds(prevIds => [...prevIds, realEstateId]);
            }
    
            // Success toast
            toast.success('Status update successful!');
        } catch (error) {
            console.error('Error updating real estate status:', error);
            toast.error('Failed to update status. Please try again later!');
        }
    };
    
    // Handle delete by setting status to 0
    const handleDelete = async (realEstateId) => {
        await updateStatus(realEstateId, 0);
    };
    
    // Handle status change for other statuses
    const handleStatusChange = async (event, realEstateId) => {
        const newStatus = event.target.value;
        await updateStatus(realEstateId, newStatus);
    };

    const handleSaveData = async () => {
        try {
            // Lưu từng bất động sản có thay đổi
            await Promise.all(unsavedEstateIds.map(async (estateId) => {
                const updateData = unsavedChanges[estateId];
                if (updateData) {
                    console.log("Dữ liệu cần gửi đi:", updateData);

                    try {
                        await axios.put(`http://swprealestatev2-001-site1.etempurl.com/api/invester/updatePostById/${estateId}`, updateData);
                        console.log('Dữ liệu của bất động sản có ID', estateId, 'đã được cập nhật thành công!');
                    } catch (error) {
                        console.error('Error updating real estate data:', error);
                    }
                }
            }));

            // Đánh dấu rằng tất cả thay đổi đã được lưu
            setUnsavedChanges({});
            setUnsavedEstateIds([]);
            // Thông báo lưu thành công
            toast.success('Tất cả các thay đổi đã được lưu thành công!');
        } catch (error) {
            console.error('Error saving real estate data:', error);
            // Thông báo lỗi khi không thể lưu
            toast.error('Lưu thất bại. Vui lòng thử lại sau!');
        }
    };

    const handleNavigateAndSendId = (realEstateId) => {
        navigate(`/thongtinbatdongsan/${realEstateId}`);
    };

    // Hàm để lọc bất động sản theo tên
    const filteredRealEstates = realEstates.filter(realEstate =>
        realEstate.realestateName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="outer-container">
            <div className='container'>
                <div className='col-md-9 danhsachbdscanduyet'>
                    <h1>Danh sách bất động sản cần được duyệt</h1>
                    <input
                        type="text"
                        placeholder="Nhập tên bất động sản để lọc"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleNavigateAndSendId('')} style={{ cursor: 'pointer' }}>Tên bất động sản</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRealEstates.map(realEstate => (
                                    <tr key={realEstate.id} className='danhsachbdscanduyettheobds'>
                                        <td onClick={() => handleNavigateAndSendId(realEstate.id)} style={{ cursor: 'pointer' }}>{realEstate.realestateName}</td>
                                        <td>
                                            <select className='luachon' value={realEstate.status} onChange={(event) => handleStatusChange(event, realEstate.id)}>
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => handleDelete(realEstate.id)} className='delete'>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {unsavedEstateIds.length > 0 && <button onClick={handleSaveData} className='save'>Lưu</button>}
                </div>
            </div>
            <ToastContainer /> {/* Component ToastContainer để hiển thị thông báo toast */}
        </div>
    );
}
