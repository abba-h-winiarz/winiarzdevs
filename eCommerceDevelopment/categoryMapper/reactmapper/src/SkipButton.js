import React, { useState } from 'react';
import './Button.css';

export default function SkipButton(props) {
    const [isActive, setIsActive] = useState(false);
    const { skip, rightCategory } = props;
    
    const handleClick = () => {
        skip();
        
            setIsActive(current => !current);
            setTimeout(() => {
                setIsActive(current => !current);
            }, 500);
        
    };

    return (
        <>
            <button disabled={isActive ? true : false} className={isActive ? 'ucButtonClicked' : 'ucButton'} onClick={handleClick}>Skip</button>
        </>
    )



}