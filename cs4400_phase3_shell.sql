-- CS4400: Introduction to Database Systems
-- Bank Management Project - Phase 3 (v2)
-- Generating Stored Procedures & Functions for the Use Cases
-- April 4th, 2022

-- implement these functions and stored procedures on the project database
use bank_management;

-- [1] create_corporation()
-- This stored procedure creates a new corporation
drop procedure if exists create_corporation;
delimiter //
create procedure create_corporation (in ip_corpID varchar(100),
    in ip_shortName varchar(100), in ip_longName varchar(100),
    in ip_resAssets integer)
begin
    insert into corporation (corpID, shortName, longName, resAssets)
    values (ip_corpID, ip_shortName, ip_longName, ip_resAssets);
end //
delimiter ;

-- [2] create_bank()
-- This stored procedure creates a new bank that is owned by an existing corporation
-- The corporation must also be managed by a valid employee [being a manager doesn't leave enough time for other jobs]
drop procedure if exists create_bank;
delimiter //
create procedure create_bank (in ip_bankID varchar(100), in ip_bankName varchar(100),
	in ip_street varchar(100), in ip_city varchar(100), in ip_state char(2),
    in ip_zip char(5), in ip_resAssets integer, in ip_corpID varchar(100),
    in ip_manager varchar(100), in ip_bank_employee varchar(100))
begin
	-- Implement your code heres
    INSERT INTO bank
    SELECT ip_bankID, ip_bankName, ip_street, ip_city, ip_state, ip_zip, ip_resAssets, ip_corpID, ip_manager
    WHERE ip_corpID in (select corpID from corporation) and ip_manager not in (SELECT manager FROM bank WHERE bankID != ip_bankID) and ip_bank_employee in (SELECT perID from employee) and ip_bank_employee not in (Select manager from bank);
	INSERT INTO workFor
    SELECT ip_bankID, ip_bank_employee
    WHERE ip_corpID in (select corpID from corporation) and ip_manager not in (SELECT manager FROM bank WHERE bankID != ip_bankID) and ip_bank_employee in (SELECT perID from employee) and ip_bank_employee not in (Select manager from bank);
    -- call create_bank('BA_North','Bank of America New York','150 Broadway','New York','NY','10038', 359000,'BA', 'lgibbs4', 'cboyle99')

    -- (bankID, bankName, street, city, state, zip, resAssets, corpID, manager) 
end //
delimiter ;

-- [3] start_employee_role()
-- If the person exists as an admin or employee then don't change the database state [not allowed to be admin along with any other person-based role]
-- If the person doesn't exist then this stored procedure creates a new employee
-- If the person exists as a customer then the employee data is added to create the joint customer-employee role
drop procedure if exists start_employee_role;
delimiter //
create procedure start_employee_role (in ip_perID varchar(100), in ip_taxID char(11),
	in ip_firstName varchar(100), in ip_lastName varchar(100), in ip_birthdate date,
    in ip_street varchar(100), in ip_city varchar(100), in ip_state char(2),
    in ip_zip char(5), in ip_dtJoined date, in ip_salary integer,
    in ip_payments integer, in ip_earned integer, in emp_password  varchar(100))
begin
	declare isEmployee int default 0;
    declare isAdmin int default 0;
    declare isPerson int default 0;
    declare isCustomer int default 0;
    
	select count(*) into isEmployee from employee where perID = ip_perID;
    select count(*) into isAdmin from system_admin where perID = ip_perID;
	select count(*) into isPerson from person where perID = ip_perID;
    select count(*) into isCustomer from customer where perID = ip_perID;
    
	-- Sanity check that person is not already admin or employee
    if (isEmployee = 0 and isAdmin = 0) then
		-- If person doesn't exist
		if (isPerson = 0) then
			insert into person values (ip_perID, emp_password);
            insert into bank_user values (ip_perID, ip_taxID, ip_birthdate, ip_firstName, ip_lastName, ip_dtJoined, ip_street, ip_city, ip_state, ip_zip);
            insert into employee values (ip_perID, ip_salary, ip_payments, ip_earned);
		end if;
		-- If person exists as customer
        if (isCustomer = 1) then
			insert into employee values (ip_perID, ip_salary, ip_payments, ip_earned);
		end if;
	end if;
end //
delimiter ;

-- [4] start_customer_role()
-- If the person exists as an admin or customer then don't change the database state [not allowed to be admin along with any other person-based role]
-- If the person doesn't exist then this stored procedure creates a new customer
-- If the person exists as an employee then the customer data is added to create the joint customer-employee role
drop procedure if exists start_customer_role;
delimiter //
create procedure start_customer_role (in ip_perID varchar(100), in ip_taxID char(11),
	in ip_firstName varchar(100), in ip_lastName varchar(100), in ip_birthdate date,
    in ip_street varchar(100), in ip_city varchar(100), in ip_state char(2),
    in ip_zip char(5), in ip_dtJoined date, in cust_password varchar(100))
begin
    declare isAdmin int default 0;
    declare isCustomer int default 0;
    declare isEmployee int default 0;
    declare isPerson int default 0;
    
    select count(*) into isAdmin from system_admin where perID = ip_perID;
    select count(*) into isCustomer from customer where perID = ip_perID;
    select count(*) into isEmployee from employee where perID = ip_perID;
    select count(*) into isPerson from person where perID = ip_perID;
    
    -- if person is not admin and not customer
    if (isAdmin = 0 and isCustomer = 0) then
		-- if person doesn't exist
		if (isPerson = 0) then
			-- create a new customer
			insert into person values (ip_perID, cust_password);
			insert into bank_user values (ip_perID, ip_taxID, ip_birthdate, ip_firstName, ip_lastName, ip_dtJoined, ip_street, ip_city, ip_state, ip_zip);
			insert into customer values (ip_perID);
		end if;
		-- if person exists as employee, customer data added to create joint role
		if (isEmployee = 1) then
				insert into customer values (ip_perID);
		end if;
	end if;
end //
delimiter ;

-- [5] stop_employee_role()
-- If the person doesn't exist as an employee then don't change the database state
-- If the employee manages a bank or is the last employee at a bank then don't change the database state [each bank must have a manager and at least one employee]
-- If the person exists in the joint customer-employee role then the employee data must be removed, but the customer information must be maintained
-- If the person exists only as an employee then all related person data must be removed
drop procedure if exists stop_employee_role;
delimiter //
create procedure stop_employee_role (in ip_perID varchar(100))
BEGIN
    DECLARE isEmployee INT DEFAULT 0;
    DECLARE isManager INT DEFAULT 0;
    DECLARE numEmployees INT DEFAULT 0;
    DECLARE isCustomer INT DEFAULT 0;


    SELECT count(*) INTO isEmployee FROM employee WHERE perID = ip_perID;
    SELECT count(*) INTO isManager FROM bank WHERE manager = ip_perID;
    SELECT count(*) INTO numEmployees FROM workFor where bankID = (SELECT bankID from workFor where perID = ip_perID);
    SELECT count(*) INTO isCustomer FROM customer WHERE perID = ip_perID;


    -- if person is employee
    IF (isEmployee = 1) THEN

        -- if person is not manager and person is not last employee
        IF (isManager != 1 and numEmployees > 1) THEN

            -- if person is customer
            IF (isCustomer = 1) THEN

                DELETE FROM workFor where perID = ip_perID;
                DELETE FROM employee where perID = ip_perID;

            ELSE

                DELETE FROM workFor where perID = ip_perID;
                DELETE FROM employee where perID = ip_perID;
                DELETE FROM bank_user where perID = ip_perID;
                DELETE FROM person where perID = ip_perID;

            END IF;
        END IF;
    END IF;
END //
delimiter ;

-- [6] stop_customer_role()
-- If the person doesn't exist as an customer then don't change the database state
-- If the customer is the only holder of an account then don't change the database state [each account must have at least one holder]
-- If the person exists in the joint customer-employee role then the customer data must be removed, but the employee information must be maintained
-- If the person exists only as a customer then all related person data must be removed
drop procedure if exists stop_customer_role;
delimiter //
create procedure stop_customer_role (in ip_perID varchar(100))
begin
    IF ip_perID in (Select perID from customer) THEN 
		IF (SELECT count(*) FROM access WHERE ip_perID = perID GROUP BY accountID) >= 1 THEN 
			DELETE from customer_contacts WHERE ip_perID = perID;
			DELETE FROM access WHERE ip_perID = perID;
			DELETE from customer WHERE ip_perID = perID;
			DELETE FROM	bank_user WHERE ip_perID = perID; 
            IF ip_perID not in (Select perID from employee) THEN
				DELETE from person WHERE ip_perID = perID;
            END IF;
		END IF;
	END IF;
end //
delimiter ;

-- [7] hire_worker()
-- If the person is not an employee then don't change the database state
-- If the worker is a manager then then don't change the database state [being a manager doesn't leave enough time for other jobs]
-- Otherwise, the person will now work at the assigned bank in addition to any other previous work assignments
-- Also, adjust the employee's salary appropriately
drop procedure if exists hire_worker;
delimiter //
create procedure hire_worker (in ip_perID varchar(100), in ip_bankID varchar(100),
	in ip_salary integer)
