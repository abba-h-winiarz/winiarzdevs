import React, { useState, useEffect } from 'react';
import './Counter.css'

export default function Counter(props) {

    const [fullAmount, setFullAmount] = useState(0);
    let { amountDone, setAmount, leftMapVendor } = props;

    const fetchCount = async (setAmount, setFullAmount) => {

        const results = await fetch(`/${leftMapVendor}leftcount`);
        if (!results.ok) {
            const errorText = await results.text();
            throw new Error(`${errorText}`);
        }
        const r = await results.json();
        setAmount(r.done[0].amount_done);
        setFullAmount(r.full[0].full_amount);
    }

    useEffect(() => {
        try {
            fetchCount(setAmount, setFullAmount);
        } catch (e) {
           // console.error(e);
        }
    }, []);
    return (
        <>
            <div id="counterDiv">{amountDone + 1} of {fullAmount} categories</div>
        </>
    )
}


