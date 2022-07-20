import React, { useState } from 'react';
import './Button.css';

export default function MatchButton(props) {
    const [isActive, setIsActive] = useState(false);
    const { match, rightCategory } = props;
    const handleClick = () => {
        match();
        if (rightCategory !== '') {
            setIsActive(current => !current);
            setTimeout(() => {
                setIsActive(current => !current);
            }, 500);
        }
    };

    return (
        <>
            <button disabled={isActive ? true : false} className={isActive ? 'ucButtonClicked' : 'ucButton'} onClick={handleClick}>Match</button>
        </>
    )



}