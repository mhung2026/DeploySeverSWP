import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Adminmenu from "./admin-menu";
import UserAdmin from '../../list/userIAdmin';
import CallApi from '../CallApi';

export default function AdminSetTime() {
  const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredDate, setFilteredDate] = useState(null); // State để lưu trữ giá trị của DatePicker filter
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [allReservations, setAllReservations] = useState([]); // State để lưu trữ dữ liệu từ API
  const [showAllReservations, setShowAllReservations] = useState(false); // State để kiểm soát hiển thị toàn bộ lịch đặt

  const timeSlots = [
    { id: "time1", display: "8:00 - 10:00" },
    { id: "time2", display: "11:00 - 13:00" },
    { id: "time3", display: "14:00 - 16:00" },
    { id: "time4", display: "17:00 - 19:00" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getAllReservation = await CallApi.GetAllReservationTime();
        // Fillter những ngày tương lai và hiện tại
        const futureReservations = getAllReservation.filter(reservation => moment(reservation.date).isSameOrAfter(moment().startOf('day')));
        setAllReservations(futureReservations); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Error at fetchData", error);
      }
    };
    
    const fetchUpdatedData = async () => {
      while (true) {
          await fetchData();
          await new Promise(resolve => setTimeout(resolve, 0));
      }
  };

  fetchData(); // Initial fetch
  fetchUpdatedData(); // Start long polling
  }, []);

  useEffect(() => {
    console.log("Ngày đã chọn:", moment(selectedDate).format('YYYY-MM-DD'));
    console.log("Các khung thời gian đã chọn:");
    selectedTimes.forEach(id => {
      console.log(`${id}: "${getTimeDisplay(id)}"`);
    });
  }, [selectedDate, selectedTimes]);

  useEffect(() => {
    // Filter out past dates
    const now = moment().startOf('day');
    if (filteredDate && moment(filteredDate).isBefore(now)) {
      setFilteredDate(now.toDate());
    }
  }, [filteredDate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  const getTimeDisplay = (id) => {
    switch (id) {
      case "time1":
        return "8:00 - 10:00";
      case "time2":
        return "11:00 - 13:00";
      case "time3":
        return "14:00 - 16:00";
      case "time4":
        return "17:00 - 19:00";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        date: moment(selectedDate).format('YYYY-MM-DD'),
        ...selectedTimes.reduce((acc, id) => {
          acc[id] = getTimeDisplay(id);
          return acc;
        }, {})
      };
      console.log("Data sent:", requestData);
      const response = await axios.post('http://swprealestatev2-001-site1.etempurl.com/api/ReservationTime/CreateReservationTimeByAdmin', requestData);
      console.log(response.data);
      toast.success('Set lịch thành công!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Đã xảy ra lỗi khi gửi thông tin.');
    }
  };

  const handleTimeClick = (time) => {
    const index = selectedTimes.indexOf(time);
    if (index !== -1) {
      setSelectedTimes(selectedTimes.filter(selectedTime => selectedTime !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleShowAllReservations = () => {
    setFilteredDate(null);
    setShowAllReservations(true);
  };

  return (
    <div>
      <div className="admin-all-account">
        <Adminmenu
          userLoginBasicInformationDto={userLoginBasicInformationDto}
          UserMenu={UserAdmin}
        />
        <div>
          <h1> Thiết Lập Thời Gian Đặt Lịch</h1>
          <div className="datepicker-container">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()} // Set minDate to today's date
            />
          </div>
          <div className="time-buttons">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                className={selectedTimes.includes(slot.id) ? "selected" : ""}
                onClick={() => handleTimeClick(slot.id)}
              >
                {slot.display}
              </button>
            ))}
          </div>
          <button onClick={handleSubmit} className="custom-button" style={{ color: "black" }}>Gửi thông tin</button>
        </div>
        <div>
          <span>Hiển thị lịch đặt</span>
          <span>Xem toàn bộ lịch đặt</span>
          <span>Lọc ngày </span>
          <div className="datepicker-container">
            <DatePicker
              selected={filteredDate}
              onChange={date => setFilteredDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()} // Set minDate to today's date
            />
          </div>
          <button onClick={handleShowAllReservations} className="custom-button" style={{ color: "black" }}>Hiện toàn bộ lịch đặt</button>
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Khung giờ 1</th>
                <th>Khung giờ 2</th>
                <th>Khung giờ 3</th>
                <th>Khung giờ 4</th>
              </tr>
            </thead>
            <tbody>
              {showAllReservations ? (
                allReservations
                  .filter(reservation => {
                    if (!filteredDate) return true;
                    return moment(reservation.date).isSame(filteredDate, 'day');
                  })
                  .map(reservation => (
                    <tr key={reservation.id}>
                      <td>{formatDate(reservation.date)}</td>
                      <td>{reservation.time1}</td>
                      <td>{reservation.time2}</td>
                      <td>{reservation.time3}</td>
                      <td>{reservation.time4}</td>
                    </tr>
                  ))
              ) : (
                allReservations
                  .filter(reservation => {
                    if (!filteredDate) return true;
                    return moment(reservation.date).isSame(filteredDate, 'day');
                  })
                  .map(reservation => (
                    <tr key={reservation.id}>
                      <td>{formatDate(reservation.date)}</td>
                      <td>{reservation.time1}</td>
                      <td>{reservation.time2}</td>
                      <td>{reservation.time3}</td>
                      <td>{reservation.time4}</td>
                    </tr>
                  ))
              )}

            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
