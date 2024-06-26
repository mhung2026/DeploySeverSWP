import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CallApi from '../CallApi';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CiFilter } from "react-icons/ci";

export default function Customertrangchubanvila() {
  const [num, setNum] = React.useState('');
  const handleChange = (event) => {
    setNum(event.target.value);
  };

  const [realEstates, setRealEstates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CallApi.getAllRealEstate();
        const RealEstate = response.filter(statusRealEstate => statusRealEstate.status ===2)
        setRealEstates(RealEstate);
        console.log("x", RealEstate)
        const locationResponse = await CallApi.getAllLocation();
        setLocations(locationResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getCityName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.city : '';
  };

  const limitWords = (text, limit) => {
    if (text) {
      const words = text.split(' ');
      const truncatedWords = words.slice(0, limit);
      const truncatedText = truncatedWords.join(' ');
      if (words.length > limit) {
        return truncatedText + ' .....';
      }
      return truncatedText;
    }
    return '';
  };

  const getFrontImages = realEstate => {
    return realEstate.realEstateImages.filter(image => image.imageName === 'Ảnh Mặt Trước');
  };

  const getPrice = realEstate => {
    const price = realEstate.price;
    return price;
  };

  const getStatus = realEstate => {
    let status = '';
    switch (realEstate.status) {
      case 2:
      case 6:
        status = 'Đang Mở Bán';
        break;
      default:
        status = ''; // Or any default status you want to show
        break;
    }
    return status;
  };

  const handleRealEstateClick = estate => {
    navigate(`/thongtinchitietbatdongsan/${estate.id}`);
  };

  const startIndex = (currentPage - 1) * 6;
  const endIndex = startIndex + 6;
  const currentEstates = realEstates.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 5 : 1);
  };

  const handleNextPage = () => {
    const maxPages = Math.ceil(realEstates.length / 6);
    setCurrentPage(currentPage < maxPages ? currentPage + 5 : maxPages);
  };

  return (
    
    <div>
      <div className='search-home' style={{ justifyContent: "center", display: "flex" }}>
        {/* <div className='main-title1 col-md-6'>
          <div class="real-title1">
            <div className='text-realtitle'>
              <i><CiFilter size={50}/></i>
              <span className='textso1'></span>
            </div>
          </div>
        </div> */}
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Tỉnh
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={num}
            label="Num"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Bình Định</MenuItem>
            <MenuItem value={20}>Lâm Đồng</MenuItem>
            <MenuItem value={30}>Khánh Hòa</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Quận
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={num}
            label="Num"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Bình Tân</MenuItem>
            <MenuItem value={20}>Phú Nhuận</MenuItem>
            <MenuItem value={30}>Tân Phú</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Phường
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={num}
            label="Num"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Lê Lợi</MenuItem>
            <MenuItem value={20}>Phước Thiện</MenuItem>
            <MenuItem value={30}>Đống Đa</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Hướng
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={num}
            label="Num"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Đông</MenuItem>
            <MenuItem value={20}>Tây</MenuItem>
            <MenuItem value={30}>Nam</MenuItem>
            <MenuItem value={30}>Bắc</MenuItem>
          </Select>
        </FormControl>

      </div>

      <div className="estate-container">
        <div className='main-title'>
          <div className="real-title">
            <div className='text-realtitle'>
              <span className='textso1'>NHÀ ĐẤT</span>
              <h2 className='textso2'>BÁN</h2>
            </div>
          </div>
        </div>
        <div className="estates-wrapper">
          {currentEstates.map((estate, index) => (
            <div key={index} className="estate-item">
              <div className="estate-info">
                <div className="image-container">
                  {getFrontImages(estate).map((image, imageIndex) => (
                    <div key={imageIndex} className="image-item">
                      <img src={image.imageUrl} alt={image.imageName} className="estate-image" />
                    </div>
                  ))}
                </div>
                <div onClick={() => handleRealEstateClick(estate)} className="estate-name">{estate.realestateName}</div>
                <span className="estate-discription">{limitWords(estate.discription, 15)}</span>
                <div className='thanhphoprice'>
                  <div className='logo-thanhpho'>
                    <img className='logo-location' src='/logotrangchu/location.png' alt="location" />
                    <span className='thanhpho'>{getCityName(estate.locationId)}</span>
                  </div>
                  <span className='price'>{getPrice(estate)}</span>
                </div>
                <span className='trangthaiban'>{getStatus(estate)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} className="page-number">
            Prev
          </button>
          {realEstates.length > 6 &&
            Array.from({ length: Math.ceil(realEstates.length / 6) }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.min(currentPage + 2, Math.ceil(realEstates.length / 6)))
              .map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`page-number ${currentPage === page ? 'active' : ''}`}>
                  {page}
                </button>
              ))}
          <button onClick={handleNextPage} className="page-number">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
