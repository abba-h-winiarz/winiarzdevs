-- the following queries are used to create the tables that are necessary for running the script to make a category table
-- for every new vendor that is to be mapped into amazon categories for our website



-- this first table will be used for inserting all distinct category paths for each succesive level of depth in the category tree
-- and will be emptied an refilled with each level

CREATE TABLE temp_wm_cat_path (
    category varchar(200)
)

-- this next table will store the categories with their levels and unique codes
 
  CREATE TABLE wm_categories (
      category varchar(100),
      cat_code varchar(30),
      LEVEL int,
      parent_cat varchar(255),
      parent_code varchar(30),
      skip int,
       PRIMARY KEY (cat_code)  
  )


-- this next table will be populated by using the mapper and will hold the matching new vendor category codes and the amazon codes

  CREATE TABLE wm_amz_cat_matches (
      wm_cat_code varchar(30),
     amz_cat_code varchar(30), 
  PRIMARY KEY (wm_cat_code)  
  )