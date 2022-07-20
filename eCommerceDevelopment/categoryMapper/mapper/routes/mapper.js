const express = require('express');
const router = express.Router();
const async = require('async');
const pool = require('../pool');

let categoryReducer=` 
(IF(LENGTH(c1.parent_cat)>0,
CONCAT(c1.parent_cat,'>',c1.category)
 ,
 c1.category
 )LIKE '%Home%' OR IF(LENGTH(c1.parent_cat)>0,
 CONCAT(c1.parent_cat,'>',c1.category)
  ,
  c1.category
  )LIKE '%Furniture%')`;


// for counter -- any vendor on left side needs a counter

router.get('/Amzleftcount', (req, res, next) => {
   
    let numberQuery = `SELECT 
    COUNT(*) AS amount_done 
    FROM amz_bb_cat_matches abc
    INNER JOIN syncc_byKey_categories c1
    ON abc.amz_cat_code=c1.cat_code
    WHERE
    ${categoryReducer}
    `;

    let numberQuery2 = `SELECT 
    COUNT(*) AS full_amount 
    FROM syncc_byKey_categories  c1
    where 
    level<3
    AND
    ${categoryReducer}
    `;
    let return_data = {};
    async.parallel([
        function (parallel_done) {
            pool.query(numberQuery, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.done = results;
                parallel_done();
            });
        },
        function (parallel_done) {
            pool.query(numberQuery2, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.full = results;
                parallel_done();
            });
        }
    ], function (err) {
        if (err) console.log(err);

        jsonRes = JSON.stringify(return_data);
    
        res.send(jsonRes);
    });
});

router.get('/VidaXLleftcount', (req, res, next) => {

    let numberQuery = `SELECT
    COUNT(*) AS amount_done
    FROM 
    vidaxl_amz_cat_matches vac
    INNER JOIN vidaxl_categories c1
    ON vac.vidaxl_cat_code=c1.cat_code
    WHERE
    ${categoryReducer}`;

    let numberQuery2 = `SELECT
    COUNT(*) AS full_amount
    FROM vidaxl_categories c1
    where
    level<3
    AND
    ${categoryReducer}`;
    let return_data = {};
    async.parallel([
        function (parallel_done) {
            pool.query(numberQuery, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.done = results;
                parallel_done();
            });
        },
        function (parallel_done) {
            pool.query(numberQuery2, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.full = results;
                parallel_done();
            });
        }
    ], function (err) {
        if (err) console.log(err);

        jsonRes = JSON.stringify(return_data);
       
        res.send(jsonRes);
    });
});

router.get('/Trvleftcount', (req, res, next) => {
   
    let numberQuery = `SELECT
    COUNT(*) AS amount_done
    FROM trv_amz_cat_matches tac
    INNER JOIN trv_categories c1
    ON tac.trv_cat_code=c1.cat_code
    WHERE
    ${categoryReducer}
    `;

    let numberQuery2 = `SELECT
    COUNT(*) AS full_amount
    FROM trv_categories c1
    where
    level<3
    AND
    ${categoryReducer}`;
    let return_data = {};
    async.parallel([
        function (parallel_done) {
            pool.query(numberQuery, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.done = results;
                parallel_done();
            });
        },
        function (parallel_done) {
            pool.query(numberQuery2, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.full = results;
                parallel_done();
            });
        }
    ], function (err) {
        if (err) console.log(err);

        jsonRes = JSON.stringify(return_data);
     
        res.send(jsonRes);
    });
});
router.get('/WMleftcount', (req, res, next) => {
   
    let numberQuery = `SELECT
    COUNT(*) AS amount_done
    FROM
    wm_amz_cat_matches wac
    INNER JOIN wm_categories c1
    ON wac.wm_cat_code=c1.cat_code
    WHERE
    ${categoryReducer}`;

    let numberQuery2 = `SELECT
    COUNT(*) AS full_amount
    FROM
    wm_categories c1
    where
    level<3
    AND
    ${categoryReducer}`;
    let return_data = {};
    async.parallel([
        function (parallel_done) {
            pool.query(numberQuery, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.done = results;
                parallel_done();
            });
        },
        function (parallel_done) {
            pool.query(numberQuery2, {}, function (err, results) {
                if (err) return parallel_done(err);
                return_data.full = results;
                parallel_done();
            });
        }
    ], function (err) {
        if (err) console.log(err);

        jsonRes = JSON.stringify(return_data);
       
        res.send(jsonRes);
    });
});

// for left side marking a category as skipped so it will only appear at end of categories to map

router.get('/amzskip', (req, res, next) => {
    let cat = req.query.cat || `''`;
    
    let query = `UPDATE syncc_byKey_categories skc
    SET skc.skip=1
    WHERE cat_code='${cat}'
    `;
 
    pool.query(query, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
      
        res.send(results);

    });
});

