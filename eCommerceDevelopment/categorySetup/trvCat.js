// used for creating category table that will be used in the mapper
const pool = require('../pool');


const runQueries = async () => {

    let catArray=[];
    let level=3;
   
        console.log('starting level '+level);

    let firstLevelquery = `SELECT 
    DISTINCT(emsDept) as cat,
    '' AS parent,
    '' as parent_code,
    0 as skip
     FROM trv_prod_categories tpc
     WHERE emsDept <>''
     AND emsDept IS NOT NULL
     -- AND CONCAT(emsDept,'>',emsClass)<>CONCAT(emsDept,'>') 
    `;
    let secondLevelQuery =`
    SELECT
    DISTINCT(cp.emsClass) AS cat,
    tc.category AS parent,
    tc.cat_code as parent_code,
    0 as skip 
      FROM trv_prod_categories cp
      inner join
      trv_categories tc
      on cp.emsDept = tc.category
    `;

    let thirdLevelQuery =`
    SELECT
    DISTINCT(emsSubClass) AS cat,
     CONCAT(tc.parent_cat,'>',tc.category) AS parent,
    tc.cat_code as parent_code,
    0 as skip 
      FROM trv_prod_categories cp
      inner join
      trv_categories tc
      on CONCAT(cp.emsDept,'>',cp.emsClass) = concat(tc.parent_cat,'>',tc.category)
    `;

    let results1 = await pool.promise().query(thirdLevelQuery).catch(err => { throw err; })
    let { ...returns1 } = JSON.parse(JSON.stringify(results1));
    //console.log(returns1[0]);
    //console.log('length of query 1 returns: ', returns1.length);
    for(let i=0;i<returns1[0].length;i++){
        catArray.push(returns1[0][i]);
       // console.log(catArray[i]);
        let query2 = `INSERT INTO trv_categories
        VALUES ("${catArray[i].cat}",'trv_0${level}_0${i +1}',${level},"${catArray[i].parent}","${catArray[i].parent_code}")`;
        let results2 = await pool.promise().query(query2).catch(err => { throw err });
      //  let { ...returns2 } = JSON.parse(JSON.stringify(results2));
    
        //console.log(returns2[0]);
       // console.log('length of query 2 returns: ', returns2[0].length);
      
    }
    console.log('length of query 1 returns: ', returns1[0].length);
    //}

    process.exit();
}

runQueries();
