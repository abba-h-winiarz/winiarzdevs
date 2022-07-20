
const pool = require('../pool');
const fs = require('fs');
const path = require('path');
const { writeToPath } = require('@fast-csv/format');

const date = new Date();
//const monthNum = date.getMonth();



const notFurnitureRug = "wmpi.categoryPath not LIKE '%Furniture%' AND wmpi.categoryPath not LIKE '%Rug%'"

const furnitureAndRugRate = 3.4;

const toyRate = .90;
const nonToyRate = 20000;

const minimumPrice = 40;
const msrpRate = 3.54;
const priceRate = 3.3;
const limit = 1000;

const rawCategory ='Electronics';
const category = `'${rawCategory}'`;
// next  variables are used to set up file location and name for csv export
//IMPORTANT MUST UPDATE  month  AT BEGINNING OF DAY
//IMPORTANT MUST UPDATE exportNumber FOR EVERY RUN OF SCRIPT
const year = date.getFullYear();
const month = 'july';
const day = date.getDate();
const exportNumber = '10';
const csvName = `expdataFromWMUS${rawCategory}${exportNumber}.csv`;
const exportPath = `../walmartProds/${year}/${month}/${day}/`;


let noKnives = ``;

let emptyColumnsAfterPrice = '';

switch (category) {
    case `'Sports & Outdoors'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,'' AS twelve,
                                '' AS thirteen,'' AS fourteen,'' AS fifteen,'' AS sixteen,'' AS seventeen,
                                '' AS eighteen,`
        break;
    case `'Electronics'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                                        '' AS seven,'' AS eight,'' AS nine,`
        break;
    case `'Patio & Garden'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                            '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,
                                            '' AS twelve,'' AS thirteen,'' AS fourteen,'' AS fifteen,`
        break;
    case ` 'Toys'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                                    '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,'' AS twelve,
                                                    '' AS thirteen,'' AS fourteen,'' AS fifteen,'' AS sixteen,'' AS seventeen,
                                                    '' AS eighteen,'' AS nineteen,'' AS twenty,'' AS twentyone,'' AS twentytwo,
                                                    '' AS twentythree,'' AS twentyfour,'' AS twentyfive,'' AS twentysix,`
        break;
    case `'Appliances'`:
    case `'Home'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                    '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,'' AS twelve,
                                    '' AS thirteen,'' AS fourteen,'' AS fifteen,'' AS sixteen,'' AS seventeen,
                                    '' AS eighteen,'' AS nineteen,'' AS twenty,'' AS twentyone,'' AS twentytwo,
                                    '' AS twentythree,'' AS twentyfour,'' AS twentyfive,'' AS twentysix,
                                    '' AS twentyseven,'' AS twentyeight,'' AS twentynine,'' AS thirty,`
        break;
   
    case `'Home improvement'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,
                                                                '' AS five,'' AS six,'' AS seven,'' AS eight,
                                                                '' AS nine,'' AS ten,'' AS eleven,'' AS twelve,`
        break;
    case `'Furniture'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                    '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,'' AS twelve,
                                    '' AS thirteen,'' AS fourteen,'' AS fifteen,'' AS sixteen,'' AS seventeen,
                                    '' AS eighteen,'' AS nineteen,'' AS twenty,'' AS twentyone,'' AS twentytwo,
                                    '' AS twentythree,'' AS twentyfour,'' AS twentyfive,'' AS twentysix,
                                    '' AS twentyseven,'' AS twentyeight,`
        break;
    default: emptyColumnsAfterPrice = `'' AS one,'' AS two,`
}

switch (category) {
    case `'Sports & Outdoors'`: noKnives = `AND wmpi.name NOT LIKE '%knife%'
                                        AND wmpi.name NOT LIKE '%Knife%'
                                        AND wmpi.name NOT LIKE '%knives%'
                                        AND wmpi.name NOT LIKE '%Knives%'`
        break;
    case `'Home improvement'`: noKnives = `AND wmpi.name NOT LIKE '%knife%'
                                            AND wmpi.name NOT LIKE '%Knife%'
                                            AND wmpi.name NOT LIKE '%knives%'
                                            AND wmpi.name NOT LIKE '%Knives%'`

        break;
    default: noKnives = ``
}

