CREATE TABLE sample.stores (
 store_id INT PRIMARY KEY,
 store_name VARCHAR (255) NOT NULL,
 phone VARCHAR (25),
 email VARCHAR (255),
 street VARCHAR (255),
 city VARCHAR (255),
 state VARCHAR (10),
 zip_code VARCHAR (5)
);

CREATE TABLE sample.staffs (
 staff_id INT PRIMARY KEY,
 first_name VARCHAR (50) NOT NULL,
 last_name VARCHAR (50) NOT NULL,
 email VARCHAR (255) NOT NULL UNIQUE,
 phone VARCHAR (25),
 active tinyint NOT NULL,
 store_id INT NOT NULL,
 manager_id INT,
 FOREIGN KEY (store_id) 
        REFERENCES sample.stores (store_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (manager_id) 
        REFERENCES sample.staffs (staff_id) 
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE sample.customers (
 customer_id INT PRIMARY KEY,
 first_name VARCHAR (255) NOT NULL,
 last_name VARCHAR (255) NOT NULL,
 phone VARCHAR (25),
 email VARCHAR (255) NOT NULL,
 street VARCHAR (255),
 city VARCHAR (50),
 state VARCHAR (25),
 zip_code VARCHAR (5)
);

CREATE TABLE sample.orders (
 order_id INT PRIMARY KEY,
 customer_id INT,
 order_status tinyint NOT NULL,
 -- Order status: 1 = Pending; 2 = Processing; 3 = Rejected; 4 = Completed
 order_date DATE NOT NULL,
 required_date DATE NOT NULL,
 shipped_date DATE,
 store_id INT NOT NULL,
 staff_id INT NOT NULL,
 FOREIGN KEY (customer_id) 
        REFERENCES sample.customers (customer_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (store_id) 
        REFERENCES sample.stores (store_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (staff_id) 
        REFERENCES sample.staffs (staff_id) 
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE sample.order_items(
 order_id INT,
 item_id INT,
 product_id INT NOT NULL,
 quantity INT NOT NULL,
 list_price DECIMAL (10, 2) NOT NULL,
 discount DECIMAL (4, 2) NOT NULL DEFAULT 0,
 PRIMARY KEY (order_id, item_id),
 FOREIGN KEY (order_id) 
        REFERENCES sample.orders (order_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
);