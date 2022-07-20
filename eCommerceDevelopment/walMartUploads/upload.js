const pool = require('../pool');
const fs = require('fs');
const path = require('path');
const { writeToPath } = require('@fast-csv/format');

const notFurnitureRug = "all_categories not LIKE '%Furniture%' AND all_categories not LIKE '%Rug%'"
const regularRate = 2.8;
const furnitureAndRugRate = 2.9;

const toyRate = .90;
const nonToyRate = 20000;

const minimumPrice = 30;
const msrpRate = 3.54;
const priceRate = 3.3;
const limit = 1000;
const rawCategory ='Home & Kitchen';
const category = `'${rawCategory}'`;

// next  variables are used to set up file location and name for csv export
//IMPORTANT MUST UPDATE  month  AT BEGINNING OF DAY
//IMPORTANT MUST UPDATE exportNumber FOR EVERY RUN OF SCRIPT

const date = new Date();
const year = date.getFullYear();
const month = 'july';
const day = date.getDate();
const exportNumber = '6';
const csvName = `expdata${rawCategory}${exportNumber}.csv`;
const exportPath = `../walmartProds/${year}/${month}/${day}/`;


let noKnives=``;

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
    case `'Patio, Lawn & Garden'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                            '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,
                                            '' AS twelve,'' AS thirteen,'' AS fourteen,'' AS fifteen,`
        break;
    case ` 'Toys & Games'`:emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                                    '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,'' AS twelve,
                                                    '' AS thirteen,'' AS fourteen,'' AS fifteen,'' AS sixteen,'' AS seventeen,
                                                    '' AS eighteen,'' AS nineteen,'' AS twenty,'' AS twentyone,'' AS twentytwo,
                                                    '' AS twentythree,'' AS twentyfour,'' AS twentyfive,'' AS twentysix,`
        break;
    case `'Home & Kitchen'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                    '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,'' AS twelve,
                                    '' AS thirteen,'' AS fourteen,'' AS fifteen,'' AS sixteen,'' AS seventeen,
                                    '' AS eighteen,'' AS nineteen,'' AS twenty,'' AS twentyone,'' AS twentytwo,
                                    '' AS twentythree,'' AS twentyfour,'' AS twentyfive,'' AS twentysix,
                                    '' AS twentyseven,'' AS twentyeight,'' AS twentynine,'' AS thirty,`
        break;
    case `'Furniture'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,'' AS five,'' AS six,
                                    '' AS seven,'' AS eight,'' AS nine,'' AS ten,'' AS eleven,'' AS twelve,
                                    '' AS thirteen,'' AS fourteen,'' AS fifteen,'' AS sixteen,'' AS seventeen,
                                    '' AS eighteen,'' AS nineteen,'' AS twenty,'' AS twentyone,'' AS twentytwo,
                                    '' AS twentythree,'' AS twentyfour,'' AS twentyfive,'' AS twentysix,
                                    '' AS twentyseven,'' AS twentyeight,`
        break;
    case `'Tools & Home Improvement'`: emptyColumnsAfterPrice = `'' AS one,'' AS two,'' AS three,'' AS four,
                                                                '' AS five,'' AS six,'' AS seven,'' AS eight,
                                                                '' AS nine,'' AS ten,'' AS eleven,'' AS twelve,`
        break;
    default: emptyColumnsAfterPrice = `'' AS one,'' AS two,`
}

switch (category){
    case `'Sports & Outdoors'`:noKnives=`AND sd.title NOT LIKE '%knife%'
                                        AND sd.title NOT LIKE '%Knife%'
                                        AND sd.title NOT LIKE '%knives%'
                                        AND sd.title NOT LIKE '%Knives%'`
        break;
    case `'Tools & Home Improvement'`:noKnives=`AND sd.title NOT LIKE '%knife%'
                                            AND sd.title NOT LIKE '%Knife%'
                                            AND sd.title NOT LIKE '%knives%'
                                            AND sd.title NOT LIKE '%Knives%'`

        break;
    default:noKnives=``
}

const from = `    from syncc_byKey_all sd
inner JOIN temp_amz_us_inv_prices_2 ci
  on ci.asin = sd.asin
  left JOIN temp_for_upload_prices_with_dif_from_amz_buyBox azi
  on azi.asin = sd.asin
