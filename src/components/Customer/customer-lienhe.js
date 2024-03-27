import React from 'react';
import lienheItems from '../../list/listlienhe';

export default function Customerlienhe() {
    return (
        <div>
            
            <div className='customerlienhe'>
                {/* <div className='col-md-6 customerlienheghichu'>
                    <span className='form-title'>Gửi thông tin</span><br />
                    <span className='form-description'>Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho chúng tôi. Chúng tôi sẽ trả lời bạn sau khi nhận được.</span><br />
                    <div className='form-group'>
                        <label htmlFor='name' className='form-label'>Họ và tên</label><br />
                        <input id='name' className='form-input' type='text' placeholder='Nhập họ và tên của bạn' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='message' className='form-label'>Nội dung</label><br />
                        <textarea id='message' className='form-input' rows='4' placeholder='Nhập nội dung tin nhắn của bạn'></textarea>
                    </div>
                    <button className='btn-submit'>Gửi tin nhắn</button>
                </div> */}
                <iframe
                    className='mapcontact'
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105376076!2d106.80730271125371!3d10.841127589266952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1708750729574!5m2!1svi!2s"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className='col-md-6 infocontactshop'>
                    <span style={{fontWeight: 'bold', color: 'red', fontSize: '20px'}}>Thông tin liên hệ</span>
                    {lienheItems.map((item, index) => (
                        <div key={index} className='infocontactshopinfo'>
                            <img src={item.logoSrc} alt={item.title} style={{ width: '15px', height: '15px' }} />
                            <a href={item.title === 'Điện thoại' ? 'tel:' + item.content : (item.title === 'Email' ? 'mailto:' + item.content : '')} key={index}>
                                <span style={{fontWeight: 'bold'}}>{item.title}</span>
                                <span>: {item.content}</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
}