const from = `    FROM wm_us_prod_info_api  wmpi
 INNER JOIN temp_ids_wm_us_prods_category_check pcc
 ON wmpi.itemId=pcc.item_id
 LEFT JOIN WM_catalogue_API_version wcav
 ON wmpi.upc=wcav.upc
 LEFT OUTER JOIN IN_STOCK_INV isi
 ON wcav.sku=isi.sku
LEFT OUTER JOIN prods_from_wm_us pro
ON CONCAT('wm_',wmpi.itemId,'_wm')=pro.sku
LEFT OUTER JOIN blocked_brands bb
ON wmpi.brandName=bb.Brands
LEFT OUTER JOIN prods_not_to_relist pnr
ON wmpi.itemId=pnr.sku
WHERE
isi.sku IS NULL
AND pro.sku IS NULL
AND pnr.SKU IS NULL
AND bb.Brands IS NULL
AND salePrice IS NOT null
AND wmpi.upc IS NOT NULL
AND wmpi.upc <> 0
AND wmpi.brandName IS NOT NULL
AND wmpi.brandName <> ''
AND wmpi.shortDescription is NOT NULL
AND wmpi.shortDescription <> ''
AND wmpi.longDescription is NOT NULL
AND wmpi.longDescription <> ''
AND wmpi.brandName NOT LIKE '%mazon%'
AND wmpi.brandName NOT LIKE '%James Bond%'
AND wmpi.brandName NOT LIKE '%Royal Gourmet%'
AND wmpi.brandName NOT LIKE '%Longhi%'
AND wmpi.name NOT LIKE '%mazon%'
AND wmpi.shortDescription NOT LIKE '%mazon%'
AND wmpi.longDescription NOT LIKE '%mazon%'
AND wmpi.brandName NOT LIKE '%arget%'
AND wmpi.name NOT LIKE '%arget%'
AND wmpi.shortDescription NOT LIKE '%arget%'
AND wmpi.longDescription NOT LIKE '%arget%'
AND wmpi.name NOT LIKE '% gun %'
AND wmpi.shortDescription NOT LIKE '% Gun %'
AND wmpi.longDescription NOT LIKE '% Gun %'
AND wmpi.name NOT LIKE '% handgun %'
AND wmpi.shortDescription NOT LIKE '% Handgun %'
AND wmpi.longDescription NOT LIKE '% Handgun %'
AND wmpi.name NOT LIKE '% air gun%'
AND wmpi.shortDescription NOT LIKE '% air gun%'
AND wmpi.longDescription NOT LIKE '% air gun%'
AND wmpi.name NOT LIKE '% paintball gun%'
AND wmpi.shortDescription NOT LIKE '% paintball gun%'
AND wmpi.longDescription NOT LIKE '% paintball gun%'
 AND wmpi.name NOT LIKE '%rug%'
AND wmpi.name NOT LIKE '%cover%'
 AND salePrice > ${minimumPrice}
 AND IF((SUBSTRING_INDEX(SUBSTRING_INDEX(wmpi.categoryPath,'/',3),'/',-1)='Furniture' AND SUBSTRING_INDEX(SUBSTRING_INDEX(wmpi.categoryPath,'/',2),'/',-1)='Home') OR (SUBSTRING_INDEX(SUBSTRING_INDEX(wmpi.categoryPath,'/',3),'/',-1)='Appliances' AND SUBSTRING_INDEX(SUBSTRING_INDEX(wmpi.categoryPath,'/',2),'/',-1)='Home'),
 SUBSTRING_INDEX(SUBSTRING_INDEX(wmpi.categoryPath,'/',3),'/',-1),
 SUBSTRING_INDEX(SUBSTRING_INDEX(wmpi.categoryPath,'/',2),'/',-1)
 ) = ${category}
AND wmpi.availableOnline ='1'
AND largeImage IS NOT NULL
AND imageEntities IS NOT NULL
AND largeImage <> ''
AND imageEntities <> ''
 AND wmpi.categoryPath NOT LIKE '%Soil%'
 AND wmpi.categoryPath NOT LIKE '%Fertilizer%'
 AND wmpi.categoryPath NOT LIKE '%Mulch%'
 AND wmpi.categoryPath <> 'Toys & Games>Baby & Toddler Toys'
 AND wmpi.categoryPath NOT LIKE '%Automotive%tires%'
 -- AND SUBSTRING_INDEX(SUBSTRING_INDEX(wmpi.categoryPath,'/',3),'/',-1)<>'Decor' -- to be removed when run out of other home products
${noKnives}
ORDER BY salePrice DESC
 LIMIT  ${limit};`