router.get('/wmskip', (req, res, next) => {
    let cat = req.query.cat || `''`;
    
    let query = `UPDATE wm_categories wm
    SET wm.skip=1
    WHERE cat_code='${cat}'
    `;
 
    pool.query(query, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
      
        res.send(results);

    });
});

router.get('/trvskip', (req, res, next) => {
    let cat = req.query.cat || `''`;
    
    let query = `UPDATE trv_categories trv
    SET trv.skip=1
    WHERE cat_code='${cat}'
    `;
 
    pool.query(query, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
      
        res.send(results);

    });
});

router.get('/vidaxlskip', (req, res, next) => {
    let cat = req.query.cat || `''`;
    
    let query = `UPDATE vidaxl_categories vxl
    SET vxl.skip=1
    WHERE cat_code='${cat}'
    `;
 
    pool.query(query, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
      
        res.send(results);

    });
});


// for left side mapping 

router.get('/AmzLeftmap', (req, res, next) => {
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 100;
    if (limit > 1000) {
        limit = 100;
    }

    let amazonQuery = `SELECT
    IF(LENGTH(c1.parent_cat)>0,
    CONCAT(c1.parent_cat,'>',c1.category)
     ,
     c1.category
     )
     AS full_path, c1.cat_code as code,c1.level
      FROM syncc_byKey_categories c1
      LEFT OUTER JOIN amz_bb_cat_matches abc
      ON c1.cat_code=abc.amz_cat_code
    WHERE 
    abc.amz_cat_code IS NULL 
    AND 
    c1.level<3
    AND 
   ${categoryReducer}
    ORDER BY skip,full_path
    LIMIT ${skip, limit}
    `;
 
    pool.query(amazonQuery, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
      
        res.send(results);

    });

});

router.get('/VidaXLLeftmap', (req, res, next) => {
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 100;
    if (limit > 1000) {
        limit = 100;
    }

    let vidaxlQuery = `SELECT
    IF(LENGTH(c1.parent_cat)>0,
    CONCAT(c1.parent_cat,'>',c1.category)
     ,
     c1.category
     )
     AS full_path, c1.cat_code as code,c1.level
      FROM vidaxl_categories c1
      LEFT OUTER JOIN vidaxl_amz_cat_matches vxa
      ON c1.cat_code=vxa.vidaxl_cat_code
    WHERE
    vxa.vidaxl_cat_code IS NULL
    AND
    c1.level<3 
    AND 
    ${categoryReducer}
    ORDER BY skip,full_path
    LIMIT ${skip, limit}
    `;

   
    pool.query(vidaxlQuery, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }

        res.send(results);

    });

});

router.get('/TrvLeftmap', (req, res, next) => {
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 100;
    if (limit > 1000) {
        limit = 100;
    }

    let trvQuery = `SELECT
    IF(LENGTH(c1.parent_cat)>0,
    CONCAT(c1.parent_cat,'>',c1.category)
     ,
     c1.category
     )
     AS full_path, c1.cat_code as code,c1.level
      FROM trv_categories c1
      LEFT OUTER JOIN trv_amz_cat_matches tra
      ON c1.cat_code=tra.trv_cat_code
    WHERE
    tra.trv_cat_code IS NULL
    AND
    c1.level<3
    AND 
    ${categoryReducer}
    ORDER BY skip,full_path
    LIMIT ${skip, limit}
    `;

   
    pool.query(trvQuery, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
   
        res.send(results);

    });

});

router.get('/WMLeftmap', (req, res, next) => {
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 100;
    if (limit > 1000) {
        limit = 100;
    }

    let wmQuery = `SELECT
    IF(LENGTH(c1.parent_cat)>0,
    CONCAT(c1.parent_cat,'>',c1.category)
     ,
     c1.category
     )
     AS full_path, c1.cat_code as code,c1.level
      FROM wm_categories c1
      LEFT OUTER JOIN wm_amz_cat_matches wma
      ON c1.cat_code=wma.wm_cat_code
    WHERE
    wma.wm_cat_code IS NULL
    AND
    c1.level<3
    AND 
    ${categoryReducer}
    ORDER BY skip,full_path
    LIMIT ${skip, limit}
    `;

   
    pool.query(wmQuery, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
     
        res.send(results);

    });

});

//for first level on right side
router.get('/BBRightmap', (req, res, next) => {
    let bestBuyQuery = `select 
    DISTINCT(label) as next_level_category, code,label as current 
    from 
    BB_categories
    where level=1
    and label<>'Baby & Kids'
    and label<>'Cameras & Camcorders'
    and label<>'Car, Marine & GPS'
    and label<>'Cellular Phones'
    and label<>'Computers'
    and label<>'Gaming'
    and label<>'Geek Squad'
    and label<>'Gift Cards'
    and label<>'Health, Beauty & Travel'
    and label<>'Movies'
    and label<>'Multi-Dept and Generic'
    and label<>'Music'
    and label<>'Musical Instruments'
    and label<>'Pets'
    and label<>'Wearable Technology'
    order by label
   `;
    pool.query(bestBuyQuery, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
 
        res.send(results);

    });
});

