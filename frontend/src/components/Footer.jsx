import React from 'react';
import { Phone, Mail, GitHub, LinkedIn, Instagram, Facebook } from '@mui/icons-material';
import "../componentStyles/footer.css";


function Footer() {
  return (
    <footer className='footer'>
        <div className="footer-container">

            {/* Section 1 */}
            <div className="footer-section contact">
                <h3>Contact Us</h3>
                <p><Phone fontSize='small'/>Phone: +91851641328</p>
                <p><Mail fontSize='small'/>Email: Saurabhpython1@gmail.com</p>
            </div>

            {/* Section 2 */}
            <div className="footer-section social">
                <h3>Follow me</h3>
                <div className="social-links">
                    <a href="" target='_blank'>
                        <GitHub className='social-icon'/>
                    </a>
                    <a href="" target='_blank'>
                        <LinkedIn className='social-icon'/>
                    </a>
                    <a href="" target='_blank'>
                        <Facebook className='social-icon'/>
                    </a>
                    <a href="" target='_blank'>
                        <Instagram className='social-icon'/>
                    </a>
                </div>
            </div>

            {/* Section 3 */}
            <div className="footer-section about">
                <h3>About</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Eveniet aut quibusdam laboriosam assumenda maxime. 
                </p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Saurabh</p>
        </div>
    </footer>
  )
}

export default Footer;