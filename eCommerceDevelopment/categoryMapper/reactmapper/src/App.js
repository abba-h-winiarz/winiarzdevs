import React from 'react';
import Mapper from './Mapper';
import Navbar from './Navbar';


export default function App() {

    //next 9 lines to pull params from url
    let params = {};
    let query = window.location.search.substring(1).split("&");
    for (let i = 0, max = query.length; i < max; i++) {
        if (query[i] === "") {
            continue;
        }
        let param = query[i].split("=");
        params[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
    }

    let leftSwitchString = '';
    if ((params.left === 'amz' && params.right === 'bb') || (params.left === 'vxl' && params.right === 'amz' )||( params.left === 'trv' && params.right === 'amz' )|| (params.left === 'wm' && params.right === 'amz')) {
        leftSwitchString = params.left;
    }
    let rightSwitchString = '';
    if ((params.left === 'amz' && params.right === 'bb') || (params.left === 'vxl' && params.right === 'amz' )||( params.left === 'trv' && params.right === 'amz' )|| (params.left === 'wm' && params.right === 'amz')) {
        rightSwitchString = params.right;
    }

    let leftMatchVendor = '';
    let rightMatchVendor = '';
    let leftMapVendor = '';
    let rightMapVendor = '';
    let leftVendorName = '';
    let rightVendorName = '';

    switch (leftSwitchString) {
        case 'bb': leftMatchVendor = `bb`;
            leftMapVendor = `BB`;
            leftVendorName = 'Best Buy';
            break;
        case 'amz': leftMatchVendor = `amz`;
            leftMapVendor = `Amz`;
            leftVendorName = 'Amazon';
            break;
        case 'vxl': leftMatchVendor = `vidaxl`;
            leftMapVendor = `VidaXL`;
            leftVendorName = 'VidaXL';
            break;
        case 'trv': leftMatchVendor = `trv`;
            leftMapVendor = `Trv`;
            leftVendorName = 'True Value';
            break;
        case 'wm': leftMatchVendor = `wm`;
            leftMapVendor = `WM`;
            leftVendorName = 'Wal Mart';
            break;
        default: leftMatchVendor = `wm`;
        leftMapVendor = `WM`;
        leftVendorName = 'Wal Mart';
    }
    switch (rightSwitchString) {
        case 'bb': rightMatchVendor = `bb`;
            rightMapVendor = `BB`;
            rightVendorName = 'Best Buy';
            break;
        case 'amz': rightMatchVendor = `amz`
            rightMapVendor = `Amz`;
            rightVendorName = 'Amazon';
            break;
        default: rightMatchVendor = `amz`
        rightMapVendor = `Amz`;
        rightVendorName = 'Amazon';
    }
    return (
        <>
            <Navbar leftMatchVendor={leftMatchVendor} rightMatchVendor={rightMatchVendor}></Navbar>
            <Mapper leftVendorName={leftVendorName} rightVendorName={rightVendorName} leftMatchVendor={leftMatchVendor} rightMatchVendor={rightMatchVendor} leftMapVendor={leftMapVendor} rightMapVendor={rightMapVendor}></Mapper>
        </>
    )
}