begin
	declare isEmployee int default 0;
    declare isManager int default 0;
    
	select count(*) into isEmployee from employee where perID = ip_perID;
    select count(*) into isManager from bank where manager = ip_perID;
    
    -- Must be an employee already
    if (isEmployee = 1) then
		-- Must not be a manager to be added
		if (isManager = 0) then
			insert into workfor values (ip_bankID, ip_perID);
            update employee set salary = ifnull(salary, 0) + ip_salary where perID = ip_perID;
		end if;
	end if;
end //
delimiter ;

-- [8] replace_manager()
-- If the new person is not an employee then don't change the database state
-- If the new person is a manager or worker at any bank then don't change the database state [being a manager doesn't leave enough time for other jobs]
-- Otherwise, replace the previous manager at that bank with the new person
-- The previous manager's association as manager of that bank must be removed
-- Adjust the employee's salary appropriately
drop procedure if exists replace_manager;
delimiter //
create procedure replace_manager (in ip_perID varchar(100), in ip_bankID varchar(100),
    in ip_salary integer)
begin
    declare isEmployee int default 0;
    declare isManager int default 0;
    declare isWorker int default 0;
    
    select count(*) into isEmployee from employee where perID = ip_perID;
    select count(*) into isManager from bank where manager = ip_perID; 
    select count(*) into isWorker from workFor where perID = ip_perID;
    
    -- if employee
    if (isEmployee = 1) then
        -- if not manager or worker
        if (isManager = 0 and isWorker = 0) then
			-- add worker
            -- insert into workFor values (ip_perID, ip_bankID);
            -- replace previous manager with new person
            update bank set manager = ip_perID where bankID = ip_bankID;
            -- update salary
            update employee set salary = ifnull(salary, 0) + ip_salary where perID = ip_perID;
        end if;
    end if;
