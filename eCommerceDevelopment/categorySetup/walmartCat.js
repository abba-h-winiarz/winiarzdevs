// used for creating category table that will be used in the mapper
const pool = require('../pool');


const runQueries = async () => {

    let catArray=[];
    let level=9;
   
        console.log('starting level '+level);
    let deleteQuery=`delete from  temp_wm_cat_path`;
    await pool.promise().query(deleteQuery).catch(err => { throw err; })

    let setupQuery=`Insert into temp_wm_cat_path
    select DISTINCT(Replace(REPLACE(SUBSTRING_INDEX(SUBSTRING_INDEX(wmpia.categoryPath,'Home Page/',-1),'/',${level}),'/','>'),'"',''))
    FROM wm_us_prod_info_api wmpia
     WHERE categoryPath <>''
     AND categoryPath IS NOT NULL
     and categoryPath <> 'UNNAV'
     AND SUBSTRING_INDEX(wmpia.categoryPath,'/',${level+1})<>SUBSTRING_INDEX(wmpia.categoryPath,'/',${level}) 
    `
    await pool.promise().query(setupQuery).catch(err => { throw err; })

    let firstLevelquery = `SELECT 
    DISTINCT(REPLACE(SUBSTRING_INDEX(SUBSTRING_INDEX(wmpia.categoryPath,'Home Page/',-1),'/',1),'/','>')) as cat,
    '' AS parent,
    '' as parent_code,
    0 as skip
     FROM wm_us_prod_info_api wmpia
     WHERE categoryPath <>''
     AND categoryPath IS NOT NULL
     and categoryPath <> 'UNNAV'
     AND SUBSTRING_INDEX(wmpia.categoryPath,'/',2)<>SUBSTRING_INDEX(wmpia.categoryPath,'/',1) 
    `;
    let secondLevelQuery =`
    SELECT
     distinct(SUBSTRING_INDEX(cp.category,'>',-1)) AS cat,
    SUBSTRING_INDEX(cp.category,'>',${level-1}) AS parent,
    wmc.cat_code as parent_code,
    0 as skip 
      FROM temp_wm_cat_path cp
      inner join
      wm_categories wmc
      on SUBSTRING_INDEX(cp.category,'>',${level-1}) = wmc.category
    `;

    let lowerLevelQuery =`
    SELECT
     distinct(SUBSTRING_INDEX(cp.category,'>',-1)) AS cat,
     SUBSTRING_INDEX(cp.category,'>',${level-1}) AS parent,
    wmc.cat_code as parent_code,
    0 as skip
      FROM temp_wm_cat_path cp
      inner join
      wm_categories wmc
      on SUBSTRING_INDEX(cp.category,'>',${level-1}) = concat(wmc.parent_cat,'>',wmc.category)
    `;

    let results1 = await pool.promise().query(lowerLevelQuery).catch(err => { throw err; })
    let { ...returns1 } = JSON.parse(JSON.stringify(results1));
    //console.log(returns1[0]);
    //console.log('length of query 1 returns: ', returns1.length);
    for(let i=0;i<returns1[0].length;i++){
        catArray.push(returns1[0][i]);
       // console.log(catArray[i]);
        let query2 = `INSERT INTO wm_categories
        VALUES ("${catArray[i].cat}",'wm_0${level}_0${i +1}',${level},"${catArray[i].parent}","${catArray[i].parent_code}")`;
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
