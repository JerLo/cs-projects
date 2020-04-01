INSERT INTO sample.customers(customer_id, first_name, last_name, phone, email, street, city, state, zip_code) 
VALUES(259,'Debra','Burks',NULL,'debra.burks@yahoo.com','9273 Thorne Ave. ','Orchard Park','NY',14127),
(1212,'Kasha','Todd',NULL,'kasha.todd@yahoo.com','910 Vine Street ','Campbell','CA',95008),
(523,'Tameka','Fisher',NULL,'tameka.fisher@aol.com','769C Honey Creek St. ','Redondo Beach','CA',90278);
(175,'Daryl','Spence',NULL,'daryl.spence@aol.com','988 Pearl Lane ','Uniondale','NY',11553),
(1324,'Charolette','Rice','(916) 381-6003','charolette.rice@msn.com','107 River Dr. ','Sacramento','CA',95820),
(94,'Lyndsey','Bean',NULL,'lyndsey.bean@hotmail.com','769 West Road ','Fairport','NY',14450),
(324,'Latasha','Hays','(716) 986-3359','latasha.hays@hotmail.com','7014 Manor Station Rd. ','Buffalo','NY',14215),
(1204,'Jacquline','Duncan',NULL,'jacquline.duncan@yahoo.com','15 Brown St. ','Jackson Heights','NY',11372),
(60,'Genoveva','Baldwin',NULL,'genoveva.baldwin@msn.com','8550 Spruce Drive ','Port Washington','NY',11050),
(442,'Pamelia','Newman',NULL,'pamelia.newman@gmail.com','476 Chestnut Ave. ','Monroe','NY',10950);

INSERT INTO sample.stores(store_id, store_name, phone, email, street, city, state, zip_code)
VALUES(1,'Santa Cruz Bikes','(831) 476-4321','santacruz@bikes.shop','3700 Portola Drive', 'Santa Cruz','CA',95060),
(2,'Baldwin Bikes','(516) 379-8888','baldwin@bikes.shop','4200 Chestnut Lane', 'Baldwin','NY',11432),
(3,'Rowlett Bikes','(972) 530-5555','rowlett@bikes.shop','8000 Fairway Avenue', 'Rowlett','TX',75088);

INSERT INTO sample.staffs(staff_id, first_name, last_name, email, phone, active, store_id, manager_id) 
VALUES(1,'Fabiola','Jackson','fabiola.jackson@bikes.shop','(831) 555-5554',1,1,NULL),
(2,'Mireya','Copeland','mireya.copeland@bikes.shop','(831) 555-5555',1,1,1),
(3,'Genna','Serrano','genna.serrano@bikes.shop','(831) 555-5556',1,1,2),
(4,'Virgie','Wiggins','virgie.wiggins@bikes.shop','(831) 555-5557',1,1,2),
(5,'Jannette','David','jannette.david@bikes.shop','(516) 379-4444',1,2,1),
(6,'Marcelene','Boyer','marcelene.boyer@bikes.shop','(516) 379-4445',1,2,5),
(7,'Venita','Daniel','venita.daniel@bikes.shop','(516) 379-4446',1,2,5),
(8,'Kali','Vargas','kali.vargas@bikes.shop','(972) 530-5555',1,3,1),
(9,'Layla','Terrell','layla.terrell@bikes.shop','(972) 530-5556',1,3,7),
(10,'Bernardine','Houston','bernardine.houston@bikes.shop','(972) 530-5557',1,3,7);

INSERT INTO sample.orders(order_id, customer_id, order_status, order_date, required_date, shipped_date, store_id,staff_id) 
VALUES(1,259,4,'20160101','20160103','20160103',1,2),
(2,1212,4,'20160101','20160104','20160103',2,6),
(3,523,4,'20160102','20160105','20160103',2,7),
(4,175,4,'20160103','20160104','20160105',1,3),
(5,1324,4,'20160103','20160106','20160106',2,6),
(6,94,4,'20160104','20160107','20160105',2,6),
(7,324,4,'20160104','20160107','20160105',2,6),
(8,1204,4,'20160104','20160105','20160105',2,7),
(9,60,4,'20160105','20160108','20160108',1,2),
(10,442,4,'20160105','20160106','20160106',2,6);

INSERT INTO sample.order_items(order_id, item_id, product_id, quantity, list_price,discount) 
VALUES(1,1,20,1,599.99,0.2),
(1,2,8,2,1799.99,0.07),
(1,3,10,2,1549.00,0.05),
(1,4,16,2,599.99,0.05),
(1,5,4,1,2899.99,0.2),
(2,1,20,1,599.99,0.07),
(2,2,16,2,599.99,0.05),
(3,1,3,1,999.99,0.05),
(3,2,20,1,599.99,0.05),
(4,1,2,2,749.99,0.1);