end //

-- [9] add_account_access()
-- If the account does not exist, create a new account. If the account exists, add the customer to the account
-- When creating a new account:
    -- If the person opening the account is not an admin then don't change the database state
    -- If the intended customer (i.e. ip_customer) is not a customer then don't change the database state
    -- Otherwise, create a new account owned by the designated customer
    -- The account type will be determined by the enumerated ip_account_type variable
    -- ip_account_type in {checking, savings, market}
-- When adding a customer to an account:
    -- If the person granting access is not an admin or someone with access to the account then don't change the database state
    -- If the intended customer (i.e. ip_customer) is not a customer then don't change the database state
    -- Otherwise, add the new customer to the existing account
drop procedure if exists add_account_access;
delimiter //
create procedure add_account_access (in ip_requester varchar(100), in ip_customer varchar(100),
	in ip_account_type varchar(10), in ip_bankID varchar(100),
    in ip_accountID varchar(100), in ip_balance integer, in ip_interest_rate integer,
    in ip_dtDeposit date, in ip_minBalance integer, in ip_numWithdrawals integer,
    in ip_maxWithdrawals integer, in ip_dtShareStart date)
begin
	DECLARE accountExists INT DEFAULT 0;
    DECLARE isAdmin INT DEFAULT 0;
    DECLARE isCustomer INT DEFAULT 0;
    DECLARE hasAccess INT DEFAULT 0;
    
    SELECT count(*) INTO accountExists FROM bank_account where bankID = ip_bankID AND accountID = ip_accountID;
    
    -- If account doesn't exist, create it
    IF (accountExists != 1) THEN
		    SELECT count(*) INTO isAdmin FROM system_admin WHERE perID = ip_requester;
            
            IF (isAdmin = 1) THEN
				SELECT count(*) INTO isCustomer FROM customer WHERE perID = ip_customer;
		
                IF (isCustomer = 1) THEN
					-- create account
					INSERT INTO bank_account (bankID, accountID, balance) 
					VALUES (ip_bankID, ip_accountID, ip_balance);
                    
                    INSERT INTO access (perID, bankID, accountID, dtShareStart, dtAction)
                    VALUES (ip_customer, ip_bankID, ip_accountID, ip_dtShareStart, NULL);
                    
                    -- create acount type
                    IF ip_account_type = 'checking' THEN
					
                       INSERT INTO checking (bankID, accountID, protectionBank, protectionAccount, amount, dtOverdraft)
                       VALUES (ip_bankID, ip_accountID, NULL, NULL, NULL, NULL);
                       
                    ELSEIF ip_account_type = 'savings' THEN
						
						INSERT INTO interest_bearing (bankID, accountID, interest_rate, dtDeposit)
                        VALUES (ip_bankID, ip_accountID, ip_interest_rate, ip_dtDeposit);
                        
                        INSERT INTO savings (bankID, accountID, minBalance)
                        VALUES (ip_bankID, ip_accountID, ip_minBalance);
                        
                    ELSEIF ip_account_type = 'market' THEN
                    
						INSERT INTO interest_bearing (bankID, accountID, interest_rate, dtDeposit)
                        VALUES (ip_bankID, ip_accountID, ip_interest_rate, ip_dtDeposit);
                        
                        INSERT INTO market (bankID, accountID, maxWithdrawals, numWithdrawals)
                        VALUES (ip_bankID, ip_accountID, ip_maxWithdrawals, ip_numWithdrawals);
                        
                    END IF;
                END IF;
            END IF;
            
	-- else if account does exist
    ELSE
    
		SELECT count(*) INTO isAdmin FROM system_admin WHERE perID = ip_requester;
        SELECT count(*) INTO hasAccess FROM access WHERE perID = ip_requester AND bankID = ip_bankID AND accountID = ip_accountID;
        
        -- if requester is no admin or has access to account, do nothing 
        IF (isAdmin = 1 OR hasAccess = 1) THEN
	
			SELECT count(*) INTO isCustomer FROM customer WHERE perID = ip_customer;
            
            -- if ip_customer is not customer, do nothing
            IF (isCustomer) THEN
            
				INSERT INTO access (perID, bankID, accountID, dtShareStart, dtAction)
				VALUES (ip_customer, ip_bankID, ip_accountID, ip_dtShareStart, NULL);
            
            END IF;
        END IF;
    END IF;
    