LEFT OUTER JOIN WM_inv wi 
ON wi.asin = ci.asin 
  LEFT OUTER JOIN blocked_brands bb
ON sd.brand=bb.Brands
LEFT OUTER JOIN prods_not_to_relist pnr
ON sd.asin=pnr.sku
where
price IS NOT null
AND ean IS NOT NULL
AND ean <> 0
and description is not null
and description <> ''
AND category = ${category}
AND sd.brand NOT LIKE '%mazon%'
AND sd.brand NOT LIKE '%James Bond%'
AND sd.brand NOT LIKE '%Royal Gourmet%'
    AND sd.brand NOT LIKE '%Longhi%'
AND sd.title NOT LIKE '%mazon%'
AND sd.description NOT LIKE '%mazon%'
  AND sd.brand NOT LIKE '%arget%'
AND sd.title NOT LIKE '%arget%'
AND sd.description NOT LIKE '%arget%'
AND sd.title NOT LIKE '% gun %'
AND sd.description NOT LIKE '% Gun %'
AND sd.title NOT LIKE '% handgun%'
AND sd.description NOT LIKE '% Handgun%'
AND sd.title NOT LIKE '% air gun%'
AND sd.description NOT LIKE '% air gun%'
AND sd.title NOT LIKE '% paintball gun%'
AND sd.description NOT LIKE '% paintball gun%'
${noKnives}
AND wi.ASIN IS NULL
AND pnr.SKU IS NULL
  AND bb.Brands IS NULL 
AND title NOT LIKE '%rug%'
AND title NOT LIKE '%cover%'
AND brand IS NOT NULL
AND brand <> ''
AND sd.additional_image_1 IS NOT NULL
AND sd.additional_image_1 <> ''
AND sd.all_categories NOT LIKE '%Patio, Lawn & Garden>Gardening & Lawn Care>Soils, Fertilizers & Mulches%'
AND sd.all_categories <> 'Toys & Games>Baby & Toddler Toys'
AND sd.all_categories NOT LIKE '%Automotive%tires%'
AND price > ${minimumPrice}
AND
  IF(azi.all_categories LIKE '%toys%',
      (azi.percentDifAmz < ${toyRate} OR azi.percentDifAmz = 1 OR azi.percentDifAmz IS NULL),
      (azi.percentDifAmz < ${nonToyRate} OR azi.percentDifAmz = 1 OR azi.percentDifAmz IS NULL)
  )