const runQueries = async () => {
    let checkingQuery = `SELECT date(recent_date) as recent_date, CURRENT_DATE AS current FROM my_switches WHERE operation='us_walmart'`
    let checking = await pool.promise().query(checkingQuery).catch(err => { throw err; })
    // next 2 lines casts the returns in order to compare them in following if statement
    let recent_date = +checking[0][0].recent_date;
    let current = +checking[0][0].current;

    if (recent_date < current) {

        console.log('its a new day');
        
        let query = `DELETE FROM temp_ids_wm_us_prods_category_check`;
         await pool.promise().query(query).catch(err => { throw err });
        console.log('DELETED FROM TEMP TABLE');

        let query1 = `INSERT IGNORE INTO temp_ids_wm_us_prods_category_check
        SELECT wmpi.itemId
        FROM wm_us_prod_info_api  wmpi
        LEFT OUTER JOIN prods_from_wm_us pro
        ON CONCAT('wm_',wmpi.itemId,'_wm')=pro.sku
        LEFT OUTER JOIN blocked_brands bb
        ON wmpi.brandName=bb.Brands
        LEFT OUTER JOIN prods_not_to_relist pnr
        ON wmpi.itemId=pnr.sku
        WHERE
        pro.sku IS NULL
        AND pnr.SKU IS NULL
        AND bb.Brands IS NULL

        AND salePrice IS NOT null
        AND wmpi.upc IS NOT NULL
        AND wmpi.upc <> 0
        AND wmpi.brandName IS NOT NULL
        AND wmpi.brandName <> ''
        AND shortDescription is NOT NULL
        AND shortDescription <> ''
        AND longDescription is NOT NULL
        AND longDescription <> ''
        AND wmpi.brandName NOT LIKE '%mazon%'
        AND wmpi.brandName NOT LIKE '%James Bond%'
        AND wmpi.brandName NOT LIKE '%Royal Gourmet%'
        AND wmpi.brandName NOT LIKE '%Longhi%'
        AND wmpi.name NOT LIKE '%mazon%'
        AND wmpi.shortDescription NOT LIKE '%mazon%'
        AND wmpi.longDescription NOT LIKE '%mazon%'
        AND wmpi.brandName NOT LIKE '%arget%'
        AND wmpi.name NOT LIKE '%arget%'
        AND wmpi.shortDescription NOT LIKE '%arget%'
        AND wmpi.longDescription NOT LIKE '%arget%'
        AND wmpi.name NOT LIKE '%rug%'
        AND wmpi.name NOT LIKE '%cover%'
        AND salePrice > ${minimumPrice}
        AND wmpi.availableOnline =1
        AND largeImage IS NOT NULL
        AND imageEntities IS NOT NULL
        AND largeImage <> ''
        AND imageEntities <> ''
        ${noKnives}
        `;

        let results1 = await pool.promise().query(query1).catch(err => { throw err });
        let { ...returns1 } = JSON.parse(JSON.stringify(results1));
        //console.log(returns1);
        console.log('length of query 1 returns: ', returns1[0].length);

        let queryTwo = ` 
                           select  IF((SUBSTRING_INDEX(SUBSTRING_INDEX(bcp2.categoryPath,'/',3),'/',-1)='Furniture' AND SUBSTRING_INDEX(SUBSTRING_INDEX(bcp2.categoryPath,'/',2),'/',-1)='Home') OR (SUBSTRING_INDEX(SUBSTRING_INDEX(bcp2.categoryPath,'/',3),'/',-1)='Appliances' AND SUBSTRING_INDEX(SUBSTRING_INDEX(bcp2.categoryPath,'/',2),'/',-1)='Home'),
                           SUBSTRING_INDEX(SUBSTRING_INDEX(bcp2.categoryPath,'/',3),'/',-1),
                           SUBSTRING_INDEX(SUBSTRING_INDEX(bcp2.categoryPath,'/',2),'/',-1)
                           )  as category,
                           COUNT( DISTINCT bc.item_id) as count
                           FROM temp_ids_wm_us_prods_category_check   bc
                           LEFT JOIN wm_us_prod_info_api  bcp2
                            ON bc.item_id=bcp2.itemId
                            where
                            bcp2.categoryPath NOT LIKE '%Soil%'
                            AND bcp2.categoryPath NOT LIKE '%Fertilizer%'
                            AND bcp2.categoryPath NOT LIKE '%Mulch%'
                            AND bcp2.categoryPath <> 'Toys & Games>Baby & Toddler Toys'
                            AND bcp2.name NOT LIKE '%tires%'
                          --  AND SUBSTRING_INDEX(SUBSTRING_INDEX(bcp2.categoryPath,'/',3),'/',-1)<>'Decor' -- to be removed when run out of other home products
                            GROUP BY category
                            ORDER BY COUNT(bc.item_id) DESC
                            `;

        let resultsTwo = await pool.promise().query(queryTwo).catch(err => { throw err });
        let { ...returnsTwo } = JSON.parse(JSON.stringify(resultsTwo));

        console.log(returnsTwo[0]);
        console.log('amount of categories: ',returnsTwo[0].length);



        let update_query = `UPDATE my_switches set recent_date = CURRENT_DATE WHERE operation = 'us_walmart'`
        await pool.promise().query(update_query).catch(err => { throw err });
        //let { ...update_returns } = JSON.parse(JSON.stringify(update_results));
        console.log('updated date in switch table');
    } else {
        let query3 = `SELECT
        DISTINCT(CONCAT('wm_',wmpi.itemId,'_wm')) as sku,
        If(LENGTH(wmpi.name)<201,
        wmpi.name,
        SUBSTRING_INDEX(SUBSTRING(wmpi.name,1,200),' ',-1)
              ) as name,
        'UPC' AS ID_type,
        wmpi.upc AS prod_ID, -- must be number 12 digits long
        If(LENGTH(CONCAT(wmpi.shortDescription,' ',wmpi.longDescription))<4001,
          CONCAT(wmpi.shortDescription,' ',wmpi.longDescription),
          SUBSTRING(SUBSTRING(CONCAT(wmpi.shortDescription,' ',wmpi.longDescription),1,4000),1,4000-LENGTH(SUBSTRING_INDEX(SUBSTRING(CONCAT(wmpi.shortDescription,' ',wmpi.longDescription),1,4000),'.',-1)))
          ) AS description,
        '' AS blank,
        2038710 as tax_code,
        brandName,
        '' AS oneEmpty,'' AS twoEmpty,
        IF (${category}='Furniture',
        wmpi.itemId,
            ''
            ) AS manufacturerPartNumber,
            '' AS fourEmpty,'' AS fiveEmpty,'' AS sixEmpty,
        '' AS ProductIdUpdate,
        '' AS SkuUpdate,
        largeImage as image1,
        SUBSTRING_INDEX(imageEntities,',',1) as image2,
        IF(LENGTH(SUBSTRING_INDEX(imageEntities,',',2))>LENGTH(SUBSTRING_INDEX(imageEntities,',',1)),
        SUBSTRING_INDEX(SUBSTRING_INDEX(imageEntities,',',2),',',-1),
           '') as image3,
        IF(LENGTH(SUBSTRING_INDEX(imageEntities,',',3))>LENGTH(SUBSTRING_INDEX(imageEntities,',',2)),
        SUBSTRING_INDEX(SUBSTRING_INDEX(imageEntities,',',3),',',-1),
           '') as image4,
        IF(LENGTH(SUBSTRING_INDEX(imageEntities,',',4))>LENGTH(SUBSTRING_INDEX(imageEntities,',',3)),
        SUBSTRING_INDEX(SUBSTRING_INDEX(imageEntities,',',4),',',-1),
           '') AS image5,
        ROUND(salePrice*${msrpRate},2) AS MSRP,
   
        ROUND(IF(${notFurnitureRug},
            salePrice*${priceRate},
            salePrice*${furnitureAndRugRate}
         ),2) AS price,
        ${emptyColumnsAfterPrice}
        '20' as weight,
        'lb' AS unit ,
        '' AS oneHome,'' AS twoHome,'' AS threeHome,'' AS fourHome,'' AS fiveHome,'' AS sixHome,
        '' AS sevenHome,'' AS eightHome,'' AS nineHome,'' AS tenHome,'' AS elevenHome,'' AS twelveHome,
         '' AS thirteenHome,'' AS fourteenHome,'' AS fifteenHome,'' AS sixteenHome,'' AS seventeenHome,
         '' AS eighteenHome,'' AS nineteenHome,'' AS twentyHome,'' AS twentyoneHome,'' AS twentytwoHome,
         '' AS twentythreeHome,'' AS twentyfourHome,
        IF( ${category}='Home' OR ${category}='Appliances','No','') AS \`Has Price Per Unit\`
    ${from}`
        let results3 = await pool.promise().query(query3).catch(err => { throw err });
        let { ...returns3 } = JSON.parse(JSON.stringify(results3));
        let skuArray = [];
        for (i = 0; i < returns3[0].length; i++) {
            skuArray.push(returns3[0][i].sku);
        };

        const makedir = () => {
            try {
                fs.mkdir(`${exportPath}`, (error) => {
                    if (error) {
                        console.log(`Folder ${exportPath} exists already.`)
                    } else {
                        console.log(`New folder ${exportPath} has been created.`)
                    }
                })
            } catch (err) {
                console.error(err)
            }
        }

        makedir();

        writeToPath(path.resolve(__dirname, `${exportPath}${csvName}`), returns3[0])
            .on('error', err => console.error(err))
            .on('finish', () => console.log(`Done writing ${returns3[0].length} products from ${category} to ${exportPath}${csvName}`));

        //console.log(returns3[0]);
        //console.log(skuArray);
        //console.log(typeof(returns3));
        console.log('length of query 3 returns: ', returns3[0].length);

        //this next line will open the folder in file explorer
        require('child_process').exec(`start C:\\Users\\User\\Documents\\Ultracanadian\\walmartProds\\${year}\\${month}\\${day}\\`);

        for (i = 0; i < skuArray.length; i++) {
            let query4 = ` INSERT ignore INTO prods_from_wm_us
                        VALUES
                        ('${skuArray[i]}')
                      -- select CONCAT('wm_',wmpi.itemId,'_wm') as sku,name
                      -- FROM wm_us_prod_info_api  wmpi
                      --   where CONCAT('wm_',wmpi.itemId,'_wm')='${skuArray[i]}'
                       `;

            let results4 = await pool.promise().query(query4).catch(err => { throw err });
            let { ...returns4 } = JSON.parse(JSON.stringify(results4));

            //console.log(returns4);

        }


        /* on next line I used returns returns3[0].length and not returns4[0].length because the return from insert query 
        does not have the length of amount of products*/
        console.log(returns3[0].length, ' items inserted into prods_from_wm_us table ');


    }

    process.exit();
}

runQueries();