end //
delimiter ;

-- [10] remove_account_access()
-- Remove a customer's account access. If they are the last customer with access to the account, close the account
-- When just revoking access:
    -- If the person revoking access is not an admin or someone with access to the account then don't change the database state
    -- Otherwise, remove the designated sharer from the existing account
-- When closing the account:
    -- If the customer to be removed from the account is NOT the last remaining owner/sharer then don't close the account
    -- If the person closing the account is not an admin or someone with access to the account then don't change the database state
    -- Otherwise, the account must be closed
drop procedure if exists remove_account_access;
delimiter //
create procedure remove_account_access (in ip_requester varchar(100), in ip_sharer varchar(100),
	in ip_bankID varchar(100), in ip_accountID varchar(100))
begin
	IF ip_requester in (SELECT perID from system_admin) or ip_requester in (SELECT perID from access WHERE ip_accountID = accountID and ip_bankID = bankID) or ip_requester in (SELECT perID from workFor where ip_bankID = bankID) THEN
		DELETE FROM access where ip_sharer = perID and ip_accountID = accountID and ip_bankID = bankID;
        IF (SELECT count(*) FROM access where accountID = ip_accountID and bankID = ip_bankID) < 1 THEN
			DELETE FROM savings WHERE ip_accountID = accountID and ip_bankID = bankID; 
            DELETE FROM market WHERE ip_accountID = accountID and ip_bankID = bankID; 
            DELETE FROM interest_bearing_fees WHERE ip_accountID = accountID and ip_bankID = bankID; 
            DELETE FROM interest_bearing WHERE ip_accountID = accountID and ip_bankID = bankID; 
            DELETE FROM checking WHERE ip_accountID = accountID and ip_bankID = bankID; 
            DELETE FROM bank_account WHERE ip_accountID = accountID and ip_bankID = bankID; 
		END IF;
	END IF; 
end //
delimiter ;

-- [11] create_fee()
drop procedure if exists create_fee;
delimiter //
create procedure create_fee (in ip_bankID varchar(100), in ip_accountID varchar(100),
	in ip_fee_type varchar(100))
begin
	insert into interest_bearing_fees values (ip_bankID, ip_accountID, ip_fee_type);
    -- end if;
end //
delimiter ;

-- [12] start_overdraft()
drop procedure if exists start_overdraft;
delimiter //
create procedure start_overdraft (in ip_requester varchar(100),
	in ip_checking_bankID varchar(100), in ip_checking_accountID varchar(100),
    in ip_savings_bankID varchar(100), in ip_savings_accountID varchar(100))
begin
	declare checkingExists int default 0;
    declare savingsExists int default 0;
    declare hasAccess int default 0;
    
    -- check if person has access to both
    
    
    select count(*) into checkingExists from checking where checking.bankID = ip_checking_bankID and checking.accountID = ip_checking_accountID;
    select count(*) into savingsExists from savings where savings.bankID = ip_savings_bankID and savings.accountID = ip_savings_accountID;
    select count(*) into hasAccess from access where access.bankID = ip_checking_bankID and access.accountID = ip_checking_accountID;
    select count(*) into hasAccess from access where access.bankID = ip_savings_bankID and access.accountID = ip_savings_accountID;
    
    if (savingsExists = 1 and checkingExists = 1 and hasAccess = 2) then
		update checking set protectionBank = ip_savings_bankID, protectionAccount = ip_savings_accountID where bankID = ip_checking_bankID and accountID = ip_checking_accountID;
    end if;
end //
delimiter ;

-- [13] stop_overdraft()
drop procedure if exists stop_overdraft;
delimiter //
create procedure stop_overdraft (in ip_requester varchar(100),
    in ip_checking_bankID varchar(100), in ip_checking_accountID varchar(100))
begin

    DECLARE isAdmin INT DEFAULT 0;
    DECLARE hasAccess INT DEFAULT 0;

    SELECT count(*) INTO isAdmin FROM system_admin WHERE perID = ip_requester;
    SELECT count(*) INTO hasAccess FROM access WHERE bankID = ip_checking_bankID AND accountID = ip_checking_accountID AND perID = ip_requester;

    IF (isAdmin = 1 or hasAccess = 1) THEN

        UPDATE checking
        SET protectionBank = NULL, protectionAccount = NULL
        WHERE bankID = ip_checking_bankID AND accountId = ip_checking_accountID;

    END IF;

end //
delimiter ;

-- [14] account_deposit()
-- If the person making the deposit does not have access to the account then don't change the database state
-- Otherwise, the account balance and related info must be modified appropriately
drop procedure if exists account_deposit;
delimiter //
create procedure account_deposit (in ip_requester varchar(100), in ip_deposit_amount integer,
	in ip_bankID varchar(100), in ip_accountID varchar(100), in ip_dtAction date)
