import React, { useState/*, useEffect*/ } from 'react';
import './Button.css';

export default function BackButton(props) {
    const [isActive, setIsActive] = useState(false);
    const { back } = props;
    const handleClick = () => {
        back();
        setIsActive(current => !current);
        setTimeout(() => {
            setIsActive(current => !current);
        }, 300);

    };
    return (
        <>
            <button disabled={isActive ? true : false} className={isActive ? 'ucButtonClicked' : 'ucButton'} onClick={handleClick}>Back</button>
        </>
    )



}