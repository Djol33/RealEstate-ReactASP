IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp' AND TABLE_NAME = 'realestate' AND COLUMN_NAME = 'created_at')
BEGIN
    ALTER TABLE [phpapp].[realestate]
    ADD [created_at] DATETIME NOT NULL CONSTRAINT DF_realestate_created_at DEFAULT (GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp' AND TABLE_NAME = 'realestate' AND COLUMN_NAME = 'sold_at')
BEGIN
    ALTER TABLE [phpapp].[realestate] ADD [sold_at] DATETIME NULL;
END

UPDATE [phpapp].[realestate]
SET [sold_at] = GETDATE()
WHERE [status] = 2 AND [sold_at] IS NULL;
