import './App.css';
import React, { useState, useEffect } from 'react';
import LeftSideCat from './LeftVendor';
import RightSideCat from './RightVendor';
import MatchButton from './MatchButton';
import SkipButton from './SkipButton';
import Footer from './Footer';
import Counter from './Counter';
import 'bootstrap/dist/css/bootstrap.css'

let allLevels = [];                   //used for storing previous levels of category for the back button
let nonStateCounter = 0;             //for keeping track of when to refetch



export default function Mapper(props) {

  const [counter, setCounter] = useState(0);               //for counter 


  const [leftCategory, setLeftCategory] = useState('');            //string for final matching into database
  const [rightCategory, setRightCategory] = useState('');              //string for final matching into database
  const [rightCategoryName, setRightCategoryName] = useState('');      // string for display if lowestlevel node
  const [amountDone, setAmountDone] = useState(0);               //for counter
  const [lowestLevel, setLowestLevel] = useState(false);         //for display of lowestlevel node
  const [justMatched, setJustMatched] = useState(false);
  const [currentLevelArray, setCurrentLevelArray] = useState([]);//for display of current category level
  const [leftPathArray, setLeftPathArray] = useState([]);          //for storing fetched mapped amazon categories
  const [alreadyFetched, setAlreadyFetched] = useState(false);   //for displaying wait to load message
  const [needToFetch, setNeedToFetch] = useState(false);
  const [currentPath, setCurrentPath] = useState('');//for diplaying current selection
  const limit = 1000;

  let { leftVendorName, rightVendorName, leftMatchVendor, rightMatchVendor, leftMapVendor, rightMapVendor } = props;


  const match = async () => {
    if (rightCategory !== '' && leftCategory !== '') {
      
      const results = await fetch(`/${leftMatchVendor}${rightMatchVendor}match?${leftMatchVendor}=${leftCategory}&${rightMatchVendor}=${rightCategory}`);
      if (!results.ok) {
        const errorText = await results.text();
       // console.log(errorText);
        throw new Error(`${errorText}`);
      }
      //console.log(results);
      setRightCategory('');

      setLeftCategory('');


      allLevels=[allLevels[0]];
      setCurrentLevelArray(allLevels[0]);
      setCounter(counter + 1);
      nonStateCounter++;

      if (nonStateCounter === limit) {
        nonStateCounter = 0;
       
        setNeedToFetch(true);
      }

      setAmountDone(amountDone + 1);
      setJustMatched(true);
      setLowestLevel(false);
    }

  }

  const skip = async () => {
    if (leftCategory !== '') {
      console.log('skipped ',leftPathArray[counter][0]);
     // console.log(leftPathArray[counter]);
     setRightCategory('');
     setCurrentPath('');
     
     const results = await fetch(`/${leftMatchVendor}skip?cat=${leftCategory}`);
     if (!results.ok) {
       const errorText = await results.text();
      
       throw new Error(`${errorText}`);
     }
     allLevels=[allLevels[0]];
      setCurrentLevelArray(allLevels[0]);
      
     //console.log(leftCategory);
     //console.log(leftPathArray.length);
     let arrayItemtoSkip=leftPathArray[counter];
     let nonStateArray=[...leftPathArray];
     nonStateArray.splice(counter,1);
     nonStateArray.push(arrayItemtoSkip);
     //console.log(nonStateArray);
     setLeftPathArray(nonStateArray);
     //console.log(leftCategory);
     setLowestLevel(false);
    }

  }



  useEffect(() => {
    try {
      
    } catch (e) {
     // console.error(e);
    }
  }, []);



  return (
    <>
      <div className="App">

        <LeftSideCat leftVendorName={leftVendorName} alreadyFetched={alreadyFetched} leftPathArray={leftPathArray} setLeftPathArray={setLeftPathArray} counter={counter} setLeftCategory={setLeftCategory} leftCategory={leftCategory} limit={limit} needToFetch={needToFetch} setNeedToFetch={setNeedToFetch} leftMapVendor={leftMapVendor} setCounter={setCounter} setAlreadyFetched={setAlreadyFetched} id='leftCategories' className='flex-container-column'></LeftSideCat>
        <div id='margin'>
          <MatchButton match={match} counter={counter} rightCategory={rightCategory}></MatchButton>
          <div></div>
          <SkipButton skip={skip} rightCategory={rightCategory}></SkipButton>
        </div>
        <RightSideCat currentPath={currentPath} setCurrentPath={setCurrentPath} rightVendorName={rightVendorName} rightMapVendor={rightMapVendor} rightCategory={rightCategory} setRightCategory={setRightCategory} rightCategoryName={rightCategoryName} setRightCategoryName={setRightCategoryName} setLowestLevel={setLowestLevel} lowestLevel={lowestLevel} justMatched={justMatched} setJustMatched={setJustMatched} currentLevelArray={currentLevelArray} setCurrentLevelArray={setCurrentLevelArray} allLevels={allLevels} id='rightCategories' className='flex-container-column'></RightSideCat>
        <Counter counter={counter} amountDone={amountDone} setAmount={setAmountDone} leftMapVendor={leftMapVendor}></Counter>
        <Footer></Footer>
      </div>
    </>
  );
}

