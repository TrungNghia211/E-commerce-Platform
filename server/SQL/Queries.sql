  SELECT p.id, p.name, p.thumbnail, min(pi.price) AS price, p.purchase_count 
    FROM product p 
    JOIN product_item pi 
      ON p.id = pi.product_id 
GROUP BY p.id, p.thumbnail, p.name, p.purchase_count;