begin
	IF ip_requester in (SELECT perID from system_admin) or ip_requester in (SELECT perID from access WHERE ip_accountID = accountID and ip_bankID = bankID) or ip_requester in (SELECT perID from workFor where ip_bankID = bankID) THEN
		UPDATE bank_account SET balance = balance + ip_deposit_amount WHERE ip_accountID = accountID and bankID = ip_bankID;
        UPDATE access SET dtAction = ip_dtAction WHERE ip_accountID = accountID and bankID = ip_bankID;
        UPDATE interest_bearing SET dtDeposit = ip_dtAction WHERE ip_accountID = accountID and bankID = ip_bankID;
	END IF; 
end //
delimiter ;

-- [15] account_withdrawal()
-- If the person making the withdrawal does not have access to the account then don't change the database state
-- If the withdrawal amount is more than the account balance for a savings or market account then don't change the database state [the account balance must be positive]
-- If the withdrawal amount is more than the account balance + the overdraft balance (i.e., from the designated savings account) for a checking account then don't change the database state [the account balance must be positive]
-- Otherwise, the account balance and related info must be modified appropriately (amount deducted from the primary account first, and second from the overdraft account as needed)
drop procedure if exists account_withdrawal;
delimiter //
create procedure account_withdrawal (in ip_requester varchar(100), in ip_withdrawal_amount integer,
	in ip_bankID varchar(100), in ip_accountID varchar(100), in ip_dtAction date)
begin
	-- Check person has access
    declare isInterestBearing int default 0;
    declare isChecking int default 0;
    declare isValidPerson int default 0;
    
    declare ovr_bankID varchar(100) default null;
    declare ovr_accountID varchar(100) default null;
    declare overdraft int default 0;
    
	select count(*) into isInterestBearing from interest_bearing where ip_bankID = bankID and ip_accountID = accountID;
    select count(protectionAccount) into isChecking from checking where ip_bankID = bankID and ip_accountID = accountID;
    select count(*) into isValidPerson from access where ip_requester = perID and ip_accountID = accountID and ip_bankID = bankID;
    
    if (isValidPerson = 1) then
		-- find account and balance
        if (isChecking = 0) then
			if ((select balance from bank_account where ip_bankID = bankID and ip_accountID = accountID) >= ip_withdrawal_amount) then
				-- remove money from account
                update bank_account set balance = balance - ip_withdrawal_amount where ip_bankID = bankID and ip_accountID = accountID;
                -- update market account withdrawals, if applicable
                update market set numWithdrawals = numWithdrawals + 1 where ip_bankID = bankID and ip_accountID = accountID;
                -- update access date
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_bankID = bankID and ip_accountID = accountID;
            end if;
        end if;
        -- if checking, find the overdraft
        if (isChecking = 1) then
			select protectionBank into ovr_bankID from checking where ip_accountID = accountID and ip_bankID = bankID;
            select protectionAccount into ovr_accountID from checking where ip_accountID = accountID and ip_bankID = bankID;
            -- check if money can be withdrawn
			if ((select balance from bank_account where ip_bankID = bankID and ip_accountID = accountID) + 
					(select balance from bank_account where ovr_bankID = bankID and ovr_accountID = accountID) 
					>= ip_withdrawal_amount) then
				-- remove money from account (and maybe overdraft)
                select balance - ip_withdrawal_amount into overdraft from bank_account where ip_accountID = accountID and ip_bankID = bankID;
                if (overdraft <= 0) then
					-- overdraft
                    update bank_account set balance = 0 where ip_bankID = bankID and ip_accountID = accountID;
                    update bank_account set balance = balance + overdraft where ovr_bankID = bankID and ovr_accountID = accountID;
                    -- update overdraft stats
                    update checking set amount = overdraft * -1, dtOverdraft = ip_dtAction where ip_bankID = bankID and ip_accountID = accountID;
                    update access set dtAction = ip_dtAction where ip_requester = perID and ovr_bankID = bankID and ovr_accountID = accountID;
                else 
					-- regular withdrawal
                    -- select * from bank_account;
                    update bank_account set balance = balance - ip_withdrawal_amount where ip_bankID = bankID and ip_accountID = accountID;
                end if;
                -- update access date
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_bankID = bankID and ip_accountID = accountID;
            end if;
        end if;
        
    end if;
end //
delimiter ;

-- [16] account_transfer()
-- If the person making the transfer does not have access to both accounts then don't change the database state
-- If the withdrawal amount is more than the account balance for a savings or market account then don't change the database state [the account balance must be positive]
-- If the withdrawal amount is more than the account balance + the overdraft balance (i.e., from the designated savings account) for a checking account then don't change the database state [the account balance must be positive]
-- Otherwise, the account balance and related info must be modified appropriately (amount deducted from the withdrawal account first, and second from the overdraft account as needed, and then added to the deposit account)
drop procedure if exists account_transfer;
delimiter //
create procedure account_transfer (in ip_requester varchar(100), in ip_transfer_amount integer,
	in ip_from_bankID varchar(100), in ip_from_accountID varchar(100),
    in ip_to_bankID varchar(100), in ip_to_accountID varchar(100), in ip_dtAction date)
