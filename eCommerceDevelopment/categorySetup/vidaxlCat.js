// used for creating category table that will be used in the mapper
const pool = require('../pool');


const runQueries = async () => {

    let catArray=[];
    let level=7;
   
        console.log('starting level '+level);
    let deleteQuery=`delete from  temp_vidaxl_cat_path`;
    await pool.promise().query(deleteQuery).catch(err => { throw err; })

    let setupQuery=`Insert into temp_vidaxl_cat_path
    select DISTINCT(SUBSTRING_INDEX(vpi.Category,' >',${level}))
    FROM vidaXL_prod_info vpi
     WHERE Category <>''
     AND Category IS NOT NULL
     AND SUBSTRING_INDEX(vpi.Category,'>',${level})<>SUBSTRING_INDEX(vpi.Category,'>',${level -1}) 
    `
    await pool.promise().query(setupQuery).catch(err => { throw err; })

    let firstLevelquery = `SELECT 
     DISTINCT(SUBSTRING_INDEX(vpi.Category,' >',1)) as cat,
    '' AS parent,
    '' as parent_code,
    0 as skip
     FROM vidaXL_prod_info vpi
     WHERE Category <>''
     AND Category IS NOT NULL
     AND SUBSTRING_INDEX(vpi.Category,' >',2)<>SUBSTRING_INDEX(vpi.Category,' >',1) 
    `;
    let secondLevelQuery =`
    SELECT
     distinct(SUBSTRING_INDEX(cp.category,' > ',-1)) AS cat,
    SUBSTRING_INDEX(cp.category,' > ',${level-1}) AS parent,
    vxc.cat_code as parent_code,
    0 as skip 
      FROM temp_vidaxl_cat_path cp
      inner join
      vidaxl_categories vxc
      on SUBSTRING_INDEX(cp.category,' > ',${level-1}) = vxc.category
    `;

    let lowerLevelQuery =`
    SELECT
     distinct(SUBSTRING_INDEX(cp.category,' > ',-1)) AS cat,
     REPLACE(SUBSTRING_INDEX(cp.category,' > ',${level-1})," > ", ">") AS parent,
    vxc.cat_code as parent_code,
    0 as skip 
      FROM temp_vidaxl_cat_path cp
      inner join
      vidaxl_categories vxc
      on REPLACE(SUBSTRING_INDEX(cp.category,' > ',${level-1})," > ", ">") = concat(vxc.parent_cat,'>',vxc.category)
    `;

    let results1 = await pool.promise().query(lowerLevelQuery).catch(err => { throw err; })
    let { ...returns1 } = JSON.parse(JSON.stringify(results1));
    //console.log(returns1[0]);
    //console.log('length of query 1 returns: ', returns1.length);
    for(let i=0;i<returns1[0].length;i++){
        catArray.push(returns1[0][i]);
       // console.log(catArray[i]);
        let query2 = `INSERT INTO vidaxl_categories
        VALUES ("${catArray[i].cat}",'vxl_0${level}_0${i +1}',${level},"${catArray[i].parent}","${catArray[i].parent_code}")`;
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
