import React, { useState, useEffect } from 'react';
import './RightVendor.css'
import BackButton from './BackButton';

export default function RightVendorCat(props) {
    
    let { currentPath, setCurrentPath, rightVendorName, rightCategory, setRightCategory, rightCategoryName, setRightCategoryName, setLowestLevel, lowestLevel, justMatched, setJustMatched, currentLevelArray, setCurrentLevelArray, allLevels, rightMapVendor } = props;

    const back = async () => {
        if (!lowestLevel) {
            allLevels.pop();
        }

        setLowestLevel(false);
        if (allLevels.length >= 1) {
            setCurrentLevelArray(allLevels[allLevels.length - 1]);
        }
        setRightCategory('');
        setCurrentPath('');
    }

    const fetchRightCats = async (e) => {

        const results = await fetch(`/${rightMapVendor}Rightmap`);
        if (!results.ok) {
            const errorText = await results.text();
            throw new Error(`${errorText}`);
        }
        const r = await results.json();
       
        setTimeout(() => {
            setCurrentLevelArray(r);
        }, 1000);
        allLevels.push(r);
    }

    const fetchLowerRightCats = async (e) => {

        setRightCategory(e.target.id);
        setRightCategoryName(e.target.innerText);
        setCurrentPath(e.target.className);

        const results = await fetch(`/lowerlevel${rightMapVendor}Cat?parentCat=${e.target.id}`);
        if (!results.ok) {
            const errorText = await results.text();
            throw new Error(`${errorText}`);
        }
        const r = await results.json();

        setCurrentLevelArray(r);

        if (r.length > 0) {
            allLevels.push(r);
        } else {
            setLowestLevel(true);
        }

    }

    useEffect(() => {
        try {
            fetchRightCats();
        } catch (e) {
           // console.error(e);
        }
    }, []);

    if (justMatched === true) {
        setCurrentLevelArray(allLevels[0]);
        setJustMatched(false);
    }

    let CurrentSelection;
    if(currentPath!==''){
        CurrentSelection=<><div id="currentDiv" className='boldRightCat'> Current Selection is: {currentPath}</div></>
    }else{
        CurrentSelection=<><div id="currentDiv" className='boldRightCat'> No Current Selection</div></>
    }

    let RightCatDiv;

    if (lowestLevel) {
        RightCatDiv = <>
            <div id="rightCategoriesInnerDiv" className="flex-container-column">
                <div className="lowestNode">{rightCategoryName}</div>

            </div>
        </>
    } else {
        RightCatDiv = <>
            <div id="rightCategoriesInnerDiv" className="flex-container-column">{currentLevelArray.map(cat => {
                return (
                    <button className='flex-item clickable boldRightCat rightCatButton' key={cat.code} onClick={fetchLowerRightCats}>
                        <div id={cat.code} className={cat.current}> {cat.next_level_category}</div>
                    </button>
                )
            })}</div></>
    }

    return (
        <>
            <div id='rightCategories' className='mb-3 flex-container'>
            <BackButton back={back}  ></BackButton>
                <span className="bold">{rightVendorName} Categories </span>
                {CurrentSelection}
                
                {RightCatDiv}
            </div>
        </>
    )
}