begin

    declare isInterestBearing int default 0;
    declare isChecking int default 0; -- yes
    declare isValidPerson int default 0; -- yes
    
    declare ovr_bankID varchar(100) default null;
    declare ovr_accountID varchar(100) default null;
    declare overdraft int default 0;
    
	select count(*) into isInterestBearing from interest_bearing where ip_from_bankID = bankID and ip_from_accountID = accountID;
    select count(*) into isChecking from checking where ip_from_bankID = bankID and ip_from_accountID = accountID;
    select count(*) into isValidPerson from access where (ip_requester = perID and ip_from_accountID = accountID and ip_from_bankID = bankID) or (ip_requester = perID and ip_to_accountID = accountID and ip_to_bankID = bankID);
    
    -- if person has access to both accounts
    if (isValidPerson = 2) then
		-- if market or savings
        if (isInterestBearing = 1) then
			-- if withdrawal amount less than or equal to the account's balance
			if ((select balance from bank_account where ip_from_bankID = bankID and ip_from_accountID = accountID) >= ip_transfer_amount) then
				-- remove money from account
                update bank_account set balance = balance - ip_transfer_amount where ip_from_bankID = bankID and ip_from_accountID = accountID;
                -- update market account withdrawals, if applicable
                update market set numWithdrawals = numWithdrawals + 1 where ip_from_bankID = bankID and ip_from_accountID = accountID;
                -- update access date of from account
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_from_bankID = bankID and ip_from_accountID = accountID;
                -- update access date of to account
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_to_bankID = bankID and ip_to_accountID = accountID;
                -- add money to account 
                update bank_account set balance = balance + ip_transfer_amount where ip_to_bankID = bankID and ip_to_accountID = accountID;
            end if;
        end if;
        -- if checking
        if (isChecking = 1) then
			-- variables determining the protection account for that checking account (if has)
			select protectionBank into ovr_bankID from checking where ip_from_bankID = bankID and ip_from_accountID = accountID;
            select protectionAccount into ovr_accountID from checking where ip_from_accountID = accountID and ip_from_bankID = bankID;
            -- check if money can be withdrawn from that account
            if ((select balance from bank_account where ip_from_bankID = bankID and ip_from_accountID = accountID) >= ip_transfer_amount) then
				-- select 'money';
				-- remove money from account
                update bank_account set balance = balance - ip_transfer_amount where ip_from_bankID = bankID and ip_from_accountID = accountID;
                -- update access date of from account
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_from_bankID = bankID and ip_from_accountID = accountID;
                -- update access date of to account
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_to_bankID = bankID and ip_to_accountID = accountID;
                -- add money to account 
                update bank_account set balance = (ifnull(balance, 0) + ip_transfer_amount) where ip_to_bankID = bankID and ip_to_accountID = accountID;
            end if;
			else if (((select balance from bank_account where ip_from_bankID = bankID and ip_from_accountID = accountID) + 
					(select balance from bank_account where ovr_bankID = bankID and ovr_accountID = accountID))
					>= ip_transfer_amount) then
				-- remove money from account (and maybe overdraft)
                -- select balance - ip_transfer_amount into overdraft from bank_account where ip_from_accountID = accountID and ip_from_bankID = bankID;
                -- if (overdraft <= 0) then
					-- overdraft
				update bank_account set balance = 0 where ip_from_bankID = bankID and ip_from_accountID = accountID;
				update bank_account set balance = balance + overdraft where ovr_bankID = bankID and ovr_accountID = accountID;
                    -- update overdraft stats
				update checking set amount = overdraft * -1, dtOverdraft = ip_dtAction where ip_from_bankID = bankID and ip_from_accountID = accountID;
                -- end if;
                -- update access date of fromn account
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_from_bankID = bankID and ip_from_accountID = accountID;
				-- update access date of to account
                update access set dtAction = ip_dtAction where ip_requester = perID and ip_to_bankID = bankID and ip_to_accountID = accountID;
                update access set dtAction = ip_dtAction where ip_requester = perID and ovr_bankID = bankID and ovr_accountID = accountID;
                -- add money to account 
                update bank_account set balance = (ifnull(balance, 0) + ip_transfer_amount) where ip_to_bankID = bankID and ip_to_accountID = accountID;
            end if;
        end if;
    end if;
end //
delimiter ;

