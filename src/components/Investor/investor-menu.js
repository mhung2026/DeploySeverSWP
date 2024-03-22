import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../CallApi';
export default function InvestorMenu({ userLoginBasicInformationDto, UserMenu }) {
    const [invesBalances, setInvesBalances] = useState(() => {
        const storedBalance = localStorage.getItem('invesBalances');
        return storedBalance ? JSON.parse(storedBalance) : [];
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllWallet = await CallApi.getAllWallet();
                const getIdInvestorWallet = getAllWallet.find(IdInvestor => IdInvestor.investorId === parseInt(userLoginBasicInformationDto.accountId));
                const accountBalances = getIdInvestorWallet.accountBalance;
    
                // Kiểm tra xem số dư hiện tại có khác với số dư trong cơ sở dữ liệu không
                if (JSON.stringify(accountBalances) !== JSON.stringify(invesBalances)) {
                    setInvesBalances(accountBalances);
                    localStorage.setItem('invesBalances', JSON.stringify(accountBalances));
                }
            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, [userLoginBasicInformationDto.accountId, invesBalances]);

    // Function to remove 'invesBalances' from localStorage
    
    return (
        <div className="col-md-3 account">
            <div className="">
                <span className='welcome'>Chào mừng, {userLoginBasicInformationDto.username}!</span>
                <div className="balance">Số dư: {invesBalances.length > 0 ? invesBalances : 0}</div>
                <ul className="menu-list-investor">
                    {UserMenu.map(menuItem => (
                        <li key={menuItem.id} className="menu-item-container">
                            <Link className='menu-item-investor' to={menuItem.link}>{menuItem.name}</Link>
                        </li>
                    ))}
                </ul>
              
            </div>
        </div>
    );
}
