import React, {  useEffect } from 'react';
import './LeftVendor.css'



export default function LeftVendorCat(props) {

    let { leftVendorName, /*alreadyFetched,*/ leftPathArray, setLeftPathArray, counter, setLeftCategory, needToFetch, setNeedToFetch, leftMapVendor, limit, setCounter, setAlreadyFetched/*, leftCategory*/ } = props;

    const fetchLeftCats = async () => {

        const results = await fetch(`/${leftMapVendor}Leftmap?limit=${limit}`);
        //console.log(results);
        if (!results.ok) {
            const errorText = await results.text();
           // console.log(errorText);
            throw new Error(`${errorText}`);
        }
        const r = await results.json();
       // console.log(r);

        setLeftPathArray(r.map(r => [r.code, r.level, r.full_path.split('>')]),);
        
        setTimeout(() => {
            
            setCounter(0);
            setAlreadyFetched(true);
        }, 5000);


        setTimeout(() => {
            setLeftCategory(leftPathArray[counter][0]);
           
        }, 5000);

    }



    if (needToFetch) {
        fetchLeftCats();
        setNeedToFetch(false);
    }

    useEffect(() => {
        try {
            fetchLeftCats();
        } catch (e) {
           // console.error(e);
        }
    }, []);

    let LeftCatDiv;
    if (counter < leftPathArray.length) {


        LeftCatDiv = <div id="leftCategoriesInnerDiv" className="flex-container-column">
            <div id={leftPathArray[counter][0]} className='flex-item' key={leftPathArray[counter][0]}>
                {leftPathArray[counter][2].map((pathpart,index) => <div className={index===leftPathArray[counter][2].length-1 ? 'bottomCatPart' :'boldLeftCat'} key={index}>{pathpart}{'>'}</div>)}
            </div></div>;
        setLeftCategory(leftPathArray[counter][0]);
    } else {
        LeftCatDiv = <div id="leftCategoriesInnerDiv" className="flex-container-column">Just a Moment. Waiting for categories</div>;
    }

    return (
        <div id='leftCategories' className='mb-3 flex-container'>
            <span className="bold">{leftVendorName} Category Path</span>
            {LeftCatDiv}
        </div>
    )
}