-- [17] pay_employees()
-- Increase each employee's pay earned so far by the monthly salary
-- Deduct the employee's pay from the banks reserved assets
-- If an employee works at more than one bank, then deduct the (evenly divided) monthly pay from each of the affected bank's reserved assets
-- Truncate any fractional results to an integer before further calculations
drop procedure if exists pay_employees;
delimiter //
create procedure pay_employees ()
begin

    DECLARE cur_perID VARCHAR(100) DEFAULT '';
    DECLARE employeeSalary INT DEFAULT 0;
    DECLARE numBanks INT DEFAULT 0;
    DECLARE toRemoveFromBanks INT DEFAULT 0;
    DECLARE finished INTEGER DEFAULT 0;

    -- Create cursor to iterate through rows
    DECLARE employeeCursor CURSOR FOR SELECT perID FROM employee;
 
    -- Create not found handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

    
    open employeeCursor;
	SET SQL_SAFE_UPDATES = 0;
    payEmployee: LOOP
        FETCH employeeCursor into cur_perID;
        IF finished = 1 THEN
            LEAVE payEmployee;
        END IF;


        SELECT salary INTO employeeSalary FROM employee WHERE perID = cur_perID;

        SELECT count(*) INTO numBanks FROM workFOR WHERE perID = cur_perID;

        UPDATE employee SET payments = IFNULL(payments, 0) + 1, earned = earned + IFNULL(salary, 0) WHERE perID = cur_perID;

        -- if not manager
        IF ((SELECT count(*) FROM bank where manager = cur_perID) != 1) THEN

            IF numBanks != 0 THEN
                SET toRemoveFromBanks = employeeSalary DIV numBanks;
            END IF;



            UPDATE bank 
            SET resAssets = IFNULL(resAssets, 0) - IFNULL(toRemoveFromBanks,0)
            WHERE bankID IN (SELECT bankID FROM workFor WHERE perID = cur_perID);

        END IF;


    END LOOP payEmployee;


    SET SQL_SAFE_UPDATES = 1;
end //
delimiter ;

-- [18] penalize_accounts()
-- For each savings account that is below the minimum balance, deduct the smaller of $100 or 10% of the current balance from the account
-- For each market account that has exceeded the maximum number of withdrawals, deduct the smaller of $500 per excess withdrawal or 20% of the current balance from the account
-- Add all deducted amounts to the reserved assets of the bank that owns the account
-- Truncate any fractional results to an integer before further calculations
drop procedure if exists penalize_accounts;
delimiter //
create procedure penalize_accounts()
begin
	SET SQL_SAFE_UPDATES = 0;
		UPDATE bank_account 
			SET  balance = balance - truncate(balance * .1,0)
            WHERE (balance * .1 < 100) and balance in (select balance from savings where bank_account.accountID = savings.accountID and bank_account.bankID = savings.bankID and balance < minBalance); 
		UPDATE bank_account 
			SET  balance = balance - 100
            WHERE (balance * .1 >100) and balance in (select balance from savings where bank_account.accountID = savings.accountID and bank_account.bankID = savings.bankID and balance < minBalance); 
		UPDATE bank
			SET resAssets = resAssets + truncate((Select * from (Select balance from savings natural join bank_account natural join bank as t where balance < minBalance and (balance * .1 < 100)) as temp)*.1, 0)
            WHERE resAssets in (Select * from (Select t.resAssets from savings natural join bank_account natural join bank as t where balance < minBalance and (balance * .1 < 100)) as temp);
		UPDATE bank
			SET resAssets = resAssets + 100 
            WHERE resAssets in (Select * from (Select t.resAssets from savings natural join bank_account natural join bank as t where balance < minBalance and (balance * .1 > 100)) as temp);
        UPDATE bank_account
			SET balance = balance - truncate((Select * from (select balance from bank_account natural join market WHERE (maxWithdrawals < numWithdrawals) and (balance * .2 < 500)) as temp) * .2, 0)
            WHERE balance in (Select * from (select balance from bank_account natural join market WHERE (maxWithdrawals < numWithdrawals) and (balance * .2 < 500)) as temp); 
		UPDATE bank_account
			SET balance = balance - 100
            WHERE balance in (Select * from (select balance from bank_account natural join market WHERE (maxWithdrawals < numWithdrawals) and (balance * .2 >500)) as temp); 
		UPDATE bank
			SET resAssets = resAssets + truncate((Select * from (select balance from bank_account natural join market WHERE (maxWithdrawals < numWithdrawals) and (balance * .2 < 500)) as temp) * .2, 0)
            WHERE resAssets in (Select * from (Select t.resAssets from (select resAssets from bank natural join bank_account natural join market where maxWithdrawals < numWithdrawals and (balance * .2 < 500)) as t) as temp);
		UPDATE bank
			SET resAssets = resAssets + 100
            WHERE resAssets in (Select * from (Select t.resAssets from (select resAssets from bank natural join bank_account natural join market where maxWithdrawals < numWithdrawals and (balance * .2 > 500)) as t) as temp);
	SET SQL_SAFE_UPDATES = 0;
end //
delimiter ;