-- AND sd.asin IN (select asin FROM WM_amz_ca_prices)
ORDER BY sd.ASIN
 LIMIT  ${limit};`


const runQueries = async () => {
    let checkingQuery = `SELECT date(recent_date) as recent_date, CURRENT_DATE AS current FROM my_switches WHERE operation='syncc'`
    let checking = await pool.promise().query(checkingQuery).catch(err => { throw err; })
    // next 2 lines casts the returns in order to compare them in following if statement
    let recent_date= +checking[0][0].recent_date;
    let current= +checking[0][0].current;

    if (recent_date < current) {

        console.log('its a new day');
    
        let query1 = ` REPLACE INTO  temp_for_upload_prices_with_dif_from_amz_buyBox
    SELECT
    azi.ASIN,
    FORMAT(
        IF(${notFurnitureRug},
             price*${regularRate},
             price*${furnitureAndRugRate}
          )
     ,2) AS final_price,
    
        (
          IF(${notFurnitureRug},
               price*${regularRate},
               price*${furnitureAndRugRate}
            )
            -
           lowest_new_price
         )
        /
        wacp.lowest_new_price AS percentDifAmz,
    
    (         
      IF(${notFurnitureRug},
               price*${regularRate},
               price*${furnitureAndRugRate})
      -
      (\`BUY BOX ITEM PRICE\` + \`BUY BOX SHIPPING PRICE\`)
    )
    /
    (\`BUY BOX ITEM PRICE\` + \`BUY BOX SHIPPING PRICE\`)
     AS percentDifBuybox,
    
     all_categories
    FROM temp_amz_us_inv_prices_2 azi
    LEFT JOIN syncc_byKey_all sba on sba.ASIN = azi.asin
    LEFT JOIN WM_amz_ca_prices wacp
    ON wacp.asin = azi.ASIN
    LEFT JOIN WM_buyBox_Price wmbbp
    ON wmbbp.SKU = CONCAT("U",azi.ASIN,"C")
    `;
        let results1 = await pool.promise().query(query1).catch(err => { throw err; })
        let { ...returns1 } = JSON.parse(JSON.stringify(results1));
        //console.log(returns1);
        console.log('length of query 1 returns: ', returns1.length);




        let query2 = `SELECT
    category,COUNT( DISTINCT sd.ASIN) as count
    from syncc_byKey_all sd
    inner JOIN temp_amz_us_inv_prices_2 ci
    on ci.asin = sd.asin
    left JOIN  temp_for_upload_prices_with_dif_from_amz_buyBox azi
    on azi.asin = sd.asin
    LEFT OUTER JOIN WM_inv wi 
    ON wi.asin = ci.asin 
    LEFT OUTER JOIN blocked_brands bb
    ON sd.brand=bb.Brands
    LEFT OUTER JOIN prods_not_to_relist pnr
    ON sd.asin=pnr.sku
    where
    price IS NOT null
    AND ean IS NOT NULL
    AND ean <> 0
    and description is not null
    and description <> ''
    AND sd.brand NOT LIKE '%mazon%'
    AND sd.brand NOT LIKE '%James Bond%'
    AND sd.brand NOT LIKE '%Royal Gourmet%'
    AND sd.title NOT LIKE '%mazon%'
    AND sd.description NOT LIKE '%mazon%'
    AND sd.brand NOT LIKE '%arget%'
    AND sd.brand NOT LIKE '%Longhi%'
    AND sd.title NOT LIKE '%arget%'
    AND sd.description NOT LIKE '%arget%'
    AND sd.title NOT LIKE '% gun %'
    AND sd.description NOT LIKE '% Gun %'
    AND sd.title NOT LIKE '% handgun %'
    AND sd.description NOT LIKE '% Handgun %'
    AND wi.ASIN IS NULL
    AND bb.Brands IS NULL 
    AND pnr.SKU IS NULL 
    AND title NOT LIKE '%rug%'
    AND title NOT LIKE '%cover%'
    AND brand IS NOT NULL
    AND brand <> ''
    AND sd.additional_image_1 IS NOT NULL
    AND sd.additional_image_1 <> ''
    AND sd.all_categories NOT LIKE '%Patio, Lawn & Garden>Gardening & Lawn Care>Soils, Fertilizers & Mulches%'
    AND sd.all_categories <> 'Toys & Games>Baby & Toddler Toys'
    AND sd.all_categories NOT LIKE '%Automotive%tires%'
    AND price > ${minimumPrice}
    AND
        IF(azi.all_categories LIKE '%toys%',
            (azi.percentDifAmz < ${toyRate} OR azi.percentDifAmz = 1 OR azi.percentDifAmz IS NULL),
            (azi.percentDifAmz < ${nonToyRate} OR azi.percentDifAmz = 1 OR azi.percentDifAmz IS NULL)
        )
        -- AND sd.asin IN (select asin FROM WM_amz_ca_prices)
    GROUP BY category
    ORDER BY COUNT(sd.ASIN) DESC;`;
        let results2 = await pool.promise().query(query2).catch(err => { throw err });
        let { ...returns2 } = JSON.parse(JSON.stringify(results2));

        console.log(returns2[0]);
        console.log('length of query 2 returns: ', returns2[0].length);

        let update_query=`UPDATE my_switches set recent_date = CURRENT_DATE WHERE operation = 'syncc'`
        await pool.promise().query(update_query).catch(err => { throw err });
       console.log('updated date in switch table');
    }else {
        let query3 = `SELECT
    concat('U',sd.asin,'C') as sku,
    If(LENGTH(title)<201,
    title,
    SUBSTRING(SUBSTRING(title,1,200),1,200-LENGTH(SUBSTRING_INDEX(SUBSTRING(title,1,200),' ',-1)))
          ) as title,
  'EAN' as ID_type,
   if(CHAR_LENGTH(ean)<13,cast(concat(0,ean) as CHAR),cast(ean as char)) ID, -- must be number
   If(LENGTH(description)<4001,
    description,
    SUBSTRING(SUBSTRING(description,1,4000),1,4000-LENGTH(SUBSTRING_INDEX(SUBSTRING(description,1,4000),'.',-1)))
          ) as description,
    '' AS blank,
     2038710 as tax_code,
   brand,
   '' AS oneEmpty,'' AS twoEmpty,
   IF (${category}='Furniture',
   sd.ASIN,
       ''
       ) AS manufacturerPartNumber,
    '' AS fourEmpty,'' AS fiveEmpty,'' AS sixEmpty,'' AS sevenEmpty,'' AS eightEmpty,
   additional_image_1 as image1,
   additional_image_2 as image2,
   additional_image_3 as image3,
   additional_image_4 as image4,
   additional_image_5 AS image5,
   ROUND(price*${msrpRate},2) AS MSRP,
   price*${priceRate} AS price,
   ${emptyColumnsAfterPrice}
   IF(sd.package_dimensions_weight < 1,1,
   IFNULL(package_dimensions_weight,30)
   )as weight,
   'lb' as unit,
   '' AS oneHome,'' AS twoHome,'' AS threeHome,'' AS fourHome,'' AS fiveHome,'' AS sixHome,
    '' AS sevenHome,'' AS eightHome,'' AS nineHome,'' AS tenHome,'' AS elevenHome,'' AS twelveHome,
    '' AS thirteenHome,'' AS fourteenHome,'' AS fifteenHome,'' AS sixteenHome,'' AS seventeenHome,
    '' AS eighteenHome,'' AS nineteenHome,'' AS twentyHome,'' AS twentyoneHome,'' AS twentytwoHome,
    '' AS twentythreeHome,'' AS twentyfourHome,
   IF( ${category}='Home & Kitchen','No','') AS \`Has Price Per Unit\`
    ${from}`
        let results3 = await pool.promise().query(query3).catch(err => { throw err });
        let { ...returns3 } = JSON.parse(JSON.stringify(results3));


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

        console.log(returns3);
        console.log('length of query 3 returns: ', returns3[0].length);

         //this next line will open the folder in file explorer
         require('child_process').exec(`start C:\\Users\\User\\Documents\\Ultracanadian\\walmartProds\\${year}\\${month}\\${day}\\`);

        let query4 = `  INSERT ignore INTO WM_inv
                        select
                        concat('U',sd.asin,'C') AS sku,
                        sd.asin
                        ${from}`;

        /*let results4 =*/ await pool.promise().query(query4).catch(err => { throw err });
        //let { ...returns4 } = JSON.parse(JSON.stringify(results4));

        //console.log(returns4);

        /* on next line I used returns returns3[0].length and not returns4[0].length because the return from insert query 
        does not have the length of amount of products*/
        console.log(returns3[0].length, ' items inserted into WM_inv table ');

       
    }

   
    process.exit();
}

runQueries();
