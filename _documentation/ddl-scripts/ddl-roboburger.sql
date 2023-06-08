--# roboburger DDL
-- USE master;
IF NOT EXISTS (
    SELECT [name]
        FROM sys.databases
        WHERE [name] = N'roboburger'
)
CREATE DATABASE roboburger;

USE roboburger;

--#####################
--# DROP TABLES
--#####################
DROP TABLE IF EXISTS
    [user],
    [verification],
    [order],
    [product_order],
    [product_order_options],
    [transaction],
    [transaction_item],
    [payment],
    [nutritionFacts];
    
--#####################
--# USER
--#####################
CREATE TABLE [user] (
    [user_id]                                       INT CHECK([user_id] > 0) NOT NULL IDENTITY,                         --# Primary Key
    [email]                                         VARCHAR(255) DEFAULT NULL,                                          --#
    [email_status]                                  VARCHAR(3)   DEFAULT NULL,
    [phone_number]                                  VARCHAR(255) DEFAULT NULL,
    [phone_number_status]                           VARCHAR(3)   DEFAULT NULL,                                          --#
    [first_name]                                    VARCHAR(255) DEFAULT NULL,                                          --#
    [last_name]                                     VARCHAR(255) DEFAULT NULL,
    [password]                                      VARCHAR(255) NOT NULL,                                              --#
    [one_time_password]                             VARCHAR(255) DEFAULT NULL,
    [otp_request_time]                              INT          DEFAULT NULL,                                                 --#
    [apple_id]                                      VARCHAR(255) DEFAULT NULL,                                        --#
    [google_id]                                     VARCHAR(255) DEFAULT NULL,                                        --#
    [status]                                        VARCHAR(3)   DEFAULT NULL,  
    [subscription]                                  VARCHAR(3)   DEFAULT NULL,                                          -- SQLINES DEMO *** A (Inactive), SUS (Suspended), DEL (Deleted), INV (Invited)
    [who_added]                                     INT CHECK([who_added] > 0)   DEFAULT NULL,                            --# id of who added   
    [who_updated]                                   INT CHECK([who_updated] > 0) DEFAULT NULL,                          --# id of who updated
    [when_added]                                    INT CHECK([when_added] > 0)  DEFAULT NULL,                           -- SQLINES DEMO *** hen added
    [timestamp]                                     INT CHECK([timestamp] > 0)   DEFAULT NULL,                            -- SQLINES DEMO *** hen updated
    PRIMARY KEY                                     (user_id),                                                          --#
);

--####################--#
--# VERIFICATION
--####################--#
CREATE TABLE [verification](
    [verification_id]                               INT CHECK ([verification_id] > 0) NOT NULL IDENTITY,                -- Primary Key
    [verification_user_id]                          INT CHECK ([verification_user_id] > 0) NOT NULL,                    -- Foreign Key
    [code]                                          VARCHAR(45) DEFAULT NULL,                                           --
    [type]                                          VARCHAR(45) DEFAULT NULL,                                           -- Mobile/Email Verification
    [expiration_date]                               INT CHECK ([expiration_date] > 0) DEFAULT NULL,                     -- unix timestamp of expiration
    [status]                                        VARCHAR(3) DEFAULT NULL,                                            -- ACT (Active), INA (Inactive), SUS (Suspended), DEL (Deleted), INV (Invited)
    [who_added]                                     INT CHECK ([who_added] > 0) DEFAULT NULL,                           -- id of who added
    [who_updated]                                   INT CHECK ([who_updated] > 0) DEFAULT NULL,                         -- id of who updated
    [when_added]                                    INT CHECK ([when_added] > 0) DEFAULT NULL,                          -- unix timestamp when added
    [timestamp]                                     INT CHECK ([timestamp] > 0) DEFAULT NULL,                           -- unix timestamp when updated
    PRIMARY KEY                                     ([verification_id]),                                                --
    CONSTRAINT [fk_verification_user_id]            FOREIGN KEY (verification_user_id) REFERENCES [user]([user_id])
)

--#####################
--# ORDER
--#####################
CREATE TABLE [order] (
  [order_id]        INT CHECK([order_id] > 0)     NOT NULL IDENTITY,
  [user_id]         INT CHECK([user_id] > 0)      DEFAULT NULL,
  [quantity]        INT                           DEFAULT NULL,
  [total_cost]      FLOAT                         DEFAULT NULL,
  [status]          VARCHAR(32)                   NOT NULL DEFAULT 'PENDING',
  [who_added]       INT CHECK([who_added] > 0)    DEFAULT NULL,
  [when_added]      INT CHECK([when_added] > 0)   DEFAULT NULL,
  [who_updated]     INT CHECK([who_updated] > 0)  DEFAULT NULL,
  timestamp         INT                           DEFAULT NULL,
  PRIMARY KEY ([order_id]),
  CONSTRAINT [order_user_id] FOREIGN KEY (user_id) REFERENCES [user] (user_id)
);

CREATE INDEX [order_user_id] ON [order]([user_id]);

--#####################
--# PRODUCT_ORDER
--#####################
CREATE TABLE [product_order] (
  [product_order_id]    INT CHECK([product_order_id] > 0)             NOT NULL IDENTITY,
  [product_id]          INT CHECK([product_id] > 0)                   NOT NULL,
  [order_id]            INT CHECK([order_id] > 0)                     NOT NULL,
  [quantity]            INT CHECK([quantity] > 0)                     NOT NULL,
  [vending_machine_id]  INT                                           NOT NULL,
  [timestamp]           INT                                           DEFAULT NULL,
  [when_added]          INT                                           DEFAULT NULL,
  [who_added]           INT                                           DEFAULT NULL,
  [who_updated]         INT                                           DEFAULT NULL,
  PRIMARY KEY ([product_order_id]),
  CONSTRAINT [FK2enlqlbvrcvijyjxhbqfxub72] FOREIGN KEY (order_id) REFERENCES [order](order_id)
);