-- [19] accrue_interest()
-- For each interest-bearing account that is "in good standing", increase the balance based on the designated interest rate
-- A savings account is "in good standing" if the current balance is equal to or above the designated minimum balance
-- A market account is "in good standing" if the current number of withdrawals is less than or equal to the maximum number of allowed withdrawals
-- Subtract all paid amounts from the reserved assets of the bank that owns the account                                                                       
-- Truncate any fractional results to an integer before further calculations
drop procedure if exists accrue_interest;
delimiter //
create procedure accrue_interest ()
begin
	-- update bank_account where matching specialty account is in good standing
    update bank set resAssets = ifnull(resAssets, 0) - 
		(select ifnull(sum(truncate((select interest_rate from interest_bearing where interest_bearing.bankID = bank_account.bankID and interest_bearing.accountID = bank_account.accountID) * .01 * balance, 0)), 0) from bank_account
		where bank_account.bankID = bank.bankID and 
        (((ifnull((select maxWithdrawals from market where market.bankID = bank_account.bankID and market.accountID = bank_account.accountID), 0) >= ifnull((select numWithdrawals from market where market.bankID = bank_account.bankID and market.accountID = bank_account.accountID), 0) and (select count(*) from market where market.bankID = bank_account.bankID and market.accountID = bank_account.accountID = 1)) 
		or ((balance >= ifnull((select minBalance from savings where savings.bankID = bank_account.bankID and savings.accountID = bank_account.accountID), 0)) and (select count(*) from savings where savings.bankID = bank_account.bankID and savings.accountID = bank_account.accountID))
		)));
    -- not sure how to do the removal tho. Maybe do a first pass to remove, then update? 
    update bank_account set balance = truncate(balance * (1 + (.01 * (select ifnull(interest_rate, 0) from interest_bearing where interest_bearing.bankID = bank_account.bankID and interest_bearing.accountID = bank_account.accountID))), 0) 
		where (ifnull((select maxWithdrawals from market where market.bankID = bank_account.bankID and market.accountID = bank_account.accountID), 0) >= ifnull((select numWithdrawals from market where market.bankID = bank_account.bankID and market.accountID = bank_account.accountID), 0) and (select count(*) from market where market.bankID = bank_account.bankID and market.accountID = bank_account.accountID = 1)) 
		or ((balance >= ifnull((select minBalance from savings where savings.bankID = bank_account.bankID and savings.accountID = bank_account.accountID), 0)) and (select count(*) from savings where savings.bankID = bank_account.bankID and savings.accountID = bank_account.accountID));
end //
delimiter ;

-- [20] display_account_stats()
-- Display the simple and derived attributes for each account, along with the owning bank
create or replace view display_account_stats as
select 
	(select bank.bankName from bank where bankID = any (select bankID from bank where bank.bankID = bank_account.bankID)) as name_of_bank,
	accountID as account_identifier, balance as account_assets,
    (select count(perID) from access where access.accountID = bank_account.accountID and access.bankID = bank_account.bankID) as number_of_owners
from bank_account
where bank_account.bankID = any (select bankID from bank_account);

-- [21] display_bank_stats()
-- Display the simple and derived attributes for each bank, along with the owning corporation
create or replace view display_bank_stats as
select 
    b.bankID as bank_identifier,  
    c.shortName as name_of_corporation,
    b.bankName as name_of_bank,
    b.street, b.city, b.state, b.zip,
    count(ba.accountID) as number_of_accounts,
    b.resAssets as bank_assets,
    IFNULL(b.resAssets, 0) + IFNULL(SUM(ba.balance), 0) as total_assets
from bank b
join corporation c on b.corpID = c.corpID
left join bank_account ba on b.bankID = ba.bankID
group by b.bankID;

-- [22] display_corporation_stats()
-- Display the simple and derived attributes for each corporation
create or replace view display_corporation_stats as
Select c.corpID as corporation_identifier, 
    shortName as short_name, 
    longName as formal_name, 
    count(bank_identifier) as number_of_banks, 
    ifnull(c.resAssets, 0) as corporation_assets, 
    sum(ifnull(b.total_assets, 0)) + ifnull(c.resAssets, 0) as total_assets 
from (Select bank_assets, total_assets, bank_identifier, corpID from display_bank_stats left join bank on bank_identifier = bankID) as b 
right join (Select * from corporation) as c on c.corpID = b.corpID group by c.corpID;

-- [23] display_customer_stats()
-- Display the simple and derived attributes for each customer
-- create or replace view display_customer_stats as
create or replace view display_customer_stats as
select bank_user.perID as person_identifier, taxID as tax_identifier, concat(firstName,' ', lastName) as customer_name, birthdate as date_of_birth, dtjoined as joined_system, street, city, state, zip,
	(select count(perID) from access where access.perID = bank_user.perID) as number_of_accounts,
    (select sum(balance) from bank_account where bankID = any (select bankID from access where access.perID = bank_user.perID) and accountID = any (select accountID from access where access.perID = bank_user.perID)) as customer_assets
from bank_user
where bank_user.perID = any (select perID from customer);

-- [24] display_employee_stats()
-- Display the simple and derived attributes for each employee
create or replace view display_employee_stats as
select
	bank_user.perID as person_identifier,
    taxID as tax_identifier,
	concat(firstName, ' ', lastName) as employee_name,
    birthdate as date_of_birth,
    dtJoined as joined_system,
	street, 
	city, 
	state, 
	zip,
    nullif((select count(workFor.bankID) from workFor where workFor.perID = bank_user.perID), 0) as number_of_banks,
	nullif((select sum(display_bank_stats.total_assets) from display_bank_stats 
		inner join workFor on display_bank_stats.bank_identifier = workFor.bankID and workFor.perID = bank_user.perID), 0) as bank_assets  
from bank_user
where bank_user.perID = any (select perID from employee);