router.get('/AmzRightmap', (req, res, next) => {
    let amazonQuery = `select 
    DISTINCT(category) as next_level_category, cat_code as code,category as current
    from 
    syncc_byKey_categories
    where level=1
    and category<>'Amazon Devices & Accessories'
    and category<>'Amazon Explore'
    and category<>'Arts, Crafts & Sewing'
    and category<>'Automotive'
    and category<>'Baby'
    and category<>'Baby Products'
    and category<>'Beauty & Personal Care'
    and category<>'Books'
    and category<>'CDs & Vinyl'
    and category<>'Credit & Payment Cards'
    and category<>'Cell Phones & Accessories'
    and category<>'Clothing, Shoes & Accessories'
    and category<>'Clothing, Shoes & Jewelry'
    and category<>'Featured Stores'
    and category<>'Gift Cards'
    and category<>'Grocery & Gourmet Food'
    and category<>'Handmade'
    and category<>'Handmade Products'
    and category<>'Industrial & Scientific'
    and category<>'Kindle Store'
    and category<>'Movies & TV'
    and category<>'Musical Instruments'
    and category<>'Musical Instruments, Stage & Studio'
    and category<>'Pet Supplies'
    and category<>'Software'
    and category<>'Spine'
    and category<>'Video Games'
    order by category
   `;
    pool.query(amazonQuery, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
      
        res.send(results);

    });
});

// for lower level on right side
router.get('/lowerlevelBBCat', (req, res, next) => {
    let parentCat = req.query.parentCat;

    let query = `select 
      distinct(bc2.label) as next_level_category,bc2.code,bc2.label as current 
      from 
      BB_categories bc1
      left join BB_categories bc2
      on bc1.code=bc2.parent_code
      where bc2.parent_code='${parentCat}' and bc2.level<3
      order by bc2.label
     `;

    pool.query(query, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
        res.send(results);

    });

});

router.get('/lowerlevelAmzCat', (req, res, next) => {
    let parentCat = req.query.parentCat;
  

   
     let   query = `select 
        distinct(bc2.category) as next_level_category,bc2.cat_code as code,CONCAT(bc2.parent_cat,'>',bc2.category) as current
        from 
        syncc_byKey_categories bc1
        left join syncc_byKey_categories bc2
        on bc1.category=SUBSTRING_INDEX(bc2.parent_cat,'>',-1)
        WHERE bc2.level=bc1.level+1
        AND bc2.parent_code='${parentCat}' and bc2.level<3
        order by bc2.category
       `;

    pool.query(query, (error, results, fields,) => {

        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
        res.send(results);

    });

});

// for matches
router.get('/amzbbmatch', (req, res, next) => {
    let amz_cat_code = req.query.amz;
    let bb_cat_code = req.query.bb;

    let query = `INSERT INTO amz_bb_cat_matches
                VALUES 
                ( '${amz_cat_code}',
                 '${bb_cat_code}'
                )
             `;
    pool.query(query, (error, results, fields,) => {
        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
        res.send(results);
    });

});

router.get('/vidaxlamzmatch', (req, res, next) => {
    let amz_cat_code = req.query.amz;
    let vidaxl_cat_code = req.query.vidaxl;

    let query = `INSERT INTO vidaxl_amz_cat_matches
                VALUES 
                ( '${vidaxl_cat_code}',
                 '${amz_cat_code}'
                )
             `;
    pool.query(query, (error, results, fields,) => {
        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
        res.send(results);
    });

});

router.get('/trvamzmatch', (req, res, next) => {
    let amz_cat_code = req.query.amz;
    let trv_cat_code = req.query.trv;

    let query = `INSERT INTO trv_amz_cat_matches
                VALUES 
                ( '${trv_cat_code}',
                 '${amz_cat_code}'
                )
             `;
    pool.query(query, (error, results, fields,) => {
        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
        res.send(results);
    });

});

router.get('/wmamzmatch', (req, res, next) => {
    let amz_cat_code = req.query.amz;
    let wm_cat_code = req.query.wm;

    let query = `INSERT INTO wm_amz_cat_matches
                VALUES 
                ( '${wm_cat_code}',
                 '${amz_cat_code}'
                )
             `;
    pool.query(query, (error, results, fields,) => {
        if (error) {
            res.statusCode = 500;
            return res.send(error.message);
        }
        res.send(results);
    });

});



module.exports = router;