CREATE INDEX [product_order_product_id] ON [product_order]([product_id]);
CREATE INDEX [FK2enlqlbvrcvijyjxhbqfxub72] ON [product_order]([order_id]);

CREATE TABLE [product_order_options] (
  [po_options_id]       INT CHECK([po_options_id] > 0) NOT NULL IDENTITY,
  [product_order_id]    INT DEFAULT NULL,
  [options_id]          INT NOT NULL,
  [timestamp]           INT                               DEFAULT NULL,
  [when_added]          INT                               DEFAULT NULL,
  [who_added]           INT                               DEFAULT NULL,
  [who_updated]         INT                               DEFAULT NULL,
  PRIMARY KEY ([po_options_id]),
  CONSTRAINT [product_options_order_id] FOREIGN KEY (product_order_id) REFERENCES [product_order](product_order_id)
)

--#####################
--# TRANSACTION
--#####################
CREATE TABLE [transaction] (
  [transaction_id]  INT       NOT NULL IDENTITY,
  [order_id]        INT       DEFAULT NULL,
  [user_id]         INT       DEFAULT NULL,
  [coupon_id]       INT       DEFAULT NULL,
  [fees]            FLOAT        DEFAULT NULL,
  [total]           FLOAT        DEFAULT NULL,
  [timestamp]       INT       DEFAULT NULL,
  [when_added]      INT       DEFAULT NULL,
  [who_added]       INT       DEFAULT NULL,
  [who_updated]     INT       DEFAULT NULL,
  PRIMARY KEY ([transaction_id]),
  CONSTRAINT [UK_piu8sb2aby57a9iiuqe614hut] UNIQUE ([order_id])
);

--#####################
--# TRANSACTION_ITEM
--#####################
CREATE TABLE [transaction_item] (
  [transaction_item_id] INT CHECK([transaction_item_id] > 0) NOT NULL IDENTITY,
  [transaction_id]      INT                                  DEFAULT NULL,
  [code]                VARCHAR(255)                         DEFAULT NULL,
  [product_id]          INT                                  DEFAULT NULL,
  [item_description]    VARCHAR(255)                         DEFAULT NULL,
  [item_price]          FLOAT(2)                             DEFAULT NULL,
  [item_tax]            FLOAT(2)                             DEFAULT NULL,
  [item_total_cost]     FLOAT(2)                             DEFAULT NULL,
  [when_added]          INT                                  DEFAULT NULL,
  [who_added]           INT                                  DEFAULT NULL,
  [who_updated]         INT                                  DEFAULT NULL,
  [timestamp]           INT                                  DEFAULT NULL,
  PRIMARY KEY ([transaction_item_id]),
  CONSTRAINT [FK1wc2dvhj3oos47in473fqi3q8] FOREIGN KEY (transaction_id) REFERENCES [transaction] (transaction_id)
);

--#####################
--# PAYMENT
--#####################
CREATE TABLE [payment] (
  [payment_id]                                      INT NOT NULL IDENTITY,                                    -- Primary Key
  [transaction_id]                                  INT DEFAULT NULL,                                         -- Foreign Key
  [pi_account_type]                                 VARCHAR(255) DEFAULT NULL,                                --
  [pi_card_type]                                    VARCHAR(255) DEFAULT NULL,                                --
  [pi_cardholder_name]                              VARCHAR(255) DEFAULT NULL,                                --
  [pi_country_issuance]                             VARCHAR(255) DEFAULT NULL,                                --
  [pi_credit_card_number]                           VARCHAR(255) DEFAULT NULL,                                --
  [pi_expiration_date]                              VARCHAR(255) DEFAULT NULL,                                --
  [pi_payment_type]                                 VARCHAR(255) DEFAULT NULL,                                --
  [pi_transaction_origin]                           VARCHAR(255) DEFAULT NULL,                                --
  [ti_amount]                                       VARCHAR(255) DEFAULT NULL,                                --
  [ti_merchant]                                     VARCHAR(255) DEFAULT NULL,                                --
  [ti_merchant_account]                             VARCHAR(255) DEFAULT NULL,                                --
  [ti_processor_authorization_code]                 VARCHAR(255) DEFAULT NULL,                                --
  [ti_settlement_batch]                             VARCHAR(255) DEFAULT NULL,                                --
  [ti_status]                                       VARCHAR(255) DEFAULT NULL,                                --
  [ti_transaction_date]                             INT DEFAULT NULL,                                --
  [ti_transaction_type]                             VARCHAR(255) DEFAULT NULL,                                --
  [who_added]                                       INT DEFAULT NULL,                                         -- id of who added
  [who_updated]                                     INT DEFAULT NULL,                                         -- id of who updated
  [when_added]                                      INT DEFAULT NULL,                                         -- unix timestamp when added
  [timestamp]                                       INT DEFAULT NULL,                                         -- unix timestamp when updated
  PRIMARY KEY                                       ([payment_id])                         --
);

--##########################
--# INSERT DEFAULT VALUES
--##########################
INSERT INTO [user] (first_name, last_name, email, email_status, password, status, who_added)
VALUES ('John', 'Doe', 'admin@roboburger.com', 'ACT', '$2a$10$g/kHyfgw1vt1Imm3S8YnJeoUfV6mXXSLSlDF.B3Hhzf11jO1FnCd6', 'ACT', '1');

SELECT * FROM [user]

SELECT * FROM [verification]