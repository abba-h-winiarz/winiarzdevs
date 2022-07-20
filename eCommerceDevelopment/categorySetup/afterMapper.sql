-- these queries are for mapping products to the correct amazon category after the vendor categories are mapped to amazon categories
-- currently assuming that they are mapped only from second level deep in category path (with a replacement line for  full path)

-- VIDA MATCHING INTO MAPPED CATEGORY
SELECT 
xpi.SKU,
xpi.Category,
CONCAT(REPLACE(vc.parent_cat,'>',' > '),' > ',vc.category) AS vxlCatTableResult,
 vacm.vidaxl_cat_code
FROM 
vidaXL_prod_info xpi 
LEFT JOIN vidaxl_categories vc
 ON SUBSTRING_INDEX(REPLACE(xpi.category,' > ','>'),'>',2)=CONCAT(vc.parent_cat,'>',vc.category)
-- ON REPLACE(xpi.category,' > ','>')=CONCAT(vc.parent_cat,'>',vc.category) -- use this line if matching entire category
LEFT JOIN
vidaxl_amz_cat_matches vacm
ON vacm.vidaxl_cat_code=vc.cat_code
LEFT JOIN
syncc_byKey_categories skc
ON skc.cat_code=vacm.amz_cat_code
LIMIT 10

##############################################
-- WAL MART MATCHING INTO MAPPED CATEGORY
SELECT 
 wupia.itemId,
 wupia.categoryPath ,
 CONCAT('Home Page/',REPLACE(wc.parent_cat,'>','/'),'/',wc.category) AS wmCatTableResult  ,
 wacm.wm_cat_code
FROM 
wm_us_prod_info_api wupia
 LEFT JOIN wm_categories wc
  ON SUBSTRING_INDEX(REPLACE(REPLACE(SUBSTRING_INDEX(wupia.categoryPath,'Home Page/',-1),'/','>'),'"',''),'>',2)=CONCAT(wc.parent_cat,'>',wc.category)
 -- ON REPLACE(REPLACE(SUBSTRING_INDEX(wupia.categoryPath,'Home Page/',-1),'/','>'),'"','')=CONCAT(wc.parent_cat,'>',wc.category) -- use this line if matching entire category
 LEFT JOIN
 wm_amz_cat_matches wacm
 ON wacm.wm_cat_code=wc.cat_code
 LEFT JOIN
 syncc_byKey_categories skc
 ON skc.cat_code=wacm.amz_cat_code
LIMIT 10

##############################################
-- TRUE VALUE MATCHING INTO MAPPED CATEGORY
SELECT 
  tpc.sku,
  CONCAT(tpc.emsDept,'>',tpc.emsClass,'>',tpc.emsSubClass) as trvPath,
  CONCAT(tc.parent_cat,'>',tc.category) AS wmCatTableResult,
  tacm.trv_cat_code
FROM 
trv_prod_categories tpc 
  LEFT JOIN trv_categories tc
  ON CONCAT(tpc.emsDept,'>',tpc.emsClass)=CONCAT(tc.parent_cat,'>',tc.category)
  -- ON CONCAT(tpc.emsDept,'>',tpc.emsClass,'>',tpc.emsSubClass)=CONCAT(tc.parent_cat,'>',tc.category) -- use this line if matching entire category
  LEFT JOIN
  trv_amz_cat_matches tacm
  ON tacm.trv_cat_code=tc.cat_code
  LEFT JOIN
  syncc_byKey_categories skc
  ON skc.cat_code=tacm.amz_cat_code
LIMIT 10