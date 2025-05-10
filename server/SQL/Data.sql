-- ======================= PRODUCT =======================

-- INSERT INTO product (id, name, slug, purchase_count, thumbnail)
-- VALUES (1, "Iphone 1", "iphone1", 15, "fakeURL");

INSERT INTO product (id, name, slug, purchase_count, thumbnail)
VALUES (2, "Iphone 2", "iphone-2", 15, "fakeURL"),
	   (3, "Iphone 3", "iphone-3", 15, "fakeURL"),
       (4, "Iphone 4", "iphone-4", 15, "fakeURL"),
       (5, "Iphone 5", "iphone-5", 15, "fakeURL"),
       (6, "Iphone 6", "iphone-6", 15, "fakeURL"),
       (7, "Iphone 7", "iphone-7", 15, "fakeURL"),
       (8, "Iphone 8", "iphone-8", 15, "fakeURL"),
       (9, "Iphone 9", "iphone-9", 15, "fakeURL"),
       (10, "Iphone 10", "iphone-10", 15, "fakeURL");
       
INSERT INTO product (id, name, slug, purchase_count, thumbnail)
VALUES (11, "Áo thun Kamito", "ao-thun-kamito", 1000, "https://product.hstatic.net/1000341630/product/kamito3d2383_393ddc86c362443d848e9707e6980ede_master.jpg");
       
-- ======================= PRODUCT_ITEM =======================

-- INSERT INTO product_item (id, sku, price, product_id)
-- VALUES (1, "Fake sku", 10000000, 1);

INSERT INTO product_item (id, sku, price, product_id)
VALUES  (2, "Fake sku 1", 10000000, 2),
		(3, "Fake sku 2", 10000000, 2),
		(4, "Fake sku 3", 10000000, 3),
		(5, "Fake sku 4", 10000000, 4),
		(6, "Fake sku 5", 10000000, 5),
		(7, "Fake sku 6", 10000000, 6),
		(8, "Fake sku 7", 10000000, 7),
		(9, "Fake sku 8", 10000000, 8),
		(10, "Fake sku 9", 10000000, 9);
        
INSERT INTO product_item (id, sku, price, quantity_in_stock, product_id)
VALUES (11, "Dummy SKU", 259000, 1000, 11);
        
-- ======================= PRODUCT_CATEGORY =======================

-- INSERT INTO product_category (id, name, slug, thumbnail)
-- VALUES ("1", "Thời trang nam", 'thoi-trang-nam', "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp");

INSERT INTO product_category (id, name, slug, thumbnail)
VALUES  (2, "Điện Thoại & Phụ Kiện", "dien-thoai-va-phu-kien", "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp"),
		(3, "Thiết Bị Điện Tử", "thiet-bi-dien-tu", "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp"),
		(4, "Đồng Hồ", "dong-ho", "https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp"),
		(5, "Giày Dép Nam", "giay-dep-nam", "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp"),
		(6, "Thời Trang Nữ", "thoi-trang-nu", "https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w640_nl.webp"),
		(7, "Sắc Đẹp", "sac-dep", "https://down-vn.img.susercontent.com/file/ef1f336ecc6f97b790d5aae9916dcb72@resize_w640_nl.webp"),
        (8, "Sức Khoẻ", "suc-khoe", "https://down-vn.img.susercontent.com/file/49119e891a44fa135f5f6f5fd4cfc747@resize_w640_nl.webp"),
        (9, "Mẹ & Bé", "me-va-be", "https://down-vn.img.susercontent.com/file/099edde1ab31df35bc255912bab54a5e@resize_w640_nl.webp");
        
INSERT INTO product_category (id, name, slug, thumbnail)
VALUES (8, "Sức Khoẻ", "suc-khoe", "https://down-vn.img.susercontent.com/file/49119e891a44fa135f5f6f5fd4cfc747@resize_w640_nl.webp"),
	   (9, "Mẹ & Bé", "me-va-be", "https://down-vn.img.susercontent.com/file/099edde1ab31df35bc255912bab54a5e@resize_w640_nl.webp");
       
-- ======================= VARIATION =======================

INSERT INTO variation (id, name, product_id)
VALUES (1, "Size", 11);

-- ======================= VARIATION_OPTION =======================

INSERT INTO variation_option (id, value, variation_id)
VALUES (1, "XS", 1),
	   (2, "S", 1),
	   (3, "M", 1),
	   (4, "L", 1),
	   (5, "XL", 1),
	   (6, "XXL", 1),
	   (7, "3XL", 1);

-- ======================= PRODUCT_CONFIGURATION =======================

INSERT INTO product_configuration (product_item_id, variation_option_id)
VALUES (11, 1);














