import React, {  useEffect } from 'react';
import './Navbar.css'

export default function Navbar(props) {
    let {  leftMatchVendor, rightMatchVendor } = props;

    const switchSelectedLink=()=>{
        document.querySelectorAll('.selectedLink').forEach(elem => { elem.classList.remove('selectedLink'); });
        document.getElementById(`${leftMatchVendor}to${rightMatchVendor}`).classList.add('selectedLink');
    }

    useEffect(() => {
        try {
            switchSelectedLink();
        } catch (e) {
           // console.error(e);
        }
    }, []);

    return (
        <>
            <div id='nav'>
                <ul>
                    <li ><a id='wmtoamz' href={'/?left=wm&right=amz'}>Wal Mart to Amazon</a></li>{' | '}
                    <li><a id='trvtoamz'  href={'/?left=trv&right=amz'}>True Value to Amazon</a></li>{' | '}
                    <li onClick={switchSelectedLink}><a id='vidaxltoamz' href={'/?left=vxl&right=amz'}>VidaXl to Amazon</a></li>{' | '}
                    <li onClick={switchSelectedLink}><a id='amztobb' href={'/?left=amz&right=bb'}>Amazon to Best Buy</a></li>
                </ul>
            </div>
        </>
    )
}