DELIMITER $$

CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
END$$

CREATE PROCEDURE CalculateUserTotal(IN p_user_id INT, OUT total DECIMAL(10,2))
BEGIN
    SELECT COALESCE(SUM(oi.price_at_purchase * oi.quantity), 0)
    INTO total
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = p_user_id;
END$$

DELIMITER ;
